#!/usr/bin/env node
'use strict'
// dsh-plugin-kit — QA toolkit for DSH plugin bundles.
//
//   dsh-plugin-kit verify [--root <dir>]        run checks from dsh-plugin-kit.yml
//   dsh-plugin-kit gen-bundle <plugin-dir> [v]  regenerate the client bundle

const path = require('path')

function usage() {
  console.log('usage:')
  console.log('  dsh-plugin-kit verify [--root <dir>]')
  console.log('  dsh-plugin-kit gen-bundle <plugin-dir> [version]')
  process.exit(2)
}

function done(promise) {
  promise.then(
    function (ok) { process.exit(ok ? 0 : 1) },
    function (error) {
      console.error(String(error && error.message ? error.message : error))
      process.exit(1)
    }
  )
}

const args = process.argv.slice(2)
const cmd = args[0]
if (cmd === 'verify') {
  const rootIdx = args.indexOf('--root')
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx + 1]) : process.cwd()
  done(require('../lib/runner.cjs').main(root))
} else if (cmd === 'gen-bundle') {
  if (!args[1]) usage()
  const dir = path.resolve(args[1])
  done(require('../lib/genbundle.cjs').genBundle(dir, args[2]).then(function (r) {
    console.log('generated ' + path.join(dir, r.to) + ' (' + r.bytes + ' bytes)')
    return true
  }))
} else {
  usage()
}
