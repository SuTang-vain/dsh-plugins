window.__ModuleLoader__.load({
  id: "dsh-evidence-dashboard",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    let react = require("react");

    var STYLES = [
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
      '.dsh-ch-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; background: var(--dsw-alias-state-success-primary, #3a5); }',
      '.dsh-ch-version { font-weight: 600; }',
      '.dsh-ch-sub { margin-top: 6px; }',
      '.dsh-ch-bullet { margin: 2px 0 2px 14px; }'
    ].join('\n');

    if (typeof document !== 'undefined' && document.head && !document.getElementById('dsh-evidence-dashboard-styles')) {
      var styleEl = document.createElement('style');
      styleEl.id = 'dsh-evidence-dashboard-styles';
      styleEl.textContent = STYLES;
      document.head.appendChild(styleEl);
    }

    var FALLBACK_TABS = [
      { id: 'overview', label: 'Overview', count: null },
      { id: 'evidence', label: 'Decisions', count: null },
      { id: 'conflicts', label: 'Rejected options', count: null },
      { id: 'versions', label: 'Versions', count: null }
    ];

    function dashData(dataset) {
      return fetch('/api/dash-data?dataset=' + encodeURIComponent(dataset)).then(function (resp) {
        if (!resp.ok) throw new Error('HTTP ' + resp.status)
        return resp.json()
      })
    }

    function OverviewView(props) {
      var d = props.data
      if (!d) return null
      var columns = ['Component', 'Category', 'Status']
      return react.createElement('div', { className: 'dsh-stack' },
        react.createElement('div', { className: 'dsh-card' },
          react.createElement('div', { className: 'dsh-sub' }, 'Updated: ' + d.updated_at),
          react.createElement('div', { className: 'dsh-sub' }, 'Self-check: run `node verify.js` at the repository root')),
        react.createElement('div', null,
          react.createElement('h3', { className: 'dsh-h3' }, 'Components'),
          react.createElement('table', { className: 'dsh-table' },
            react.createElement('thead', null,
              react.createElement('tr', null, columns.map(function (c) { return react.createElement('th', { key: c }, c) }))),
            react.createElement('tbody', null, (d.components || []).map(function (t) {
              return react.createElement('tr', { key: t.id },
                react.createElement('td', null, react.createElement('b', null, t.id)),
                react.createElement('td', null, t.category),
                react.createElement('td', null, t.status))
            })))),
        d.highlights ? react.createElement('div', null,
          react.createElement('h3', { className: 'dsh-h3' }, 'Release highlights'),
          react.createElement('div', { className: 'dsh-card' },
            react.createElement('div', null, react.createElement('b', null, d.highlights.title)),
            react.createElement('ul', { style: { margin: '4px 0' } },
              (d.highlights.points || []).map(function (o) { return react.createElement('li', { key: o, className: 'dsh-li' }, o) })))) : null,
        d.performance ? react.createElement('div', null,
          react.createElement('h3', { className: 'dsh-h3' }, 'Runtime notes'),
          react.createElement('div', { className: 'dsh-card' },
            react.createElement('div', null, react.createElement('b', null, d.performance.title)),
            react.createElement('ul', { style: { margin: '4px 0' } },
              (d.performance.points || []).map(function (o) { return react.createElement('li', { key: o, className: 'dsh-li' }, o) })))) : null,
        d.principles ? react.createElement('div', null,
          react.createElement('h3', { className: 'dsh-h3' }, 'Design principles'),
          react.createElement('div', { className: 'dsh-card' },
            react.createElement('div', null, react.createElement('b', null, d.principles.title)),
            react.createElement('ul', { style: { margin: '4px 0' } },
              (d.principles.points || []).map(function (o) { return react.createElement('li', { key: o, className: 'dsh-li' }, o) })))) : null,
        d.compatibility ? react.createElement('div', null,
          react.createElement('h3', { className: 'dsh-h3' }, 'Compatibility'),
          react.createElement('div', { className: 'dsh-card' },
            react.createElement('div', null, react.createElement('b', null, d.compatibility.title)),
            react.createElement('ul', { style: { margin: '4px 0' } },
              (d.compatibility.points || []).map(function (o) { return react.createElement('li', { key: o, className: 'dsh-li' }, o) })))) : null)
    }

    function matches(query, fields) {
      if (!query) return true
      var hay = fields.join(' ').toLowerCase()
      return hay.indexOf(query.toLowerCase()) !== -1
    }

    function DecisionsView(props) {
      var d = props.data
      var query = props.query
      if (!d) return null
      var entries = (d.entries || []).filter(function (e) {
        return matches(query, [e.id || '', e.claim_level || '', e.target || ''])
      })
      return react.createElement('div', { className: 'dsh-stack' },
        react.createElement('div', { className: 'dsh-sub' }, 'schema ' + d.schema_version + ' · showing ' + entries.length + '/' + (d.entries || []).length + ' entries'),
        entries.map(function (e) {
          return react.createElement('div', { key: e.id, className: 'dsh-card' },
            react.createElement('div', null,
              react.createElement('b', null, e.id), ' ',
              react.createElement('span', { className: 'dsh-badge' }, e.claim_level || '—')),
            react.createElement('div', { className: 'dsh-muted' }, 'source: ' + (e.source || '—')),
            (e.supports && e.supports.length) ? react.createElement('div', null, react.createElement('b', null, 'supports'), react.createElement('ul', { style: { margin: '2px 0' } }, e.supports.map(function (s) { return react.createElement('li', { key: s, className: 'dsh-li' }, s) }))) : null,
            (e.does_not_support && e.does_not_support.length) ? react.createElement('div', null, react.createElement('b', null, 'does not support'), react.createElement('ul', { style: { margin: '2px 0' } }, e.does_not_support.map(function (s) { return react.createElement('li', { key: s, className: 'dsh-li' }, s) }))) : null)
        }))
    }

    function RejectedView(props) {
      var d = props.data
      var query = props.query
      if (!d) return null
      var entries = (d.entries || []).filter(function (e) {
        return matches(query, [e.id || '', e.target || '', e.path || '', e.lineage_decision || '', e.suspected_conflict || ''])
      })
      return react.createElement('div', { className: 'dsh-stack' },
        react.createElement('div', { className: 'dsh-sub' }, 'schema ' + d.schema_version + ' · showing ' + entries.length + '/' + (d.entries || []).length + ' records'),
        entries.map(function (e) {
          return react.createElement('div', { key: e.id, className: 'dsh-card' },
            react.createElement('div', null,
              react.createElement('b', null, e.id), ' — ',
              react.createElement('span', { className: 'dsh-badge' }, e.lineage_decision || 'recorded'),
              ' (' + (e.target || '?') + ' · ' + (e.path || '?') + ')'),
            react.createElement('div', { className: 'dsh-muted' }, 'intended: ' + (e.intended_effect || '—')),
            (e.observed_benefit && e.observed_benefit.length) ? react.createElement('div', null, react.createElement('b', null, 'benefit'), react.createElement('ul', { style: { margin: '2px 0' } }, e.observed_benefit.map(function (s) { return react.createElement('li', { key: s, className: 'dsh-li' }, s) }))) : null,
            (e.observed_harm && e.observed_harm.length) ? react.createElement('div', null, react.createElement('b', null, 'harm'), react.createElement('ul', { style: { margin: '2px 0' } }, e.observed_harm.map(function (s) { return react.createElement('li', { key: s, className: 'dsh-li' }, s) }))) : null,
            e.suspected_conflict ? react.createElement('div', { className: 'dsh-muted' }, 'suspected conflict: ' + e.suspected_conflict) : null)
        }))
    }

    function buildBranchRows(branch) {
      var nodes = branch.nodes
      var indexById = {}
      nodes.forEach(function (n, i) { indexById[n.id] = i })
      var laneOf = {}
      var lanes = []
      for (var ni = 0; ni < nodes.length; ni++) {
        var node = nodes[ni]
        var parents = node.parents || []
        var chosen = -1
        for (var pi = 0; pi < parents.length; pi++) {
          var lp = laneOf[parents[pi]]
          if (lp !== undefined && lanes[lp].head === parents[pi]) { chosen = lp; break }
        }
        if (chosen === -1) { chosen = lanes.length; lanes.push({ head: node.id }) }
        lanes[chosen].head = node.id
        laneOf[node.id] = chosen
      }
      var laneCount = lanes.length
      var aliveFrom = new Array(laneCount).fill(-1)
      var aliveTo = new Array(laneCount).fill(-1)
      nodes.forEach(function (n, i) {
        var l = laneOf[n.id]
        if (aliveFrom[l] === -1 || i < aliveFrom[l]) aliveFrom[l] = i
        if (aliveTo[l] === -1 || i > aliveTo[l]) aliveTo[l] = i
      })
      for (var ci = 0; ci < nodes.length; ci++) {
        var child = nodes[ci]
        var cparents = child.parents || []
        for (var cpi = 0; cpi < cparents.length; cpi++) {
          var pl = laneOf[cparents[cpi]]
          var cl = laneOf[child.id]
          if (pl === undefined || cl === undefined || pl === cl) continue
          var pIndex = indexById[cparents[cpi]]
          var cIndex = indexById[child.id]
          if (pIndex < aliveFrom[cl]) aliveFrom[cl] = pIndex
          if (cIndex > aliveTo[pl]) aliveTo[pl] = cIndex
        }
      }
      var aliveAt = function (L, i) { return aliveFrom[L] <= i && i < aliveTo[L] }
      var cellFor = function (L, i, override) {
        if (override !== undefined) return override
        if (aliveAt(L, i)) return { kind: 'vline' }
        return { kind: 'empty' }
      }
      var rows = []
      nodes.forEach(function (node, i) {
        var nodeParents = node.parents || []
        for (var pj = 1; pj < nodeParents.length; pj++) {
          var p = nodeParents[pj]
          var lp2 = laneOf[p]
          var lc2 = laneOf[node.id]
          if (lp2 === undefined || lp2 === lc2) continue
          var cells = []
          for (var L = 0; L < laneCount; L++) {
            if (L === lp2) cells.push({ kind: lc2 > lp2 ? 'corner-merge-r' : 'corner-merge-l' })
            else if ((lc2 < L && L < lp2) || (lp2 < L && L < lc2)) cells.push({ kind: 'hline' })
            else cells.push(cellFor(L, i - 1))
          }
          rows.push({ kind: 'connector', cells: cells })
        }
        var ncells = []
        for (var L2 = 0; L2 < laneCount; L2++) {
          if (laneOf[node.id] === L2) ncells.push({ kind: 'dot', node: node, below: aliveAt(L2, i) })
          else ncells.push(cellFor(L2, i))
        }
        rows.push({ kind: 'node', cells: ncells, node: node })
        for (var ci2 = 0; ci2 < nodes.length; ci2++) {
          var fc = nodes[ci2]
          var fparents = fc.parents || []
          if (fparents.length === 0 || fparents[0] !== node.id) continue
          var flc = laneOf[fc.id]
          var flp = laneOf[node.id]
          if (flp === flc) continue
          var fcells = []
          for (var L3 = 0; L3 < laneCount; L3++) {
            if (L3 === flp) fcells.push({ kind: flc > flp ? 'corner-fork-r' : 'corner-fork-l' })
            else if ((flp < L3 && L3 < flc) || (flc < L3 && L3 < flp)) fcells.push({ kind: 'hline' })
            else fcells.push(cellFor(L3, i))
          }
          rows.push({ kind: 'connector', cells: fcells })
        }
      })
      return { rows: rows, laneCount: laneCount }
    }

    function GraphCell(props) {
      var cell = props.cell
      if (cell.kind === 'empty') return react.createElement('div', { className: 'dsh-cell' })
      if (cell.kind === 'vline') return react.createElement('div', { className: 'dsh-cell' }, react.createElement('span', { className: 'dsh-c-v' }))
      if (cell.kind === 'hline') return react.createElement('div', { className: 'dsh-cell' }, react.createElement('span', { className: 'dsh-c-hline' }))
      if (cell.kind === 'corner-fork-r') return react.createElement('div', { className: 'dsh-cell' }, react.createElement('span', { className: 'dsh-c-v' }), react.createElement('span', { className: 'dsh-c-stub-r' }))
      if (cell.kind === 'corner-fork-l') return react.createElement('div', { className: 'dsh-cell' }, react.createElement('span', { className: 'dsh-c-v' }), react.createElement('span', { className: 'dsh-c-stub-l' }))
      if (cell.kind === 'corner-merge-r') return react.createElement('div', { className: 'dsh-cell' }, react.createElement('span', { className: 'dsh-c-vtop' }), react.createElement('span', { className: 'dsh-c-stub-r' }))
      if (cell.kind === 'corner-merge-l') return react.createElement('div', { className: 'dsh-cell' }, react.createElement('span', { className: 'dsh-c-vtop' }), react.createElement('span', { className: 'dsh-c-stub-l' }))
      if (cell.kind === 'dot') {
        var node = cell.node
        return react.createElement('div', { className: 'dsh-cell' },
          react.createElement('span', { className: cell.below ? 'dsh-c-v' : 'dsh-c-vtop' }),
          react.createElement('span', { className: 'dsh-gh-dot dsh-gh-' + node.kind }))
      }
      return react.createElement('div', { className: 'dsh-cell' })
    }

    function GitTreeView(props) {
      var d = props.data
      if (!d) return null
      return react.createElement('div', { className: 'dsh-stack' },
        react.createElement('div', { className: 'dsh-sub' }, 'schema ' + d.schema_version + ' · updated ' + d.updated_at + ' — ' + d.provenance),
        (d.branches || []).map(function (branch) {
          var graph = buildBranchRows(branch)
          return react.createElement('div', { key: branch.id, className: 'dsh-card dsh-gh-branch' },
            react.createElement('div', { className: 'dsh-gh-branch-head' },
              react.createElement('b', null, branch.label),
              react.createElement('span', { className: 'dsh-muted' }, branch.track),
              react.createElement('span', { className: 'dsh-badge' }, 'head: ' + branch.head)),
            react.createElement('div', { className: 'dsh-gh-list' },
              graph.rows.map(function (row, ri) {
                if (row.kind === 'connector') {
                  return react.createElement('div', { key: 'c' + ri, className: 'dsh-gh-row dsh-gh-connector' },
                    react.createElement('div', { className: 'dsh-gh-cells' },
                      row.cells.map(function (cell, cellIndex) { return react.createElement(GraphCell, { key: cellIndex, cell: cell }) })),
                    react.createElement('div', { className: 'dsh-gh-body' }))
                }
                var node = row.node
                return react.createElement('div', { key: node.id, className: 'dsh-gh-row dsh-gh-node-row' },
                  react.createElement('div', { className: 'dsh-gh-cells' },
                    row.cells.map(function (cell, cellIndex) { return react.createElement(GraphCell, { key: cellIndex, cell: cell }) })),
                  react.createElement('div', { className: 'dsh-gh-body' },
                    react.createElement('div', null,
                      react.createElement('span', { className: 'dsh-gh-label' }, node.label || node.id),
                      node.sha256 ? react.createElement('span', { className: 'dsh-gh-hash' }, node.sha256) : null,
                      react.createElement('span', { className: 'dsh-gh-kind dsh-gh-kind-' + node.kind }, node.kind),
                      node.promoted_at ? react.createElement('span', { className: 'dsh-gh-kind' }, 'promoted ' + node.promoted_at) : null),
                    react.createElement('div', { className: 'dsh-muted' }, node.summary),
                    node.note ? react.createElement('div', { className: 'dsh-gh-note' }, node.note) : null))
              })))
        }))
    }

    function ChangelogView(props) {
      var d = props.data
      if (!d) return null
      var markdown = String(d.markdown || '')
      var blocks = []
      var current = null
      markdown.split('\n').forEach(function (line) {
        var versionMatch = /^##\s+(.+)$/.exec(line)
        var subMatch = /^###\s+(.+)$/.exec(line)
        if (versionMatch) { current = { version: versionMatch[1], subs: [] }; blocks.push(current); return }
        if (subMatch && current) { current.subs.push({ title: subMatch[1], bullets: [] }); return }
        if (/^\s*-\s+/.test(line)) {
          var text = line.replace(/^\s*-\s+/, '').trim()
          var sub = current && current.subs.length ? current.subs[current.subs.length - 1] : null
          if (sub) sub.bullets.push(text)
          else if (current) { (current.intro = current.intro || []).push(text) }
        }
      })
      return react.createElement('div', { className: 'dsh-stack' },
        react.createElement('div', { className: 'dsh-sub' }, 'source: ' + (d.source || '—')),
        blocks.map(function (block) {
          return react.createElement('div', { key: block.version, className: 'dsh-card' },
            react.createElement('div', null,
              react.createElement('span', { className: 'dsh-ch-dot' }),
              react.createElement('span', { className: 'dsh-ch-version' }, block.version)),
            (block.intro || []).map(function (b, i) {
              return react.createElement('div', { key: 'i' + i, className: 'dsh-ch-bullet' }, '• ' + b)
            }),
            block.subs.map(function (sub) {
              return react.createElement('div', { key: sub.title },
                react.createElement('div', { className: 'dsh-ch-sub' }, react.createElement('b', null, sub.title)),
                sub.bullets.map(function (b, i) {
                  return react.createElement('div', { key: 'b' + i, className: 'dsh-ch-bullet' }, '• ' + b)
                }))
            }))
        }))
    }

    function VersionsView(props) {
      var d = props.data
      if (!d) return null
      return react.createElement('div', { className: 'dsh-stack' },
        react.createElement('div', null,
          react.createElement('h3', { className: 'dsh-h3' }, 'Release history'),
          react.createElement(GitTreeView, { data: d.versions })),
        react.createElement('div', null,
          react.createElement('h3', { className: 'dsh-h3' }, 'Changelog'),
          react.createElement(ChangelogView, { data: d.changelog })))
    }

    function Dashboard(props) {
      var tabState = react.useState('overview')
      var tab = tabState[0]
      var setTab = tabState[1]
      var dataState = react.useState(null)
      var data = dataState[0]
      var setData = dataState[1]
      var errorState = react.useState(null)
      var error = errorState[0]
      var setError = errorState[1]
      var queryState = react.useState('')
      var query = queryState[0]
      var setQuery = queryState[1]
      var metaState = react.useState(null)
      var meta = metaState[0]
      var setMeta = metaState[1]
      var reloadState = react.useState(0)
      var reloadKey = reloadState[0]
      var setReloadKey = reloadState[1]

      react.useEffect(function () {
        var alive = true
        dashData('catalog').then(function (value) {
          if (!alive) return
          if (value && typeof value.error !== 'string' && Array.isArray(value.datasets)) setMeta(value)
        }).catch(function () { /* catalog is optional; tabs fall back to FALLBACK_TABS */ })
        return function () { alive = false }
      }, [])

      react.useEffect(function () {
        var alive = true
        setData(null)
        setError(null)
        var datasets = tab === 'versions' ? ['versions', 'changelog'] : [tab]
        Promise.all(datasets.map(function (id) { return dashData(id) })).then(function (values) {
          if (!alive) return
          var firstError = values.find(function (v) { return v && typeof v.error === 'string' })
          if (firstError) setError(firstError.error)
          else setData(values.length === 1 ? values[0] : { versions: values[0], changelog: values[1] })
        }).catch(function (err) {
          if (alive) setError(String(err && err.message ? err.message : err))
        })
        return function () { alive = false }
      }, [tab, reloadKey])

      var tabs = (meta && meta.datasets) ? meta.datasets : FALLBACK_TABS
      var showSearch = tab === 'evidence' || tab === 'conflicts'

      var body = error
        ? react.createElement('div', { className: 'dsh-err' },
            'Host data unavailable: ' + error,
            react.createElement('button', { className: 'dsh-retry', onClick: function () { setReloadKey(function (k) { return k + 1 }) } }, 'Retry'))
        : !data
          ? react.createElement('div', { className: 'dsh-muted' }, 'Loading…')
          : tab === 'overview'
            ? react.createElement(OverviewView, { data: data })
            : tab === 'versions'
              ? react.createElement(VersionsView, { data: data })
              : react.createElement('div', { className: 'dsh-stack' },
                  showSearch ? react.createElement('div', null,
                    react.createElement('input', { className: 'dsh-input', placeholder: 'filter…', value: query, onChange: function (e) { setQuery(e.target.value) } })) : null,
                  tab === 'evidence'
                    ? react.createElement(DecisionsView, { data: data, query: query })
                    : react.createElement(RejectedView, { data: data, query: query }))

      return react.createElement('div', { className: 'dsh-wrap' },
        react.createElement('div', { className: 'dsh-header' },
          react.createElement('div', { className: 'dsh-title' }, 'DSH Self-Harness Tools — Release Dashboard'),
          react.createElement('div', { className: 'dsh-sub' }, 'Archive dashboard for the DSH self-harness tool suite: components, design decisions, rejected options, and the version tree.')),
        react.createElement('div', { className: 'dsh-tabs' },
          tabs.map(function (t) {
            return react.createElement('button', {
              key: t.id,
              className: 'dsh-tab' + (tab === t.id ? ' dsh-tab-active' : ''),
              onClick: function () { setTab(t.id); setQuery(''); setData(null); setError(null) }
            }, t.label, t.count !== null && t.count !== undefined ? react.createElement('span', { className: 'dsh-badge' }, String(t.count)) : null)
          })),
        body)
    }

    exports.inject = ['slots']
    exports.apply = function (ctx) {
      var slots = ctx.get('slots')
      if (slots === undefined) return
      var renderDashboard = function (ownerProps) {
        return react.createElement(Dashboard, { close: ownerProps && ownerProps.close })
      }
      slots.inject('settings.section', function () {
        return slots.register({ name: 'settings.section', id: 'dsh-evidence', order: 40, label: 'DSH Evidence' }, renderDashboard)
      })
    }

    return module.exports;
  }
})
