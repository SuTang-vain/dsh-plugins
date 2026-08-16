'use strict'
// Builtin check primitives. Each check is an async function
//   (ctx, spec) => Promise<Array<{ pass: boolean, message: string }>>
// where ctx = { root, config } and spec is the value of the check's key
// in the verify list (a scalar for shorthand forms, an object otherwise).

const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

function fail(message) {
  throw new Error('dsh-plugin-kit checks: ' + message)
}

function abs(root, file) {
  return path.isAbsolute(file) ? file : path.join(root, file)
}

function read(root, file) {
  return fs.readFileSync(abs(root, file), 'utf8')
}

// walk(value, "branches[0].nodes.length") === walk(value, ["branches", 0, "nodes", "length"])
function walk(value, specPath) {
  let parts
  if (Array.isArray(specPath)) parts = specPath.slice()
  else {
    parts = []
    const re = /(?:^|\.)([^.[\]]+)|\[(\d+)\]/g
    let m
    while ((m = re.exec(specPath))) {
      if (m[1] !== undefined) parts.push(m[1])
      else parts.push(Number(m[2]))
    }
    if (parts.length === 0 && specPath.trim() !== '') parts.push(specPath.trim())
  }
  let cur = value
  for (const p of parts) {
    if (cur === null || cur === undefined) return undefined
    if (p === 'length') cur = Array.isArray(cur) ? cur.length : (typeof cur === 'string' ? cur.length : undefined)
    else cur = cur[p]
  }
  return cur
}

const checks = {
  parse: async (ctx, spec) => {
    const file = spec.file || spec.parse
    if (!file) fail('parse needs a file')
    const mode = spec.mode
    if (mode !== 'function-body' && mode !== 'node-check') fail('parse.mode must be "function-body" or "node-check": ' + file)
    if (mode === 'function-body') {
      try {
        new Function(read(ctx.root, file))
        return [{ pass: true, message: 'source parses: ' + file }]
      } catch (error) {
        return [{ pass: false, message: 'source parses: ' + file + ' -> ' + error.message }]
      }
    }
    const check = spawnSync(process.execPath, ['--check', abs(ctx.root, file)], { encoding: 'utf8' })
    const pass = check.status === 0
    return [{ pass, message: 'bundle entry syntax: ' + file + (pass ? '' : ' -> ' + String(check.stderr).trim().split('\n')[0]) }]
  },

  json: async (ctx, spec) => {
    const file = spec.file || spec.json
    if (!file) fail('json needs a file')
    try {
      JSON.parse(read(ctx.root, file))
      return [{ pass: true, message: 'json parses: ' + file }]
    } catch (error) {
      return [{ pass: false, message: 'json parses: ' + file + ' -> ' + error.message }]
    }
  },

  contains: async (ctx, spec) => {
    const { file, text } = spec
    if (!file || text === undefined) fail('contains needs file and text')
    const present = read(ctx.root, file).includes(String(text))
    return [{ pass: spec.not ? !present : present, message: spec.message || ('contains: ' + file + (spec.not ? ' (not ' + JSON.stringify(String(text)) + ')' : ' (' + JSON.stringify(String(text)) + ')')) }]
  },

  'file-exists': async (ctx, spec) => {
    const file = spec.file || spec['file-exists']
    if (!file) fail('file-exists needs a file')
    return [{ pass: fs.existsSync(abs(ctx.root, file)), message: 'file exists: ' + file }]
  },

  property: async (ctx, spec) => {
    const { file, path: specPath } = spec
    const value = JSON.parse(read(ctx.root, file))
    const got = walk(value, specPath)
    let pass = got !== undefined
    if (pass && spec.type) pass = typeof got === spec.type
    if (pass && spec.equals !== undefined) pass = got === spec.equals
    return [{ pass, message: spec.message || ('property: ' + file + ' @ ' + JSON.stringify(specPath) + (spec.equals !== undefined ? ' === ' + JSON.stringify(spec.equals) : '')) }]
  },

  'resolves-file': async (ctx, spec) => {
    const { file, path: specPath, base } = spec
    const value = JSON.parse(read(ctx.root, file))
    const target = walk(value, specPath)
    const pass = typeof target === 'string' && fs.existsSync(path.join(ctx.root, base || '.', target))
    return [{ pass, message: spec.message || ('resolves-file: ' + file + ' @ ' + JSON.stringify(specPath)) }]
  },

  count: async (ctx, spec) => {
    const { file, path: specPath, equals } = spec
    const value = JSON.parse(read(ctx.root, file))
    let got = walk(value, specPath)
    if (Array.isArray(got)) got = got.length
    const pass = got !== undefined && got === equals
    return [{ pass, message: spec.message || ('count: ' + file + ' @ ' + JSON.stringify(specPath) + ' === ' + equals) }]
  },

  'graph-parents': async (ctx, spec) => {
    const { file, branches } = spec
    const value = JSON.parse(read(ctx.root, file))
    const list = walk(value, branches)
    if (!Array.isArray(list)) fail('graph-parents: branches path must resolve to an array')
    const out = []
    for (const branch of list) {
      for (const node of branch.nodes || []) {
        out.push({
          pass: typeof node.id === 'string' && typeof node.kind === 'string' && typeof node.summary === 'string',
          message: (spec['node-message'] || 'graph node well-formed') + ': ' + node.id
        })
        for (const parentId of node.parents || []) {
          out.push({
            pass: typeof parentId === 'string' && (branch.nodes || []).some((n) => n.id === parentId),
            message: (spec['parent-message'] || 'graph node parent exists') + ': ' + node.id + ' -> ' + parentId
          })
        }
      }
    }
    return out
  },

  'pack-dry-run': async (ctx, spec) => {
    const dir = spec.dir || spec['pack-dry-run']
    if (!dir) fail('pack-dry-run needs a dir (or use the shorthand form)')
    const args = ['pack', '--dry-run', '--json'].concat(Array.isArray(spec.args) ? spec.args : [])
    const result = spawnSync('npm', args, { cwd: path.join(ctx.root, dir), encoding: 'utf8' })
    let extra = ''
    if (result.status === 0) {
      try {
        const json = JSON.parse(result.stdout)
        const first = Array.isArray(json) ? json[0] : json
        if (first && first.filename) extra = ' -> ' + first.filename + ' (' + first.size + ' bytes)'
      } catch (ignored) { /* keep extra empty */ }
    } else {
      extra = ' -> ' + String(result.stderr || result.stdout).trim().split('\n')[0]
    }
    return [{ pass: result.status === 0, message: (spec.message || 'pack dry-run') + ': ' + dir + extra }]
  }
}

module.exports = { checks, walk }
