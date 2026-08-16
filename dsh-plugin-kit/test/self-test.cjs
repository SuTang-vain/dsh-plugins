'use strict'
// Self-test for dsh-plugin-kit. Zero dependencies, plain node.
// Usage: node dsh-plugin-kit/test/self-test.cjs
// Covers: the YAML subset parser, the JSON path walker, the bundle
// assembly protocol (fixture round-trip), and one end-to-end runner run.

const assert = require('assert')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { parse } = require('../lib/yaml.cjs')
const { walk } = require('../lib/checks.cjs')
const { genBundle } = require('../lib/genbundle.cjs')

let passed = 0
const failures = []
const queue = []
function test(name, fn) {
  queue.push(Promise.resolve().then(fn).then(
    function () { passed++; console.log('ok   ' + name) },
    function (error) {
      failures.push(name + ': ' + error.message)
      console.log('FAIL ' + name + ': ' + error.message)
    }
  ))
}

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-plugin-kit-test-'))
}

// --- yaml.cjs ------------------------------------------------------------

test('yaml parses maps, lists, scalars and flow lists', () => {
  const v = parse([
    'version: 1',
    'verify:',
    '  - json: data/a.json',
    '  - count:',
    '      file: data/a.json',
    '      path: items.length',
    '      equals: 2',
    '  - replace:',
    '      - [React., react.]',
    '      - ["a, b", "c"]'
  ].join('\n'))
  assert.strictEqual(v.version, 1)
  assert.strictEqual(v.verify.length, 3)
  assert.deepStrictEqual(v.verify[0], { json: 'data/a.json' })
  assert.deepStrictEqual(v.verify[1].count, { file: 'data/a.json', path: 'items.length', equals: 2 })
  assert.deepStrictEqual(v.verify[2].replace, [['React.', 'react.'], ['a, b', 'c']])
})

test('yaml merges list-item continuation keys', () => {
  const v = parse('- parse: plugin.host.js\n  mode: function-body\n- parse: index.js\n  mode: node-check')
  assert.deepStrictEqual(v[0], { parse: 'plugin.host.js', mode: 'function-body' })
  assert.deepStrictEqual(v[1], { parse: 'index.js', mode: 'node-check' })
})

test('yaml decodes double-quoted escapes and keeps single quotes literal', () => {
  const v = parse('a: "line1\\nline2\\t\\"q\\""\nb: \'no\\nescapes\'')
  assert.strictEqual(v.a, 'line1\nline2\t"q"')
  assert.strictEqual(v.b, 'no\\nescapes')
})

test('yaml strips full-line and trailing comments (quote-aware)', () => {
  const v = parse('a: 1 # trailing\n# full line\nb: "x # y"')
  assert.strictEqual(v.a, 1)
  assert.strictEqual(v.b, 'x # y')
})

test('yaml rejects unsupported constructs with a line number', () => {
  const cases = [
    'a:\n\tb: 1', // tab indent
    'a:\n   b: 1', // odd indent
    'a: [1, [2]]', // nested flow
    'a: "\\q"', // unknown escape
    'a: "unterminated', // unterminated quote
    'a: 1\njunk', // trailing junk
    'a: 1\n- x' // mixed map/list
  ]
  for (const src of cases) {
    assert.throws(() => parse(src), /dsh-plugin-kit yaml/)
  }
})

// --- walk -----------------------------------------------------------------

test('walk resolves dot/bracket paths and .length', () => {
  const value = { branches: [{ head: 'v2', nodes: [{ id: 'a' }, { id: 'b' }] }], label: 'abc' }
  assert.strictEqual(walk(value, 'branches[0].head'), 'v2')
  assert.strictEqual(walk(value, 'branches[0].nodes.length'), 2)
  assert.strictEqual(walk(value, ['branches', 0, 'nodes', 'length']), 2)
  assert.strictEqual(walk(value, 'label.length'), 3)
  assert.strictEqual(walk(value, 'nope.deep'), undefined)
})

// --- genbundle -------------------------------------------------------------

test('genbundle assembles the bundle per the protocol', async () => {
  const dir = tmpdir()
  fs.mkdirSync(path.join(dir, 'tools', 'bundle'), { recursive: true })
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'fixture-plugin', version: '0.9.9' }))
  fs.writeFileSync(path.join(dir, 'plugin.client.js'), [
    '// dynamic header comment (must be dropped)',
    "const STYLES = [",
    "  '.x { color: red; }'",
    "].join('\\n')",
    '',
    'const ICONS = { grid: [] }',
    '',
    'function Icon(props) {',
    "  return React.createElement('span', null, props.name)",
    '}',
    '',
    'function Dashboard(props) {',
    "  const v = host.call('x', { a: 1 })",
    "  return React.createElement('div', null, v)",
    '}',
    '',
    'return {',
    "  name: 'fixture-plugin',",
    '  apply(ctx) {',
    "    const slots = ctx.get('slots')",
    '    if (slots === undefined) return',
    '    styles.insert(STYLES)',
    '  },',
    '}'
  ].join('\n'))
  fs.writeFileSync(path.join(dir, 'dsh-plugin-kit.yml'), [
    'version: 1',
    'bundle:',
    '  name: fixture-plugin',
    '  id: fixture-plugin',
    '  from: plugin.client.js',
    '  to: lib/client.js',
    '  version-source: package.json',
    '  cut-before: "const STYLES = ["',
    "  inject-after: \"].join('\\\\n')\"",
    "  cut-after: \"\\nreturn {\\n  name: 'fixture-plugin',\\n  apply(ctx) {\"",
    '  replace:',
    '    - [React., react.]',
    '    - ["host.call(\'x\', { a: 1 })", "none()"]',
    '  templates:',
    '    wrapper-head: tools/bundle/wrapper-head.txt',
    '    header: tools/bundle/header.txt',
    '    helpers: tools/bundle/helpers.txt',
    '    tail: tools/bundle/tail.txt',
    '    wrapper-tail: tools/bundle/wrapper-tail.txt'
  ].join('\n'))
  fs.writeFileSync(path.join(dir, 'tools/bundle/wrapper-head.txt'), 'WRAP_HEAD {{id}}\n')
  fs.writeFileSync(path.join(dir, 'tools/bundle/header.txt'), 'HEAD {{name}} v{{version}}\n')
  fs.writeFileSync(path.join(dir, 'tools/bundle/helpers.txt'), '\nHELPERS\n')
  fs.writeFileSync(path.join(dir, 'tools/bundle/tail.txt'), '\nTAIL\n')
  fs.writeFileSync(path.join(dir, 'tools/bundle/wrapper-tail.txt'), '\nWRAP_TAIL\n')

  const result = await genBundle(dir)
  assert.strictEqual(result.to, 'lib/client.js')
  const out = fs.readFileSync(path.join(dir, 'lib/client.js'), 'utf8')
  const expected = [
    'WRAP_HEAD fixture-plugin',
    'HEAD fixture-plugin v0.9.9',
    'const STYLES = [',
    "  '.x { color: red; }'",
    "].join('\\n')",
    'HELPERS',
    '',
    '',
    'const ICONS = { grid: [] }',
    '',
    'function Icon(props) {',
    "  return react.createElement('span', null, props.name)",
    '}',
    '',
    'function Dashboard(props) {',
    '  const v = none()',
    '  return react.createElement(\'div\', null, v)',
    '}',
    '',
    'TAIL',
    '',
    'WRAP_TAIL'
  ].join('\n') + '\n'
  assert.strictEqual(out, expected)
  assert.ok(!out.includes('dynamic header comment'), 'dynamic header comment must be dropped')
  assert.ok(!out.includes('return {\n  name'), 'dynamic return block must be dropped')
})

// --- runner end-to-end ------------------------------------------------------

async function runVerify(configText, dataFiles) {
  const dir = tmpdir()
  fs.writeFileSync(path.join(dir, 'dsh-plugin-kit.yml'), configText)
  for (const [rel, content] of Object.entries(dataFiles)) fs.writeFileSync(path.join(dir, rel), content)
  const { main } = require('../lib/runner.cjs')
  return await main(dir, function () {})
}

test('runner passes a fully-satisfied config', async () => {
  const ok = await runVerify(
    'version: 1\nverify:\n  - json: data.json\n  - count:\n      file: data.json\n      path: items.length\n      equals: 2\n  - contains:\n      file: data.json\n      text: a',
    { 'data.json': '{"items":["a","b"]}' })
  assert.strictEqual(ok, true)
})

test('runner fails when a check disagrees', async () => {
  const ok = await runVerify(
    'version: 1\nverify:\n  - count:\n      file: data.json\n      path: items.length\n      equals: 3',
    { 'data.json': '{"items":["a","b"]}' })
  assert.strictEqual(ok, false)
})

test('runner reports unknown check types as failures', async () => {
  const ok = await runVerify('version: 1\nverify:\n  - made-up: x', {})
  assert.strictEqual(ok, false)
})

Promise.all(queue).then(function () {
  console.log(failures.length === 0
    ? '\n' + passed + ' TESTS PASSED'
    : '\n' + failures.length + ' TESTS FAILED')
  process.exit(failures.length === 0 ? 0 : 1)
})
