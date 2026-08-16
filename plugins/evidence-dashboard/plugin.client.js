// dsh-evidence-dashboard — Client half: renders the frozen evidence archive as
// an interactive panel. Registered in two additive slots:
//   tool.view.cordis (key 'self')  — inside this Package's latest run card
//   settings.section (dsh-evidence) — a full settings page for later browsing
// All data arrives over Package-private RPC from the Host half.
//
// v1.2: "Versions" tab renders the research lineage version history as a
// git-tree (branches, nodes, status colors) plus the repository changelog
// timeline below it.

const STYLES = [
  '.dsh-wrap { font-size: 13px; line-height: 1.5; color: var(--dsw-alias-label-primary, inherit); max-width: 860px; }',
  '.dsh-header { margin-bottom: 10px; }',
  '.dsh-title { font-size: 15px; font-weight: 600; margin: 0 0 2px; }',
  '.dsh-sub { color: var(--dsw-alias-label-secondary, inherit); opacity: 0.85; font-size: 12px; }',
  '.dsh-tabs { display: flex; gap: 6px; flex-wrap: wrap; margin: 10px 0; }',
  '.dsh-tab { background: transparent; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.4)); border-radius: 6px; padding: 4px 10px; cursor: pointer; font-size: 12px; color: inherit; }',
  '.dsh-tab-active { border-color: var(--dsw-alias-brand-primary, currentColor); font-weight: 600; }',
  '.dsh-badge { display: inline-block; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.5)); border-radius: 10px; padding: 0 7px; font-size: 11px; white-space: nowrap; margin-left: 4px; }',
  '.dsh-stack { display: flex; flex-direction: column; gap: 10px; }',
  '.dsh-h3 { font-size: 13px; font-weight: 600; margin: 4px 0; }',
  '.dsh-card { border: 1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.35)); border-radius: 8px; padding: 8px 10px; }',
  '.dsh-table { border-collapse: collapse; width: 100%; font-size: 12px; }',
  '.dsh-table th, .dsh-table td { border: 1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.35)); padding: 4px 7px; text-align: left; vertical-align: top; }',
  '.dsh-table th { color: var(--dsw-alias-label-secondary, inherit); font-weight: 600; }',
  '.dsh-muted { color: var(--dsw-alias-label-secondary, inherit); font-size: 12px; }',
  '.dsh-li { margin: 2px 0 2px 14px; }',
  '.dsh-err { color: var(--dsw-alias-state-error-primary, #d05); }',
  '.dsh-retry { margin-left: 8px; background: transparent; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.5)); border-radius: 6px; padding: 2px 8px; cursor: pointer; font-size: 12px; color: inherit; }',
  '.dsh-input { background: transparent; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.5)); border-radius: 6px; padding: 4px 8px; color: inherit; font-size: 12px; width: 240px; }',
  // git-tree styles
  '.dsh-gh-branch-head { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }',
  '.dsh-gh-branch { border-left: 3px solid var(--dsw-alias-brand-primary, #48e); }',
  '.dsh-gh-list { display: flex; flex-direction: column; }',
  '.dsh-gh-row { display: flex; gap: 10px; align-items: stretch; }',
  '.dsh-gh-node-row:hover { background: var(--dsw-alias-bg-layer-1, rgba(128,128,128,0.08)); border-radius: 8px; }',
  '.dsh-gh-connector { height: 13px; }',
  '.dsh-gh-cells { display: flex; flex: none; }',
  '.dsh-cell { position: relative; width: 16px; }',
  '.dsh-c-v { position: absolute; left: 7px; top: 0; bottom: 0; width: 2px; background: var(--dsw-alias-border-l2, rgba(128,128,128,0.6)); }',
  '.dsh-c-vtop { position: absolute; left: 7px; top: 0; height: 50%; width: 2px; background: var(--dsw-alias-border-l2, rgba(128,128,128,0.6)); }',
  '.dsh-c-stub-r { position: absolute; left: 8px; right: 0; top: 50%; height: 2px; margin-top: -1px; background: var(--dsw-alias-border-l2, rgba(128,128,128,0.6)); }',
  '.dsh-c-stub-l { position: absolute; left: 0; right: 8px; top: 50%; height: 2px; margin-top: -1px; background: var(--dsw-alias-border-l2, rgba(128,128,128,0.6)); }',
  '.dsh-c-hline { position: absolute; left: 0; right: 0; top: 50%; height: 2px; margin-top: -1px; background: var(--dsw-alias-border-l2, rgba(128,128,128,0.6)); }',
  '.dsh-gh-dot { position: absolute; left: 2px; top: 2px; width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.7)); box-shadow: 0 0 0 2px var(--dsw-alias-bg-base, transparent); z-index: 1; }',
  '.dsh-gh-initial { background: var(--dsw-alias-label-secondary, #888); }',
  '.dsh-gh-hotfix { background: var(--dsw-alias-state-warn-primary, #d90); }',
  '.dsh-gh-prerelease { background: var(--dsw-alias-brand-primary, #48e); }',
  '.dsh-gh-release { background: var(--dsw-alias-state-success-primary, #3a5); }',
  '.dsh-gh-reverted { background: var(--dsw-alias-state-error-primary, #d05); }',
  '.dsh-gh-eol { background: var(--dsw-alias-state-warn-primary, #d90); }',
  '.dsh-gh-label { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-weight: 700; font-size: 12.5px; margin-right: 8px; }',
  '.dsh-gh-hash { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; color: var(--dsw-alias-label-secondary, inherit); margin-right: 8px; }',
  '.dsh-gh-kind { font-size: 11px; margin-right: 8px; padding: 0 6px; border-radius: 8px; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.5)); color: var(--dsw-alias-label-secondary, inherit); }',
  '.dsh-gh-kind-initial { color: var(--dsw-alias-label-secondary, #888); border-color: currentColor; }',
  '.dsh-gh-kind-hotfix { color: var(--dsw-alias-state-warn-primary, #d90); border-color: currentColor; }',
  '.dsh-gh-kind-prerelease { color: var(--dsw-alias-brand-primary, #48e); border-color: currentColor; }',
  '.dsh-gh-kind-release { color: var(--dsw-alias-state-success-primary, #3a5); border-color: currentColor; }',
  '.dsh-gh-kind-reverted { color: var(--dsw-alias-state-error-primary, #d05); border-color: currentColor; }',
  '.dsh-gh-kind-eol { color: var(--dsw-alias-state-warn-primary, #d90); border-color: currentColor; }',
  '.dsh-gh-note { font-size: 11px; font-style: italic; color: var(--dsw-alias-label-secondary, inherit); }',
  '.dsh-gh-body { padding-bottom: 10px; }',
  '.dsh-gh-row:last-child .dsh-gh-body { padding-bottom: 0; }',
  // changelog timeline styles
  '.dsh-ch-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; background: var(--dsw-alias-state-success-primary, #3a5); }',
  '.dsh-ch-version { font-weight: 600; }',
  '.dsh-ch-sub { margin-top: 6px; }',
  '.dsh-ch-bullet { margin: 2px 0 2px 14px; }'
].join('\n')

const FALLBACK_TABS = [
  { id: 'overview', label: 'Overview', count: null },
  { id: 'evidence', label: 'Decisions', count: null },
  { id: 'conflicts', label: 'Rejected options', count: null },
  { id: 'versions', label: 'Versions', count: null }
]

function OverviewView(props) {
  const d = props.data
  if (!d) return null
  const columns = ['Component', 'Category', 'Status']
  return React.createElement('div', { className: 'dsh-stack' },
    React.createElement('div', { className: 'dsh-card' },
      React.createElement('div', { className: 'dsh-sub' }, 'Updated: ' + d.updated_at),
      React.createElement('div', { className: 'dsh-sub' }, 'Self-check: run `node verify.js` at the repository root')),
    React.createElement('div', null,
      React.createElement('h3', { className: 'dsh-h3' }, 'Components'),
      React.createElement('table', { className: 'dsh-table' },
        React.createElement('thead', null,
          React.createElement('tr', null, columns.map(function (c) { return React.createElement('th', { key: c }, c) }))),
        React.createElement('tbody', null, (d.components || []).map(function (t) {
          return React.createElement('tr', { key: t.id },
            React.createElement('td', null, React.createElement('b', null, t.id)),
            React.createElement('td', null, t.category),
            React.createElement('td', null, t.status))
        })))),
    d.highlights ? React.createElement('div', null,
      React.createElement('h3', { className: 'dsh-h3' }, 'Release highlights'),
      React.createElement('div', { className: 'dsh-card' },
        React.createElement('div', null, React.createElement('b', null, d.highlights.title)),
        React.createElement('ul', { style: { margin: '4px 0' } },
          (d.highlights.points || []).map(function (o) { return React.createElement('li', { key: o, className: 'dsh-li' }, o) })))) : null,
    d.performance ? React.createElement('div', null,
      React.createElement('h3', { className: 'dsh-h3' }, 'Runtime notes'),
      React.createElement('div', { className: 'dsh-card' },
        React.createElement('div', null, React.createElement('b', null, d.performance.title)),
        React.createElement('ul', { style: { margin: '4px 0' } },
          (d.performance.points || []).map(function (o) { return React.createElement('li', { key: o, className: 'dsh-li' }, o) })))) : null,
    d.principles ? React.createElement('div', null,
      React.createElement('h3', { className: 'dsh-h3' }, 'Design principles'),
      React.createElement('div', { className: 'dsh-card' },
        React.createElement('div', null, React.createElement('b', null, d.principles.title)),
        React.createElement('ul', { style: { margin: '4px 0' } },
          (d.principles.points || []).map(function (o) { return React.createElement('li', { key: o, className: 'dsh-li' }, o) })))) : null,
    d.compatibility ? React.createElement('div', null,
      React.createElement('h3', { className: 'dsh-h3' }, 'Compatibility'),
      React.createElement('div', { className: 'dsh-card' },
        React.createElement('div', null, React.createElement('b', null, d.compatibility.title)),
        React.createElement('ul', { style: { margin: '4px 0' } },
          (d.compatibility.points || []).map(function (o) { return React.createElement('li', { key: o, className: 'dsh-li' }, o) })))) : null)
}

function matches(query, fields) {
  if (!query) return true
  const hay = fields.join(' ').toLowerCase()
  return hay.indexOf(query.toLowerCase()) !== -1
}

function EvidenceView(props) {
  const d = props.data
  const query = props.query
  if (!d) return null
  const entries = (d.entries || []).filter(function (e) {
    return matches(query, [e.id || '', e.claim_level || '', e.target || ''])
  })
  return React.createElement('div', { className: 'dsh-stack' },
    React.createElement('div', { className: 'dsh-sub' }, 'schema ' + d.schema_version + ' · frozen ' + d.frozen_at + ' · showing ' + entries.length + '/' + (d.entries || []).length + ' entries'),
    entries.map(function (e) {
      return React.createElement('div', { key: e.id, className: 'dsh-card' },
        React.createElement('div', null,
          React.createElement('b', null, e.id), ' ',
          React.createElement('span', { className: 'dsh-badge' }, e.claim_level || '—')),
        React.createElement('div', { className: 'dsh-muted' }, 'source: ' + (e.source || '—')),
        (e.supports && e.supports.length) ? React.createElement('div', null, React.createElement('b', null, 'supports'), React.createElement('ul', { style: { margin: '2px 0' } }, e.supports.map(function (s) { return React.createElement('li', { key: s, className: 'dsh-li' }, s) }))) : null,
        (e.does_not_support && e.does_not_support.length) ? React.createElement('div', null, React.createElement('b', null, 'does not support'), React.createElement('ul', { style: { margin: '2px 0' } }, e.does_not_support.map(function (s) { return React.createElement('li', { key: s, className: 'dsh-li' }, s) }))) : null)
    }))
}

function ConflictsView(props) {
  const d = props.data
  const query = props.query
  if (!d) return null
  const entries = (d.entries || []).filter(function (e) {
    return matches(query, [e.id || '', e.target || '', e.path || '', e.lineage_decision || '', e.suspected_conflict || ''])
  })
  return React.createElement('div', { className: 'dsh-stack' },
    React.createElement('div', { className: 'dsh-sub' }, 'schema ' + d.schema_version + ' · frozen ' + d.frozen_at + ' · showing ' + entries.length + '/' + (d.entries || []).length + ' records'),
    entries.map(function (e) {
      return React.createElement('div', { key: e.id, className: 'dsh-card' },
        React.createElement('div', null,
          React.createElement('b', null, e.id), ' — ',
          React.createElement('span', { className: 'dsh-badge' }, e.lineage_decision || 'recorded'),
          ' (' + (e.target || '?') + ' · ' + (e.path || '?') + ')'),
        React.createElement('div', { className: 'dsh-muted' }, 'intended: ' + (e.intended_effect || '—')),
        (e.observed_benefit && e.observed_benefit.length) ? React.createElement('div', null, React.createElement('b', null, 'benefit'), React.createElement('ul', { style: { margin: '2px 0' } }, e.observed_benefit.map(function (s) { return React.createElement('li', { key: s, className: 'dsh-li' }, s) }))) : null,
        (e.observed_harm && e.observed_harm.length) ? React.createElement('div', null, React.createElement('b', null, 'harm'), React.createElement('ul', { style: { margin: '2px 0' } }, e.observed_harm.map(function (s) { return React.createElement('li', { key: s, className: 'dsh-li' }, s) }))) : null,
        e.suspected_conflict ? React.createElement('div', { className: 'dsh-muted' }, 'suspected conflict: ' + e.suspected_conflict) : null)
    }))
}

// Lane-based git-graph layout: assigns each node a lane, extends lane lives
// along cross-lane edges, and emits node rows plus connector rows carrying
// fork (corner + right/left stub) and merge (line-end + stub) cells.
function buildBranchRows(branch) {
  const nodes = branch.nodes
  const indexById = {}
  nodes.forEach(function (n, i) { indexById[n.id] = i })
  const laneOf = {}
  const lanes = []
  for (const node of nodes) {
    const parents = node.parents || []
    let chosen = -1
    for (const p of parents) {
      const lp = laneOf[p]
      if (lp !== undefined && lanes[lp].head === p) { chosen = lp; break }
    }
    if (chosen === -1) { chosen = lanes.length; lanes.push({ head: node.id }) }
    lanes[chosen].head = node.id
    laneOf[node.id] = chosen
  }
  const laneCount = lanes.length
  const aliveFrom = new Array(laneCount).fill(-1)
  const aliveTo = new Array(laneCount).fill(-1)
  nodes.forEach(function (n, i) {
    const l = laneOf[n.id]
    if (aliveFrom[l] === -1 || i < aliveFrom[l]) aliveFrom[l] = i
    if (aliveTo[l] === -1 || i > aliveTo[l]) aliveTo[l] = i
  })
  for (const child of nodes) {
    const parents = child.parents || []
    for (const p of parents) {
      const lp = laneOf[p]
      const lc = laneOf[child.id]
      if (lp === undefined || lc === undefined || lp === lc) continue
      const pIndex = indexById[p]
      const cIndex = indexById[child.id]
      if (pIndex < aliveFrom[lc]) aliveFrom[lc] = pIndex
      if (cIndex > aliveTo[lp]) aliveTo[lp] = cIndex
    }
  }
  const aliveAt = function (L, i) { return aliveFrom[L] <= i && i < aliveTo[L] }
  const cellFor = function (L, i, override) {
    if (override !== undefined) return override
    if (aliveAt(L, i)) return { kind: 'vline' }
    return { kind: 'empty' }
  }
  const rows = []
  nodes.forEach(function (node, i) {
    // merge connectors: each non-first parent in another lane merges just before this row
    const parents = node.parents || []
    for (let pj = 1; pj < parents.length; pj++) {
      const p = parents[pj]
      const lp = laneOf[p]
      const lc = laneOf[node.id]
      if (lp === undefined || lp === lc) continue
      const cells = []
      for (let L = 0; L < laneCount; L++) {
        if (L === lp) cells.push({ kind: lc > lp ? 'corner-merge-r' : 'corner-merge-l' })
        else if ((lc < L && L < lp) || (lp < L && L < lc)) cells.push({ kind: 'hline' })
        else cells.push(cellFor(L, i - 1))
      }
      rows.push({ kind: 'connector', cells: cells })
    }
    // this node's row
    const cells = []
    for (let L = 0; L < laneCount; L++) {
      if (laneOf[node.id] === L) cells.push({ kind: 'dot', node: node, below: aliveAt(L, i) })
      else cells.push(cellFor(L, i))
    }
    rows.push({ kind: 'node', cells: cells, node: node })
    // fork connectors: each child whose first parent is this node and whose lane differs
    for (const child of nodes) {
      const childParents = child.parents || []
      if (childParents.length === 0 || childParents[0] !== node.id) continue
      const lc = laneOf[child.id]
      const lp = laneOf[node.id]
      if (lp === lc) continue
      const cells = []
      for (let L = 0; L < laneCount; L++) {
        if (L === lp) cells.push({ kind: lc > lp ? 'corner-fork-r' : 'corner-fork-l' })
        else if ((lp < L && L < lc) || (lc < L && L < lp)) cells.push({ kind: 'hline' })
        else cells.push(cellFor(L, i))
      }
      rows.push({ kind: 'connector', cells: cells })
    }
  })
  return { rows: rows, laneCount: laneCount }
}

function GraphCell(props) {
  const cell = props.cell
  if (cell.kind === 'empty') return React.createElement('div', { className: 'dsh-cell' })
  if (cell.kind === 'vline') return React.createElement('div', { className: 'dsh-cell' }, React.createElement('span', { className: 'dsh-c-v' }))
  if (cell.kind === 'hline') return React.createElement('div', { className: 'dsh-cell' }, React.createElement('span', { className: 'dsh-c-hline' }))
  if (cell.kind === 'corner-fork-r') return React.createElement('div', { className: 'dsh-cell' }, React.createElement('span', { className: 'dsh-c-v' }), React.createElement('span', { className: 'dsh-c-stub-r' }))
  if (cell.kind === 'corner-fork-l') return React.createElement('div', { className: 'dsh-cell' }, React.createElement('span', { className: 'dsh-c-v' }), React.createElement('span', { className: 'dsh-c-stub-l' }))
  if (cell.kind === 'corner-merge-r') return React.createElement('div', { className: 'dsh-cell' }, React.createElement('span', { className: 'dsh-c-vtop' }), React.createElement('span', { className: 'dsh-c-stub-r' }))
  if (cell.kind === 'corner-merge-l') return React.createElement('div', { className: 'dsh-cell' }, React.createElement('span', { className: 'dsh-c-vtop' }), React.createElement('span', { className: 'dsh-c-stub-l' }))
  if (cell.kind === 'dot') {
    const node = cell.node
    return React.createElement('div', { className: 'dsh-cell' },
      React.createElement('span', { className: cell.below ? 'dsh-c-v' : 'dsh-c-vtop' }),
      React.createElement('span', { className: 'dsh-gh-dot dsh-gh-' + node.kind }))
  }
  return React.createElement('div', { className: 'dsh-cell' })
}

function GitTreeView(props) {
  const d = props.data
  if (!d) return null
  return React.createElement('div', { className: 'dsh-stack' },
    React.createElement('div', { className: 'dsh-sub' }, 'schema ' + d.schema_version + ' · updated ' + d.updated_at + ' — ' + d.provenance),
    (d.branches || []).map(function (branch) {
      const graph = buildBranchRows(branch)
      return React.createElement('div', { key: branch.id, className: 'dsh-card dsh-gh-branch' },
        React.createElement('div', { className: 'dsh-gh-branch-head' },
          React.createElement('b', null, branch.label),
          React.createElement('span', { className: 'dsh-muted' }, branch.track),
          React.createElement('span', { className: 'dsh-badge' }, 'head: ' + branch.head)),
        React.createElement('div', { className: 'dsh-gh-list' },
          graph.rows.map(function (row, ri) {
            if (row.kind === 'connector') {
              return React.createElement('div', { key: 'c' + ri, className: 'dsh-gh-row dsh-gh-connector' },
                React.createElement('div', { className: 'dsh-gh-cells' },
                  row.cells.map(function (cell, ci) { return React.createElement(GraphCell, { key: ci, cell: cell }) })),
                React.createElement('div', { className: 'dsh-gh-body' }))
            }
            const node = row.node
            return React.createElement('div', { key: node.id, className: 'dsh-gh-row dsh-gh-node-row' },
              React.createElement('div', { className: 'dsh-gh-cells' },
                row.cells.map(function (cell, ci) { return React.createElement(GraphCell, { key: ci, cell: cell }) })),
              React.createElement('div', { className: 'dsh-gh-body' },
                React.createElement('div', null,
                  React.createElement('span', { className: 'dsh-gh-label' }, node.label || node.id),
                  node.sha256 ? React.createElement('span', { className: 'dsh-gh-hash' }, node.sha256) : null,
                  React.createElement('span', { className: 'dsh-gh-kind dsh-gh-kind-' + node.kind }, node.kind),
                  node.promoted_at ? React.createElement('span', { className: 'dsh-gh-kind' }, 'promoted ' + node.promoted_at) : null),
                React.createElement('div', { className: 'dsh-muted' }, node.summary),
                node.note ? React.createElement('div', { className: 'dsh-gh-note' }, node.note) : null))
          })))
    }))
}

function ChangelogView(props) {
  const d = props.data
  if (!d) return null
  const markdown = String(d.markdown || '')
  const blocks = []
  let current = null
  for (const line of markdown.split('\n')) {
    const versionMatch = /^##\s+(.+)$/.exec(line)
    const subMatch = /^###\s+(.+)$/.exec(line)
    if (versionMatch) { current = { version: versionMatch[1], subs: [] }; blocks.push(current); continue }
    if (subMatch && current) { current.subs.push({ title: subMatch[1], bullets: [] }); continue }
    if (/^\s*-\s+/.test(line)) {
      const text = line.replace(/^\s*-\s+/, '').trim()
      const sub = current && current.subs.length ? current.subs[current.subs.length - 1] : null
      if (sub) sub.bullets.push(text)
      else if (current) { (current.intro = current.intro || []).push(text) }
    }
  }
  return React.createElement('div', { className: 'dsh-stack' },
    React.createElement('div', { className: 'dsh-sub' }, 'source: ' + (d.source || '—')),
    blocks.map(function (block) {
      return React.createElement('div', { key: block.version, className: 'dsh-card' },
        React.createElement('div', null,
          React.createElement('span', { className: 'dsh-ch-dot' }),
          React.createElement('span', { className: 'dsh-ch-version' }, block.version)),
        (block.intro || []).map(function (b, i) {
          return React.createElement('div', { key: 'i' + i, className: 'dsh-ch-bullet' }, '• ' + b)
        }),
        block.subs.map(function (sub) {
          return React.createElement('div', { key: sub.title },
            React.createElement('div', { className: 'dsh-ch-sub' }, React.createElement('b', null, sub.title)),
            sub.bullets.map(function (b, i) {
              return React.createElement('div', { key: 'b' + i, className: 'dsh-ch-bullet' }, '• ' + b)
            }))
        }))
    }))
}

function VersionsView(props) {
  const d = props.data
  if (!d) return null
  return React.createElement('div', { className: 'dsh-stack' },
    React.createElement('div', null,
      React.createElement('h3', { className: 'dsh-h3' }, 'Research lineage versions'),
      React.createElement(GitTreeView, { data: d.versions })),
    React.createElement('div', null,
      React.createElement('h3', { className: 'dsh-h3' }, 'Repository changelog'),
      React.createElement(ChangelogView, { data: d.changelog })))
}

function Dashboard(props) {
  const [tab, setTab] = React.useState('overview')
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [query, setQuery] = React.useState('')
  const [meta, setMeta] = React.useState(null)
  const [reloadKey, setReloadKey] = React.useState(0)

  React.useEffect(function () {
    let alive = true
    host.call('dash_data', { dataset: 'catalog' }).then(function (value) {
      if (!alive) return
      if (value && typeof value.error !== 'string' && Array.isArray(value.datasets)) setMeta(value)
    }).catch(function () { /* catalog is optional; tabs fall back to FALLBACK_TABS */ })
    return function () { alive = false }
  }, [])

  React.useEffect(function () {
    let alive = true
    setData(null)
    setError(null)
    const datasets = tab === 'versions' ? ['versions', 'changelog'] : [tab]
    Promise.all(datasets.map(function (id) {
      return host.call('dash_data', { dataset: id })
    })).then(function (values) {
      if (!alive) return
      const firstError = values.find(function (v) { return v && typeof v.error === 'string' })
      if (firstError) setError(firstError.error)
      else setData(values.length === 1 ? values[0] : { versions: values[0], changelog: values[1] })
    }).catch(function (err) {
      if (alive) setError(String(err && err.message ? err.message : err))
    })
    return function () { alive = false }
  }, [tab, reloadKey])

  const tabs = (meta && meta.datasets) ? meta.datasets : FALLBACK_TABS
  const showSearch = tab === 'evidence' || tab === 'conflicts'

  const body = error
    ? React.createElement('div', { className: 'dsh-err' },
        'Host data unavailable: ' + error,
        React.createElement('button', { className: 'dsh-retry', onClick: function () { setReloadKey(function (k) { return k + 1 }) } }, 'Retry'))
    : !data
      ? React.createElement('div', { className: 'dsh-muted' }, 'Loading…')
      : tab === 'overview'
        ? React.createElement(OverviewView, { data: data })
        : tab === 'versions'
          ? React.createElement(VersionsView, { data: data })
          : React.createElement('div', { className: 'dsh-stack' },
              showSearch ? React.createElement('div', null,
                React.createElement('input', { className: 'dsh-input', placeholder: 'filter…', value: query, onChange: function (e) { setQuery(e.target.value) } })) : null,
              tab === 'evidence'
                ? React.createElement(EvidenceView, { data: data, query: query })
                : React.createElement(ConflictsView, { data: data, query: query }))

  return React.createElement('div', { className: 'dsh-wrap' },
    React.createElement('div', { className: 'dsh-header' },
      React.createElement('div', { className: 'dsh-title' }, 'DSH Self-Harness Tools — Release Dashboard'),
      React.createElement('div', { className: 'dsh-sub' }, 'Archive dashboard for the DSH self-harness tool suite: components, design decisions, rejected options, and the version tree.')),
    React.createElement('div', { className: 'dsh-tabs' },
      tabs.map(function (t) {
        return React.createElement('button', {
          key: t.id,
          className: 'dsh-tab' + (tab === t.id ? ' dsh-tab-active' : ''),
          onClick: function () { setTab(t.id); setQuery(''); setData(null); setError(null) }
        }, t.label, t.count !== null && t.count !== undefined ? React.createElement('span', { className: 'dsh-badge' }, String(t.count)) : null)
      })),
    body)
}

return {
  name: 'dsh-evidence-dashboard',
  apply(ctx) {
    const slots = ctx.get('slots')
    if (slots === undefined) return
    styles.insert(STYLES)
    const renderDashboard = function (ownerProps) {
      return React.createElement(Dashboard, { close: ownerProps && ownerProps.close })
    }
    slots.inject('tool.view.cordis', function () {
      return slots.register({ name: 'tool.view.cordis', key: 'self' }, renderDashboard)
    })
    slots.inject('settings.section', function () {
      return slots.register({ name: 'settings.section', id: 'dsh-evidence', order: 40, label: 'DSH Evidence' }, renderDashboard)
    })
  },
}
