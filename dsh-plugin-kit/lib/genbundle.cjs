'use strict'
// Template-driven generator for the official dsh.client web bundle
// (window.__ModuleLoader__ factory format) from a plugin's dynamic client
// variant. Assembly protocol, declared in <plugin>/dsh-plugin-kit.yml:
//
//   bundle:
//     name: dsh-evidence-dashboard          # {{name}} substitution
//     id: dsh-evidence-dashboard            # {{id}} substitution
//     from: plugin.client.js                # dynamic variant (source)
//     to: lib/client.js                     # generated bundle (output)
//     version-source: package.json          # optional; or pass version as argv
//     cut-after: "\nreturn {\n..."          # dynamic return block starts here
//     inject-after: "].join('\\n')"         # helpers are injected right after
//     replace:                              # literal [from, to] pairs applied
//       - [React., react.]                  #   to the section after inject-after
//     templates:                            # files, {{var}} placeholders allowed
//       wrapper-head: tools/bundle/wrapper-head.txt
//       header: tools/bundle/header.txt
//       helpers: tools/bundle/helpers.txt
//       tail: tools/bundle/tail.txt
//       wrapper-tail: tools/bundle/wrapper-tail.txt
//
// Output = wrapper-head + header + <from up to inject-after> + helpers
//        + <after inject-after up to cut-after, with replaces> + tail
//        + wrapper-tail.

const fs = require('fs')
const path = require('path')
const { parse } = require('./yaml.cjs')

function render(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, function (m, key) {
    return key in vars ? String(vars[key]) : m
  })
}

async function genBundle(pluginDir, versionOverride) {
  const configFile = path.join(pluginDir, 'dsh-plugin-kit.yml')
  if (!fs.existsSync(configFile)) throw new Error('no dsh-plugin-kit.yml in ' + pluginDir)
  const config = parse(fs.readFileSync(configFile, 'utf8'))
  const b = config.bundle || {}
  if (!b.from || !b.to) throw new Error('bundle.from / bundle.to are required')
  if (!b['cut-after'] || !b['inject-after']) throw new Error('bundle.cut-after / bundle.inject-after are required')

  // Normalize CRLF so cut markers that contain literal \n work on Windows checkouts.
  const src = fs.readFileSync(path.join(pluginDir, b.from), 'utf8').replace(/\r\n?/g, '\n')
  const startIdx = b['cut-before'] ? src.indexOf(b['cut-before']) : 0
  if (startIdx < 0) throw new Error('bundle.cut-before marker not found in ' + b.from)
  const cutIdx = src.indexOf(b['cut-after'])
  const injectIdx = src.indexOf(b['inject-after'])
  if (cutIdx < 0 || injectIdx < 0) throw new Error('cut-after/inject-after markers not found in ' + b.from)

  const stylesBlock = src.slice(startIdx, injectIdx + b['inject-after'].length)
  let rest = src.slice(injectIdx + b['inject-after'].length, cutIdx)
  for (const pair of b.replace || []) {
    if (!Array.isArray(pair) || pair.length !== 2) throw new Error('bundle.replace entries must be [from, to] pairs')
    rest = rest.split(pair[0]).join(pair[1])
  }

  let version = versionOverride
  if (!version && b['version-source']) {
    const pkg = JSON.parse(fs.readFileSync(path.join(pluginDir, b['version-source']), 'utf8'))
    version = pkg.version
  }
  if (!version) throw new Error('version missing: pass it as an argument or set bundle.version-source')

  const vars = { name: b.name || '', id: b.id || '', version, from: b.from, to: b.to }
  const templates = b.templates || {}
  const load = function (key) {
    const rel = templates[key]
    if (!rel) throw new Error('bundle.templates.' + key + ' is required')
    return render(fs.readFileSync(path.join(pluginDir, rel), 'utf8').replace(/\r\n?/g, '\n'), vars)
  }

  const bundle = load('wrapper-head') + load('header') + stylesBlock + load('helpers') + rest + load('tail') + load('wrapper-tail')
  const toAbs = path.join(pluginDir, b.to)
  fs.mkdirSync(path.dirname(toAbs), { recursive: true })
  fs.writeFileSync(toAbs, bundle)
  return { to: b.to, bytes: Buffer.byteLength(bundle) }
}

module.exports = { genBundle }
