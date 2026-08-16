#!/usr/bin/env node
'use strict'
// Thin wrapper over dsh-plugin-kit's bundle generator; keeps the historical
// entry point working. Assembly rules live in dsh-plugin-kit.yml and the
// templates under tools/bundle/. Prefer:
//   dsh-plugin-kit gen-bundle plugins/evidence-dashboard [version]
const path = require('path')
require('../../../dsh-plugin-kit/lib/genbundle.cjs').genBundle(path.join(__dirname, '..'), process.argv[2]).then(
  function (result) { console.log('generated ' + result.to + ' (' + result.bytes + ' bytes)') },
  function (error) {
    console.error('gen-bundle failed: ' + String(error && error.message ? error.message : error))
    process.exit(1)
  }
)
