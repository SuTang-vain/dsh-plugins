'use strict'
// Minimal YAML-subset parser sufficient for dsh-plugin-kit config files:
//   - block maps (`key: value`) and lists (`- value` / `- key: value`)
//   - 2-space indentation per level
//   - scalars: bare, single-quoted (no escapes), double-quoted (\\ \" \' \n \t)
//   - flow lists: [a, b, "c, d"]
//   - full-line comments and trailing ` #` comments (quote-aware)
// Anything else (anchors, block scalars, flow maps, tabs) is rejected loudly.

function fail(msg, line) {
  throw new Error('dsh-plugin-kit yaml: ' + msg + (line !== undefined ? ' (line ' + line + ')' : ''))
}

function stripComment(line) {
  let inStr = null
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inStr) {
      if (ch === '\\') { i++; continue }
      if (ch === inStr) inStr = null
      continue
    }
    if (ch === "'" || ch === '"') inStr = ch
    else if (ch === '#' && (i === 0 || line[i - 1] === ' ' || line[i - 1] === '\t')) return line.slice(0, i)
  }
  return line
}

function parseScalar(text) {
  const t = text.trim()
  if (t === '') return null
  if (t[0] === '"' || t[0] === "'") {
    const q = t[0]
    if (t.length < 2 || t[t.length - 1] !== q) fail('unterminated quoted scalar: ' + text)
    const inner = t.slice(1, -1)
    if (q === "'") return inner
    let out = ''
    for (let i = 0; i < inner.length; i++) {
      const ch = inner[i]
      if (ch === '\\') {
        const esc = inner[++i]
        if (esc === 'n') out += '\n'
        else if (esc === 't') out += '\t'
        else if (esc === '\\' || esc === '"' || esc === "'") out += esc
        else fail('unsupported escape \\' + esc)
      } else out += ch
    }
    return out
  }
  if (t === 'true') return true
  if (t === 'false') return false
  if (t === 'null' || t === '~') return null
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t)
  return t
}

function parseFlow(text) {
  const t = text.trim()
  if (!(t.startsWith('[') && t.endsWith(']'))) return parseScalar(t)
  const inner = t.slice(1, -1).trim()
  if (inner === '') return []
  const out = []
  let cur = ''
  let inStr = null
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i]
    if (inStr) {
      cur += ch
      if (ch === '\\') { cur += inner[i + 1] || ''; i++; continue }
      if (ch === inStr) inStr = null
      continue
    }
    if (ch === "'" || ch === '"') { inStr = ch; cur += ch; continue }
    if (ch === '[' || ch === ']') fail('nested flow lists are not supported')
    if (ch === ',') { out.push(parseScalar(cur)); cur = ''; continue }
    cur += ch
  }
  out.push(parseScalar(cur))
  return out
}

function parseBlock(state, indent) {
  const items = state.items
  let idx = state.idx
  if (idx >= items.length || items[idx].indent <= indent) return null
  const blockIndent = items[idx].indent
  const isList = items[idx].text === '-' || items[idx].text.startsWith('- ')
  if (isList) {
    const out = []
    while (idx < items.length && items[idx].indent === blockIndent) {
      const line = items[idx].text
      if (!(line === '-' || line.startsWith('- '))) fail('mixed map/list block', items[idx].lineNo)
      const rest = line === '-' ? '' : line.slice(2).trim()
      idx++
      if (rest === '') {
        const nestedState = { idx, items }
        out.push(parseBlock(nestedState, blockIndent))
        idx = nestedState.idx
      } else {
        const colon = rest.indexOf(':')
        if (colon > 0 && (rest[colon + 1] === ' ' || colon === rest.length - 1) && !rest.slice(0, colon).trim().includes(' ')) {
          const key = rest.slice(0, colon).trim()
          const after = rest.slice(colon + 1).trim()
          if (after === '') {
            const nestedState = { idx, items }
            out.push({ [key]: parseBlock(nestedState, blockIndent) })
            idx = nestedState.idx
          } else {
            const element = { [key]: parseFlow(after) }
            // merge continuation keys of this list item (`- key: value` + deeper `other: x`)
            if (idx < items.length && items[idx].indent === blockIndent + 2) {
              const nestedState = { idx, items }
              const extra = parseBlock(nestedState, blockIndent)
              if (extra && typeof extra === 'object' && !Array.isArray(extra)) Object.assign(element, extra)
              idx = nestedState.idx
            }
            out.push(element)
          }
        } else {
          out.push(parseFlow(rest))
        }
      }
    }
    state.idx = idx
    return out
  }
  const out = {}
  while (idx < items.length && items[idx].indent === blockIndent) {
    const line = items[idx].text
    const colon = line.indexOf(':')
    if (colon < 0) fail('expected key: value', items[idx].lineNo)
    const key = line.slice(0, colon).trim()
    const after = line.slice(colon + 1).trim()
    idx++
    if (after === '') {
      const nestedState = { idx, items }
      out[key] = parseBlock(nestedState, blockIndent)
      idx = nestedState.idx
    } else {
      out[key] = parseFlow(after)
    }
  }
  state.idx = idx
  return out
}

function parse(text) {
  const items = []
  let lineNo = 0
  for (const line of text.split('\n')) {
    lineNo++
    const stripped = stripComment(line)
    if (stripped.trim() === '') continue
    const m = /^(\s*)(\S.*)$/.exec(stripped)
    if (m[1].includes('\t')) fail('tabs are not allowed for indentation', lineNo)
    if (m[1].length % 2 !== 0) fail('indent must be a multiple of 2 spaces', lineNo)
    items.push({ indent: m[1].length, text: m[2], lineNo })
  }
  const state = { idx: 0, items }
  const value = parseBlock(state, -2)
  if (state.idx < items.length) fail('unexpected content', items[state.idx].lineNo)
  return value
}

module.exports = { parse }
