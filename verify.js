#!/usr/bin/env node
'use strict'
// Thin wrapper over dsh-plugin-kit verify; keeps `node verify.js` working
// in CI and locally. The invariants live in dsh-plugin-kit.yml plus
// dsh-plugin-kit.ext.cjs; run `dsh-plugin-kit verify` for the CLI form.
require('./dsh-plugin-kit/lib/runner.cjs').main(__dirname).then(
  function (allPass) { process.exit(allPass ? 0 : 1) },
  function (error) {
    console.error('verify failed: ' + String(error && error.message ? error.message : error))
    process.exit(1)
  }
)
