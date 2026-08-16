'use strict'
// Domain-specific extensions for dsh-self-harness-tools.
// Every export runs after the builtin checks in dsh-plugin-kit.yml and
// reports through ctx.ok(cond, message). ctx = { root, config, ok }.

const fs = require('fs')
const path = require('path')

// The probe batteries are embedded in the plugin host source; verify the
// embedded copies are byte-equal to the data/ originals and spot-check the
// grader regexes against representative answers.
function batteryByteEqual(ctx) {
  const root = ctx.root
  const hostSrc = fs.readFileSync(path.join(root, 'plugins/prior-probe/plugin.host.js'), 'utf8')
  const start = hostSrc.indexOf('const BATTERIES')
  const end = hostSrc.lastIndexOf("return {\n  name: 'dsh-prior-probe',")
  if (start < 0 || end < 0) {
    ctx.ok(false, 'prior-probe source layout (BATTERIES extraction)')
    return
  }
  const lib = new Function('harness', 'web', hostSrc.slice(start, end) + '; return { BATTERIES, matchProbe }')(
    { registerTool() {}, defineTool(t) { return t } }, undefined)
  const v1file = JSON.parse(fs.readFileSync(path.join(root, 'plugins/prior-probe/data/prior-guessability-probes-v1.json'), 'utf8'))
  const tsfile = JSON.parse(fs.readFileSync(path.join(root, 'plugins/prior-probe/data/prior-guessability-probes-ts-mcp-v1.json'), 'utf8'))
  ctx.ok(JSON.stringify(lib.BATTERIES.v1.probes) === JSON.stringify(v1file.probes), 'embedded v1 probes byte-equal to data/ original')
  ctx.ok(JSON.stringify(lib.BATTERIES.tsmcp.probes) === JSON.stringify(tsfile.probes), 'embedded ts-mcp probes byte-equal to data/ original')

  // Calibration metadata must stay in sync across the embedded copy and the
  // data/ original, and must form a coherent calibration window.
  const metaPairs = [['v1', v1file], ['tsmcp', tsfile]]
  for (const [key, dataFile] of metaPairs) {
    const embedded = lib.BATTERIES[key]
    ctx.ok(embedded.frozen_at === dataFile.frozen_at, 'embedded ' + key + ' frozen_at equals data/ original')
    ctx.ok(embedded.stale_after === dataFile.stale_after, 'embedded ' + key + ' stale_after equals data/ original')
    ctx.ok(embedded.recalibrate_hint === dataFile.recalibrate_hint, 'embedded ' + key + ' recalibrate_hint equals data/ original')
    const iso = /^\d{4}-\d{2}-\d{2}$/
    ctx.ok(iso.test(String(dataFile.stale_after || '')) && String(dataFile.stale_after) > String(dataFile.frozen_at), key + ' stale_after is an ISO date after frozen_at')
  }

  const spots = [
    ['headless-eval-pin', 'The exact value of the pin field is eval-pin-7f3a.', 1],
    ['editing-provider-value', 'The provider field should be set to spawn.', 1],
    ['gfw-commit-type', 'feat: add a new feature', 1],
    ['editing-realm-group', 'I do not know the exact composition structure.', 0],
    ['tsmcp-zod-major', 'SDK v2 requires zod version 4.', 1],
    ['tsmcp-removed-transports', 'SSE and WebSocket transports were removed.', 1],
    ['tsmcp-http-class', 'Use NodeStreamableHTTPServerTransport.', 1]
  ]
  for (const [id, text, expected] of spots) {
    let probe = null
    for (const key of ['v1', 'tsmcp']) {
      for (const p of lib.BATTERIES[key].probes) if (p.id === id) probe = p
    }
    const got = lib.matchProbe(probe, text)
    ctx.ok(got.pass === expected && !got.error, 'regex spot check ' + id + ' -> pass=' + got.pass)
  }
}

// The version tree must render the documented fork/merge shapes.
function versionMergeShapes(ctx) {
  const versions = JSON.parse(fs.readFileSync(path.join(ctx.root, 'plugins/evidence-dashboard/data/versions.json'), 'utf8'))
  const nodes = versions.branches[0].nodes
  const v140 = nodes.find((n) => n.id === 'v1.4.0')
  ctx.ok(v140 && v140.parents.length === 2 && v140.parents[0] === 'v1.4.0-rc' && v140.parents[1] === 'v1.3.1', 'v1.4.0 renders as a merge of the release candidate and the v1.3.1 hotfix')
  const v160 = nodes.find((n) => n.id === 'v1.6.0')
  ctx.ok(v160 && v160.parents.length === 2 && v160.parents[0] === 'v1.6.0-rc' && v160.parents[1] === 'v1.5.1', 'v1.6.0 renders as a merge of the release candidate and the v1.5.1 hotfix')
  const v162 = nodes.find((n) => n.id === 'v1.6.2')
  ctx.ok(v162 && v162.parents.length === 1 && v162.parents[0] === 'v1.6.1', 'v1.6.2 continues linearly from v1.6.1')
  const v170 = nodes.find((n) => n.id === 'v1.7.0')
  ctx.ok(v170 && v170.parents.length === 1 && v170.parents[0] === 'v1.6.2', 'v1.7.0 continues linearly from v1.6.2')
}

module.exports = { batteryByteEqual, versionMergeShapes }
