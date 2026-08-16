#!/usr/bin/env node
'use strict'
// Self-check for the DSH plugin suite.
// Verifies: plugin sources parse as Cordis function bodies, every data file
// parses as JSON, the dataset counts match the documented ones, the embedded
// probe batteries match their data/ originals, and the grader regexes behave
// as specified.
// Usage: node verify.js   (no dependencies)

const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')
const root = __dirname

const failures = []
function ok(cond, msg) {
  if (cond) console.log('PASS  ' + msg)
  else { failures.push(msg); console.log('FAIL  ' + msg) }
}

const sources = [
  'plugins/prior-probe/plugin.host.js',
  'plugins/evidence-dashboard/plugin.host.js',
  'plugins/evidence-dashboard/plugin.client.js'
]
for (const rel of sources) {
  const src = fs.readFileSync(path.join(root, rel), 'utf8')
  try {
    new Function(src) // parses exactly as a Cordis function body compiles
    ok(true, 'source parses: ' + rel)
  } catch (error) {
    ok(false, 'source parses: ' + rel + ' -> ' + error.message)
  }
}

// ESM bundle entries: syntax-check with node --check (respects the package's type)
for (const rel of ['plugins/prior-probe/index.js', 'plugins/evidence-dashboard/index.js', 'plugins/evidence-dashboard/lib/client.js']) {
  const check = spawnSync(process.execPath, ['--check', path.join(root, rel)], { encoding: 'utf8' })
  ok(check.status === 0, 'bundle entry syntax: ' + rel + (check.status === 0 ? '' : ' -> ' + String(check.stderr).trim().split('\n')[0]))
}

// Bundle manifests
for (const dir of ['plugins/prior-probe', 'plugins/evidence-dashboard']) {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, dir, 'package.json'), 'utf8'))
  ok(pkg.dsh && pkg.dsh.bundle && typeof pkg.dsh.bundle.patch === 'string', dir + ': package.json declares dsh.bundle.patch')
  ok(fs.existsSync(path.join(root, dir, pkg.dsh.bundle.patch)), dir + ': bundle patch file exists: ' + pkg.dsh.bundle.patch)
  const patch = fs.readFileSync(path.join(root, dir, pkg.dsh.bundle.patch), 'utf8')
  ok(patch.includes(pkg.name), dir + ': bundle patch layer references the package')
}

// evidence-dashboard client declaration + built bundle shape
{
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'plugins/evidence-dashboard/package.json'), 'utf8'))
  ok(pkg.dsh && pkg.dsh.client && pkg.dsh.client.platform === 'web', 'dashboard: package.json declares dsh.client with platform web')
  ok(pkg.exports && pkg.exports['./client'] && typeof pkg.exports['./client'] === 'string' && fs.existsSync(path.join(root, 'plugins/evidence-dashboard', pkg.exports['./client'])), 'dashboard: exports["./client"] points to an existing bundle')
  const clientSrc = fs.readFileSync(path.join(root, 'plugins/evidence-dashboard/lib/client.js'), 'utf8')
  ok(clientSrc.includes('window.__ModuleLoader__.load({') && clientSrc.includes('id: "dsh-evidence-dashboard"'), 'dashboard: client bundle uses the __ModuleLoader__ factory format')
}

const dataFiles = [
  'plugins/prior-probe/data/prior-guessability-probes-v1.json',
  'plugins/prior-probe/data/prior-guessability-probes-ts-mcp-v1.json',
  'plugins/evidence-dashboard/data/overview.json',
  'plugins/evidence-dashboard/data/evidence-map-v2.json',
  'plugins/evidence-dashboard/data/attention-conflict-matrix-v2.json',
  'plugins/evidence-dashboard/data/versions.json'
]
for (const rel of dataFiles) {
  try {
    JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'))
    ok(true, 'json parses: ' + rel)
  } catch (error) {
    ok(false, 'json parses: ' + rel + ' -> ' + error.message)
  }
}

const read = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'))

// Dataset counts
ok(read('plugins/prior-probe/data/prior-guessability-probes-v1.json').probes.length === 8, 'v1 battery has 8 probes')
ok(read('plugins/prior-probe/data/prior-guessability-probes-ts-mcp-v1.json').probes.length === 6, 'ts-mcp battery has 6 probes')
ok(read('plugins/evidence-dashboard/data/evidence-map-v2.json').entries.length === 4, 'decisions log has 4 entries')
ok(read('plugins/evidence-dashboard/data/attention-conflict-matrix-v2.json').entries.length === 3, 'rejected options log has 3 entries')
ok(read('plugins/evidence-dashboard/data/overview.json').components.length === 2, 'overview has 2 components')
const versionsGraph = read('plugins/evidence-dashboard/data/versions.json')
const versionNodes = versionsGraph.branches.reduce((acc, b) => acc + (b.nodes || []).length, 0)
ok(versionsGraph.schema_version === 'version-graph-v1', 'version graph schema is v1')
ok(versionsGraph.branches.length === 1, 'version graph has 1 branch')
ok(versionNodes === 11, 'version graph has 11 nodes')
for (const branch of versionsGraph.branches) for (const node of branch.nodes) {
  ok(typeof node.id === 'string' && typeof node.kind === 'string' && typeof node.summary === 'string', 'version node well-formed: ' + node.id)
  for (const parentId of (node.parents || [])) {
    ok(typeof parentId === 'string' && branch.nodes.some((n) => n.id === parentId), 'version node parent exists: ' + node.id + ' -> ' + parentId)
  }
}
const v140 = versionsGraph.branches[0].nodes.find((n) => n.id === 'v1.4.0')
ok(v140 && v140.parents.length === 2 && v140.parents[0] === 'v1.4.0-rc' && v140.parents[1] === 'v1.3.1', 'v1.4.0 renders as a merge of the release candidate and the v1.3.1 hotfix')
const v160 = versionsGraph.branches[0].nodes.find((n) => n.id === 'v1.6.0')
ok(v160 && v160.parents.length === 2 && v160.parents[0] === 'v1.6.0-rc' && v160.parents[1] === 'v1.5.1', 'v1.6.0 renders as a merge of the release candidate and the v1.5.1 hotfix')

// Embedded batteries must equal the data/ originals
const hostSrc = fs.readFileSync(path.join(root, 'plugins/prior-probe/plugin.host.js'), 'utf8')
const start = hostSrc.indexOf('const BATTERIES')
const end = hostSrc.lastIndexOf("return {\n  name: 'dsh-prior-probe',")
if (start < 0 || end < 0) ok(false, 'prior-probe source layout (BATTERIES extraction)')
else {
  const lib = new Function('harness', 'web', hostSrc.slice(start, end) + '; return { BATTERIES, matchProbe }')({ registerTool() {}, defineTool(t) { return t } }, undefined)
  const v1file = read('plugins/prior-probe/data/prior-guessability-probes-v1.json')
  const tsfile = read('plugins/prior-probe/data/prior-guessability-probes-ts-mcp-v1.json')
  ok(JSON.stringify(lib.BATTERIES.v1.probes) === JSON.stringify(v1file.probes), 'embedded v1 probes byte-equal to data/ original')
  ok(JSON.stringify(lib.BATTERIES.tsmcp.probes) === JSON.stringify(tsfile.probes), 'embedded ts-mcp probes byte-equal to data/ original')

  // Grader regex spot checks
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
    for (const key of ['v1', 'tsmcp']) for (const p of lib.BATTERIES[key].probes) if (p.id === id) probe = p
    const got = lib.matchProbe(probe, text)
    ok(got.pass === expected && !got.error, 'regex spot check ' + id + ' -> pass=' + got.pass)
  }
}

const changelogSnapshot = fs.readFileSync(path.join(root, 'plugins/evidence-dashboard/data/CHANGELOG.md'), 'utf8')
ok(changelogSnapshot.includes('## v1.4'), 'bundled CHANGELOG snapshot has a v1.4 section')

console.log(failures.length === 0 ? '\nALL CHECKS PASSED' : '\n' + failures.length + ' CHECKS FAILED')
process.exit(failures.length === 0 ? 0 : 1)
