'use strict'
// verify runner: reads dsh-plugin-kit.yml from the root directory, executes
// every builtin check from the `verify` list, then runs every export of
// dsh-plugin-kit.ext.cjs (if present) as a domain-specific extension.

const fs = require('fs')
const path = require('path')
const { parse } = require('./yaml.cjs')
const { checks } = require('./checks.cjs')

async function main(root, reporter) {
  const out = reporter || function (line) { console.log(line) }
  const err = function (line) { console.error(line) }
  const configFile = path.join(root, 'dsh-plugin-kit.yml')
  if (!fs.existsSync(configFile)) {
    err('no dsh-plugin-kit.yml found in ' + root)
    return false
  }
  let config
  try {
    config = parse(fs.readFileSync(configFile, 'utf8'))
  } catch (error) {
    err('cannot parse ' + configFile + ': ' + error.message)
    return false
  }

  let failures = 0
  let total = 0
  const report = function (pass, message) {
    total++
    if (pass) out('PASS  ' + message)
    else { failures++; out('FAIL  ' + message) }
  }

  const list = config.verify || []
  for (const item of list) {
    // Items may carry continuation keys next to the check name (YAML merges
    // `- parse: x` + `mode: y` into one object). The check is the unique key
    // that names a known check; the remaining keys become spec fields.
    const keys = Object.keys(item)
    const known = keys.filter((k) => checks[k])
    if (known.length !== 1) {
      report(false, 'verify entry must reference exactly one known check, got: ' + keys.join(', '))
      continue
    }
    const name = known[0]
    const impl = checks[name]
    const value = item[name]
    const extra = Object.assign({}, item)
    delete extra[name]
    const spec = (value !== null && typeof value === 'object' && !Array.isArray(value))
      ? Object.assign({}, value, extra)
      : Object.assign({ [name]: value }, extra)
    try {
      const results = await impl({ root, config }, spec)
      for (const r of results) report(Boolean(r.pass), r.message)
    } catch (error) {
      report(false, 'check ' + name + ' failed: ' + error.message)
    }
  }

  const extFile = path.join(root, 'dsh-plugin-kit.ext.cjs')
  if (fs.existsSync(extFile)) {
    const ext = require(extFile)
    const extCtx = { root, config, ok: report }
    for (const [name, fn] of Object.entries(ext)) {
      try {
        await fn(extCtx)
      } catch (error) {
        report(false, 'extension ' + name + ' failed: ' + error.message)
      }
    }
  }

  out(failures === 0
    ? '\nALL CHECKS PASSED (' + total + ')'
    : '\n' + failures + ' CHECKS FAILED (' + total + ' total)')
  return failures === 0
}

module.exports = { main }
