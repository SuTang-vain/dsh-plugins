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
      '.dsh-header-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }',
      '.dsh-title { font-size: 15px; font-weight: 600; margin: 0 0 2px; }',
      '.dsh-sub { color: var(--dsw-alias-label-secondary, inherit); opacity: 0.85; font-size: 12px; }',
      '.dsh-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }',
      '.dsh-chip { font-size: 11px; border: 1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.35)); border-radius: 10px; padding: 1px 8px; color: var(--dsw-alias-label-secondary, inherit); white-space: nowrap; }',
      '.dsh-icon-btn { background: transparent; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.5)); border-radius: 6px; padding: 2px 9px; cursor: pointer; color: inherit; font-size: 13px; }',
      '.dsh-kpis { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }',
      '.dsh-kpi { flex: 1; min-width: 96px; border: 1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.35)); border-radius: 10px; padding: 8px 10px; cursor: pointer; background: transparent; }',
      '.dsh-kpi:hover { border-color: var(--dsw-alias-border-l2, rgba(128,128,128,0.5)); }',
      '.dsh-kpi-active { border-color: var(--dsw-alias-brand-primary, #48e); }',
      '.dsh-kpi-head { display: flex; align-items: center; gap: 6px; }',
      '.dsh-kpi-num { font-size: 18px; font-weight: 700; }',
      '.dsh-kpi-label { font-size: 11px; color: var(--dsw-alias-label-secondary, inherit); }',
      '.dsh-tabs { display: flex; gap: 6px; flex-wrap: wrap; margin: 10px 0; }',
      '.dsh-tab { background: transparent; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.4)); border-radius: 999px; padding: 4px 12px; cursor: pointer; font-size: 12px; color: inherit; }',
      '.dsh-tab-active { border-color: var(--dsw-alias-brand-primary, currentColor); font-weight: 600; }',
      '.dsh-badge { display: inline-block; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.5)); border-radius: 10px; padding: 0 7px; font-size: 11px; white-space: nowrap; margin-left: 4px; }',
      '.dsh-stack { display: flex; flex-direction: column; gap: 10px; }',
      '.dsh-h3 { font-size: 13px; font-weight: 600; margin: 4px 0; }',
      '.dsh-card { border: 1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.35)); border-radius: 8px; padding: 8px 10px; }',
      '.dsh-cols { display: flex; gap: 10px; flex-wrap: wrap; }',
      '.dsh-col { flex: 1; min-width: 220px; }',
      '.dsh-table { border-collapse: collapse; width: 100%; font-size: 12px; }',
      '.dsh-table th, .dsh-table td { border: 1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.35)); padding: 4px 7px; text-align: left; vertical-align: top; }',
      '.dsh-table th { color: var(--dsw-alias-label-secondary, inherit); font-weight: 600; }',
      '.dsh-muted { color: var(--dsw-alias-label-secondary, inherit); font-size: 12px; }',
      '.dsh-li { margin: 2px 0 2px 14px; }',
      '.dsh-err { color: var(--dsw-alias-state-error-primary, #d05); }',
      '.dsh-retry { margin-left: 8px; background: transparent; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.5)); border-radius: 6px; padding: 2px 8px; cursor: pointer; font-size: 12px; color: inherit; }',
      '.dsh-input { background: transparent; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.5)); border-radius: 6px; padding: 4px 8px; color: inherit; font-size: 12px; width: 240px; }',
      '.dsh-fade { animation: dsh-fade-in 0.16s ease; }',
      '@keyframes dsh-fade-in { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: none; } }',
      '.dsh-skeleton { border: 1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.35)); border-radius: 8px; padding: 12px; height: 52px; animation: dsh-pulse 1.2s ease-in-out infinite; }',
      '@keyframes dsh-pulse { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }',
      '.dsh-empty { text-align: center; padding: 18px; color: var(--dsw-alias-label-secondary, inherit); border: 1px dashed var(--dsw-alias-border-l1, rgba(128,128,128,0.45)); border-radius: 8px; font-size: 12px; }',
      '.dsh-chips-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 4px; }',
      '.dsh-chip-btn { background: transparent; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.4)); border-radius: 999px; padding: 1px 10px; cursor: pointer; font-size: 11px; color: inherit; }',
      '.dsh-chip-btn-active { border-color: var(--dsw-alias-brand-primary, #48e); font-weight: 600; }',
      '.dsh-accent-ok { border-left: 3px solid var(--dsw-alias-state-success-primary, #3a5); }',
      '.dsh-accent-bad { border-left: 3px solid var(--dsw-alias-state-error-primary, #d05); }',
      '.dsh-accent-mid { border-left: 3px solid var(--dsw-alias-state-warn-primary, #d90); }',
      '.dsh-legend { display: flex; gap: 10px; flex-wrap: wrap; font-size: 11px; color: var(--dsw-alias-label-secondary, inherit); }',
      '.dsh-legend-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; }',
      '.dsh-gh-branch-head { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }',
      '.dsh-gh-branch { border-left: 3px solid var(--dsw-alias-brand-primary, #48e); }',
      '.dsh-gh-branch-btn { background: transparent; border: none; color: inherit; cursor: pointer; padding: 0; font-size: 13px; }',
      '.dsh-chevron { color: var(--dsw-alias-label-secondary, inherit); margin-right: 4px; }',
      '.dsh-gh-list { display: flex; flex-direction: column; }',
      '.dsh-gh-row { display: flex; gap: 10px; align-items: stretch; }',
      '.dsh-gh-node-row { cursor: pointer; }',
      '.dsh-gh-node-row:hover { background: var(--dsw-alias-bg-layer-1, rgba(128,128,128,0.08)); border-radius: 8px; }',
      '.dsh-gh-selected { background: var(--dsw-alias-bg-layer-1, rgba(128,128,128,0.1)); border-radius: 8px; }',
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
      '.dsh-gh-detail { margin: 2px 0 8px 26px; border-left: 3px solid var(--dsw-alias-brand-primary, #48e); padding: 6px 10px; background: var(--dsw-alias-bg-layer-1, rgba(128,128,128,0.06)); border-radius: 8px; }',
      '.dsh-ch-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; background: var(--dsw-alias-state-success-primary, #3a5); }',
      '.dsh-ch-version-btn { background: transparent; border: none; color: inherit; cursor: pointer; padding: 0; font-weight: 600; font-size: 13px; }',
      '.dsh-ch-sub { margin-top: 6px; }',
      '.dsh-ch-bullet { margin: 2px 0 2px 14px; }'
    ].join('\n');

    if (typeof document !== 'undefined' && document.head && !document.getElementById('dsh-evidence-dashboard-styles')) {
      var styleEl = document.createElement('style');
      styleEl.id = 'dsh-evidence-dashboard-styles';
      styleEl.textContent = STYLES;
      document.head.appendChild(styleEl);
    }

    var ICONS = {
      grid: [
        { tag: 'rect', props: { x: '3', y: '3', width: '7', height: '7', rx: '1' } },
        { tag: 'rect', props: { x: '14', y: '3', width: '7', height: '7', rx: '1' } },
        { tag: 'rect', props: { x: '3', y: '14', width: '7', height: '7', rx: '1' } },
        { tag: 'rect', props: { x: '14', y: '14', width: '7', height: '7', rx: '1' } }
      ],
      list: [
        { tag: 'circle', props: { cx: '5', cy: '6', r: '1.2', fill: 'currentColor', stroke: 'none' } },
        { tag: 'circle', props: { cx: '5', cy: '12', r: '1.2', fill: 'currentColor', stroke: 'none' } },
        { tag: 'circle', props: { cx: '5', cy: '18', r: '1.2', fill: 'currentColor', stroke: 'none' } },
        { tag: 'line', props: { x1: '9', y1: '6', x2: '20', y2: '6' } },
        { tag: 'line', props: { x1: '9', y1: '12', x2: '20', y2: '12' } },
        { tag: 'line', props: { x1: '9', y1: '18', x2: '20', y2: '18' } }
      ],
      ban: [
        { tag: 'circle', props: { cx: '12', cy: '12', r: '9' } },
        { tag: 'line', props: { x1: '5.6', y1: '5.6', x2: '18.4', y2: '18.4' } }
      ],
      branch: [
        { tag: 'circle', props: { cx: '6', cy: '6', r: '2.4' } },
        { tag: 'circle', props: { cx: '6', cy: '18', r: '2.4' } },
        { tag: 'circle', props: { cx: '18', cy: '12', r: '2.4' } },
        { tag: 'path', props: { d: 'M6 8.4v7.2' } },
        { tag: 'path', props: { d: 'M6 12h9.6' } }
      ],
      refresh: [
        { tag: 'path', props: { d: 'M20 12a8 8 0 1 1-2.34-5.66' } },
        { tag: 'polyline', props: { points: '20 4 20 8 16 8' } }
      ],
      search: [
        { tag: 'circle', props: { cx: '11', cy: '11', r: '7' } },
        { tag: 'line', props: { x1: '16.5', y1: '16.5', x2: '21', y2: '21' } }
      ],
      folder: [
        { tag: 'path', props: { d: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' } }
      ],
      clock: [
        { tag: 'circle', props: { cx: '12', cy: '12', r: '9' } },
        { tag: 'polyline', props: { points: '12 7 12 12 15.5 14' } }
      ],
      bolt: [
        { tag: 'polygon', props: { points: '13 2 4 14 11 14 10 22 20 10 13 10' } }
      ],
      compass: [
        { tag: 'circle', props: { cx: '12', cy: '12', r: '9' } },
        { tag: 'polygon', props: { points: '15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5' } }
      ],
      link: [
        { tag: 'path', props: { d: 'M9 15l6-6' } },
        { tag: 'path', props: { d: 'M11 6l1.3-1.3a4 4 0 0 1 5.7 5.7L16.7 11.7' } },
        { tag: 'path', props: { d: 'M13 18l-1.3 1.3a4 4 0 0 1-5.7-5.7L7.3 12.3' } }
      ],
      sparkle: [
        { tag: 'path', props: { d: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z' } }
      ],
      doc: [
        { tag: 'path', props: { d: 'M7 2h7l5 5v14H7z' } },
        { tag: 'path', props: { d: 'M14 2v5h5' } },
        { tag: 'line', props: { x1: '10', y1: '13', x2: '17', y2: '13' } },
        { tag: 'line', props: { x1: '10', y1: '17', x2: '17', y2: '17' } }
      ]
    };

    function Icon(props) {
      var def = ICONS[props.name]
      if (!def) return null
      return react.createElement('svg', {
        className: 'dsh-icon' + (props.className ? ' ' + props.className : ''),
        width: props.size || 14,
        height: props.size || 14,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true
      }, def.map(function (el, i) {
        return react.createElement(el.tag, Object.assign({ key: i }, el.props))
      }))
    }

    function H3(props) {
      return react.createElement('h3', { className: 'dsh-h3' },
        react.createElement(Icon, { name: props.icon, size: 13 }),
        props.text)
    }

    var TAB_META = [
      { id: 'overview', label: 'Overview', icon: 'grid' },
      { id: 'evidence', label: 'Decisions', icon: 'list' },
      { id: 'conflicts', label: 'Rejected options', icon: 'ban' },
      { id: 'versions', label: 'Versions', icon: 'branch' }
    ];

    function dashData(dataset) {
      return fetch('/api/dash-data?dataset=' + encodeURIComponent(dataset)).then(function (resp) {
        if (!resp.ok) throw new Error('HTTP ' + resp.status)
        return resp.json()
      })
    }

    function matches(query, fields) {
      if (!query) return true
      var hay = fields.join(' ').toLowerCase()
      return hay.indexOf(query.toLowerCase()) !== -1
    }

    function accentClass(value) {
      if (value === 'adopted' || value === 'release') return 'dsh-accent-ok'
      if (value === 'rejected' || value === 'reverted') return 'dsh-accent-bad'
      return 'dsh-accent-mid'
    }

    function StatCards(props) {
      var datasets = props.datasets
      if (!datasets) return null
      return react.createElement('div', { className: 'dsh-kpis' },
        datasets.map(function (ds) {
          var meta = TAB_META.find(function (t) { return t.id === ds.id })
          return react.createElement('div', {
            key: ds.id,
            className: 'dsh-kpi' + (props.active === ds.id ? ' dsh-kpi-active' : ''),
            onClick: function () { props.onSelect(ds.id) },
            title: ds.description || ds.label
          },
            react.createElement('div', { className: 'dsh-kpi-num' }, ds.count !== null && ds.count !== undefined ? String(ds.count) : '—'),
            react.createElement('div', { className: 'dsh-kpi-head' },
          react.createElement(Icon, { name: meta ? meta.icon : 'grid', size: 14 }),
          react.createElement('div', { className: 'dsh-kpi-label' }, ds.label)),)
        }))
    }

    function Skeleton() {
      return react.createElement('div', { className: 'dsh-stack' },
        react.createElement('div', { className: 'dsh-skeleton' }),
        react.createElement('div', { className: 'dsh-skeleton' }),
        react.createElement('div', { className: 'dsh-skeleton' }))
    }

    function EmptyState(props) {
      return react.createElement('div', { className: 'dsh-empty' },
        react.createElement(Icon, { name: 'search', size: 14 }),
        props.text || 'No entries match the current filter.')
    }

    function OverviewView(props) {
      var d = props.data
      if (!d) return null
      var columns = ['Component', 'Category', 'Status']
      return react.createElement('div', { className: 'dsh-stack' },
        d.highlights ? react.createElement('div', { className: 'dsh-card dsh-accent-ok' },
          react.createElement(H3, { icon: 'sparkle', text: 'Release highlights — ' + d.highlights.title }),
          react.createElement('ul', { style: { margin: '4px 0' } },
            (d.highlights.points || []).map(function (o) { return react.createElement('li', { key: o, className: 'dsh-li' }, o) }))) : null,
        react.createElement('div', null,
          react.createElement(H3, { icon: 'grid', text: 'Components' }),
          react.createElement('table', { className: 'dsh-table' },
            react.createElement('thead', null,
              react.createElement('tr', null, columns.map(function (c) { return react.createElement('th', { key: c }, c) }))),
            react.createElement('tbody', null, (d.components || []).map(function (t) {
              return react.createElement('tr', { key: t.id },
                react.createElement('td', null, react.createElement('b', null, t.id)),
                react.createElement('td', null, t.category),
                react.createElement('td', null, react.createElement('span', { className: 'dsh-badge' }, t.status)))
            })))),
        react.createElement('div', { className: 'dsh-cols' },
          d.performance ? react.createElement('div', { className: 'dsh-col' },
            react.createElement(H3, { icon: 'bolt', text: 'Runtime notes' }),
            react.createElement('div', { className: 'dsh-card' },
              react.createElement('ul', { style: { margin: '2px 0' } },
                (d.performance.points || []).map(function (o) { return react.createElement('li', { key: o, className: 'dsh-li' }, o) })))) : null,
          d.principles ? react.createElement('div', { className: 'dsh-col' },
            react.createElement(H3, { icon: 'compass', text: 'Design principles' }),
            react.createElement('div', { className: 'dsh-card' },
              react.createElement('ul', { style: { margin: '2px 0' } },
                (d.principles.points || []).map(function (o) { return react.createElement('li', { key: o, className: 'dsh-li' }, o) })))) : null,
          d.compatibility ? react.createElement('div', { className: 'dsh-col' },
            react.createElement(H3, { icon: 'link', text: 'Compatibility' }),
            react.createElement('div', { className: 'dsh-card' },
              react.createElement('ul', { style: { margin: '2px 0' } },
                (d.compatibility.points || []).map(function (o) { return react.createElement('li', { key: o, className: 'dsh-li' }, o) })))) : null))
    }

    function DecisionsView(props) {
      var d = props.data
      var query = props.query
      var chipState = react.useState(null)
      var chip = chipState[0]
      var setChip = chipState[1]
      if (!d) return null
      var entries = d.entries || []
      var values = ['all'].concat(Array.from(new Set(entries.map(function (e) { return e.claim_level || '—' }))))
      var filtered = entries.filter(function (e) {
        var chipOk = chip === null || chip === 'all' || (e.claim_level || '—') === chip
        return chipOk && matches(query, [e.id || '', e.claim_level || '', e.target || ''])
      })
      return react.createElement('div', { className: 'dsh-stack' },
        react.createElement('div', { className: 'dsh-chips-row' },
          values.map(function (v) {
            var active = (chip === null && v === 'all') || chip === v
            return react.createElement('button', {
              key: v,
              className: 'dsh-chip-btn' + (active ? ' dsh-chip-btn-active' : ''),
              onClick: function () { setChip(v === 'all' ? null : v) }
            }, v)
          })),
        react.createElement('div', { className: 'dsh-sub' }, 'schema ' + d.schema_version + ' · showing ' + filtered.length + '/' + entries.length + ' entries'),
        filtered.length === 0 ? react.createElement(EmptyState) : filtered.map(function (e) {
          return react.createElement('div', { key: e.id, className: 'dsh-card ' + accentClass(e.claim_level) },
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
      var chipState = react.useState(null)
      var chip = chipState[0]
      var setChip = chipState[1]
      if (!d) return null
      var entries = d.entries || []
      var values = ['all'].concat(Array.from(new Set(entries.map(function (e) { return e.lineage_decision || 'recorded' }))))
      var filtered = entries.filter(function (e) {
        var chipOk = chip === null || chip === 'all' || (e.lineage_decision || 'recorded') === chip
        return chipOk && matches(query, [e.id || '', e.target || '', e.path || '', e.lineage_decision || '', e.suspected_conflict || ''])
      })
      return react.createElement('div', { className: 'dsh-stack' },
        react.createElement('div', { className: 'dsh-chips-row' },
          values.map(function (v) {
            var active = (chip === null && v === 'all') || chip === v
            return react.createElement('button', {
              key: v,
              className: 'dsh-chip-btn' + (active ? ' dsh-chip-btn-active' : ''),
              onClick: function () { setChip(v === 'all' ? null : v) }
            }, v)
          })),
        react.createElement('div', { className: 'dsh-sub' }, 'schema ' + d.schema_version + ' · showing ' + filtered.length + '/' + entries.length + ' records'),
        filtered.length === 0 ? react.createElement(EmptyState) : filtered.map(function (e) {
          return react.createElement('div', { key: e.id, className: 'dsh-card ' + accentClass(e.lineage_decision) },
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

    var LEGEND = [
      { kind: 'initial', label: 'initial' },
      { kind: 'hotfix', label: 'hotfix' },
      { kind: 'prerelease', label: 'prerelease' },
      { kind: 'release', label: 'release' },
      { kind: 'reverted', label: 'reverted' },
      { kind: 'eol', label: 'end-of-life' }
    ]

    function GitTreeView(props) {
      var d = props.data
      if (!d) return null
      var selected = props.selected
      return react.createElement('div', { className: 'dsh-stack' },
        react.createElement('div', { className: 'dsh-sub' }, 'schema ' + d.schema_version + ' · updated ' + d.updated_at + ' — ' + d.provenance),
        react.createElement('div', { className: 'dsh-legend' },
          LEGEND.map(function (item) {
            return react.createElement('span', { key: item.kind },
              react.createElement('span', { className: 'dsh-legend-dot dsh-gh-' + item.kind }),
              item.label)
          })),
        (d.branches || []).map(function (branch) {
          var collapsed = props.collapsed && props.collapsed[branch.id]
          var graph = buildBranchRows(branch)
          return react.createElement('div', { key: branch.id, className: 'dsh-card dsh-gh-branch' },
            react.createElement('div', { className: 'dsh-gh-branch-head' },
              react.createElement('button', { className: 'dsh-gh-branch-btn', onClick: function () { props.onToggleBranch(branch.id) }, title: collapsed ? 'Expand branch' : 'Collapse branch' },
                react.createElement('span', { className: 'dsh-chevron' }, collapsed ? '▸' : '▾'),
                react.createElement('b', null, branch.label)),
              react.createElement('span', { className: 'dsh-muted' }, branch.track),
              react.createElement('span', { className: 'dsh-badge' }, 'head: ' + branch.head)),
            collapsed ? null : react.createElement('div', { className: 'dsh-gh-list' },
              graph.rows.map(function (row, ri) {
                if (row.kind === 'connector') {
                  return react.createElement('div', { key: 'c' + ri, className: 'dsh-gh-row dsh-gh-connector' },
                    react.createElement('div', { className: 'dsh-gh-cells' },
                      row.cells.map(function (cell, cellIndex) { return react.createElement(GraphCell, { key: cellIndex, cell: cell }) })),
                    react.createElement('div', { className: 'dsh-gh-body' }))
                }
                var node = row.node
                var isSelected = selected && selected.branch === branch.id && selected.node === node.id
                var rendered = [react.createElement('div', {
                  key: node.id,
                  className: 'dsh-gh-row dsh-gh-node-row' + (isSelected ? ' dsh-gh-selected' : ''),
                  onClick: function () { props.onSelectNode(branch.id, node.id) },
                  title: node.summary
                },
                  react.createElement('div', { className: 'dsh-gh-cells' },
                    row.cells.map(function (cell, cellIndex) { return react.createElement(GraphCell, { key: cellIndex, cell: cell }) })),
                  react.createElement('div', { className: 'dsh-gh-body' },
                    react.createElement('div', null,
                      react.createElement('span', { className: 'dsh-gh-label' }, node.label || node.id),
                      node.sha256 ? react.createElement('span', { className: 'dsh-gh-hash' }, node.sha256) : null,
                      react.createElement('span', { className: 'dsh-gh-kind dsh-gh-kind-' + node.kind }, node.kind),
                      node.promoted_at ? react.createElement('span', { className: 'dsh-gh-kind' }, 'promoted ' + node.promoted_at) : null),
                    react.createElement('div', { className: 'dsh-muted' }, node.summary)))]
                if (isSelected) {
                  rendered.push(react.createElement('div', { key: node.id + '-detail', className: 'dsh-gh-detail' },
                    react.createElement('div', { className: 'dsh-muted' }, 'parents: ' + ((node.parents && node.parents.length) ? node.parents.join(' ← ') : '(root)')),
                    react.createElement('div', { className: 'dsh-gh-note' }, node.note || 'No additional notes.'),
                    react.createElement('div', { className: 'dsh-muted' }, 'kind: ' + node.kind)))
                }
                return rendered
              })))
        }))
    }

    function ChangelogView(props) {
      var d = props.data
      var openState = react.useState(null)
      var openSet = openState[0]
      var setOpenSet = openState[1]
      if (!d) return null
      var markdown = String(d.markdown || '')
      var blocks = []
      var current = null
      var lines = markdown.split('\n')
      for (var li = 0; li < lines.length; li++) {
        var line = lines[li]
        var versionMatch = /^##\s+(.+)$/.exec(line)
        var subMatch = /^###\s+(.+)$/.exec(line)
        if (versionMatch) { current = { version: versionMatch[1], subs: [] }; blocks.push(current); continue }
        if (subMatch && current) { current.subs.push({ title: subMatch[1], bullets: [] }); continue }
        if (/^\s*-\s+/.test(line)) {
          var text = line.replace(/^\s*-\s+/, '').trim()
          var sub = current && current.subs.length ? current.subs[current.subs.length - 1] : null
          if (sub) sub.bullets.push(text)
          else if (current) { (current.intro = current.intro || []).push(text) }
        }
      }
      var effective = openSet === null ? (blocks.length ? { [blocks[0].version]: true } : {}) : openSet
      return react.createElement('div', { className: 'dsh-stack' },
        react.createElement('div', { className: 'dsh-sub' }, 'source: ' + (d.source || '—')),
        blocks.length === 0 ? react.createElement(EmptyState, { text: 'No changelog found.' }) : blocks.map(function (block) {
          var open = Boolean(effective[block.version])
          return react.createElement('div', { key: block.version, className: 'dsh-card' },
            react.createElement('div', null,
              react.createElement('button', { className: 'dsh-ch-version-btn', onClick: function () { var next = Object.assign({}, effective); if (open) delete next[block.version]; else next[block.version] = true; setOpenSet(next) } },
                react.createElement('span', { className: 'dsh-chevron' }, open ? '▾' : '▸'),
                react.createElement('span', { className: 'dsh-ch-dot' }),
                block.version)),
            open ? react.createElement('div', null,
              (block.intro || []).map(function (b, i) {
                return react.createElement('div', { key: 'i' + i, className: 'dsh-ch-bullet' }, '• ' + b)
              }),
              block.subs.map(function (sub) {
                return react.createElement('div', { key: sub.title },
                  react.createElement('div', { className: 'dsh-ch-sub' }, react.createElement('b', null, sub.title)),
                  sub.bullets.map(function (b, i) {
                    return react.createElement('div', { key: 'b' + i, className: 'dsh-ch-bullet' }, '• ' + b)
                  }))
              })) : null)
        }))
    }

    function VersionsView(props) {
      var d = props.data
      if (!d) return null
      return react.createElement('div', { className: 'dsh-stack' },
        react.createElement('div', null,
          react.createElement(H3, { icon: 'branch', text: 'Release history' }),
          react.createElement(GitTreeView, {
            data: d.versions,
            selected: props.selected,
            onSelectNode: props.onSelectNode,
            collapsed: props.collapsed,
            onToggleBranch: props.onToggleBranch
          })),
        react.createElement('div', null,
          react.createElement(H3, { icon: 'doc', text: 'Changelog' }),
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
      var selectedState = react.useState(null)
      var selected = selectedState[0]
      var setSelected = selectedState[1]
      var collapsedState = react.useState({})
      var collapsed = collapsedState[0]
      var setCollapsed = collapsedState[1]

      react.useEffect(function () {
        var alive = true
        dashData('catalog').then(function (value) {
          if (!alive) return
          if (value && typeof value.error !== 'string' && Array.isArray(value.datasets)) setMeta(value)
        }).catch(function () { /* catalog is optional */ })
        return function () { alive = false }
      }, [reloadKey])

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

      var switchTab = function (id) {
        setTab(id)
        setQuery('')
        setData(null)
        setError(null)
        setSelected(null)
      }

      var selectNode = function (branch, node) {
        setSelected(function (prev) {
          if (prev && prev.branch === branch && prev.node === node) return null
          return { branch: branch, node: node }
        })
      }

      var toggleBranch = function (branch) {
        setCollapsed(function (prev) {
          var next = Object.assign({}, prev)
          if (next[branch]) delete next[branch]
          else next[branch] = true
          return next
        })
      }

      var tabs = (meta && meta.datasets) ? meta.datasets : TAB_META
      var showSearch = tab === 'evidence' || tab === 'conflicts'

      var body = error
        ? react.createElement('div', { className: 'dsh-err' },
            'Host data unavailable: ' + error,
            react.createElement('button', { className: 'dsh-retry', onClick: function () { setReloadKey(function (k) { return k + 1 }) } }, 'Retry'))
        : !data
          ? react.createElement(Skeleton)
          : react.createElement('div', { className: 'dsh-fade', key: tab + ':' + reloadKey },
              tab === 'overview'
                ? react.createElement(OverviewView, { data: data })
                : tab === 'versions'
                  ? react.createElement(VersionsView, { data: data, selected: selected, onSelectNode: selectNode, collapsed: collapsed, onToggleBranch: toggleBranch })
                  : react.createElement('div', { className: 'dsh-stack' },
                      showSearch ? react.createElement('div', null,
                        react.createElement('input', { className: 'dsh-input', placeholder: 'filter…', value: query, onChange: function (e) { setQuery(e.target.value) } })) : null,
                      tab === 'evidence'
                        ? react.createElement(DecisionsView, { data: data, query: query })
                        : react.createElement(RejectedView, { data: data, query: query })))

      var dataDir = meta && meta.data_dir ? String(meta.data_dir).split('/').pop() : null

      return react.createElement('div', { className: 'dsh-wrap' },
        react.createElement('div', { className: 'dsh-header' },
          react.createElement('div', { className: 'dsh-header-row' },
            react.createElement('div', { className: 'dsh-title' }, 'DSH Self-Harness Tools — Release Dashboard'),
            react.createElement('button', { className: 'dsh-icon-btn', title: 'Refresh data', onClick: function () { setReloadKey(function (k) { return k + 1 }) } },
              react.createElement(Icon, { name: 'refresh', size: 13 }),
              'Refresh')),
          react.createElement('div', { className: 'dsh-sub' }, 'Archive dashboard for the DSH self-harness tool suite: components, design decisions, rejected options, and the version tree.'),
          react.createElement('div', { className: 'dsh-chips' },
            dataDir ? react.createElement('span', { className: 'dsh-chip' },
              react.createElement(Icon, { name: 'folder', size: 11 }),
              dataDir) : null,
            react.createElement('span', { className: 'dsh-chip' },
              react.createElement(Icon, { name: 'clock', size: 11 }),
              '2026-08-16'))),
        react.createElement(StatCards, { datasets: tabs, active: tab, onSelect: switchTab }),
        react.createElement('div', { className: 'dsh-tabs' },
          tabs.map(function (t) {
            var icon = TAB_META.find(function (m) { return m.id === t.id })
            return react.createElement('button', {
              key: t.id,
              className: 'dsh-tab' + (tab === t.id ? ' dsh-tab-active' : ''),
              onClick: function () { switchTab(t.id) }
            }, react.createElement(Icon, { name: icon ? icon.icon : 'grid', size: 12 }), t.label, t.count !== null && t.count !== undefined ? react.createElement('span', { className: 'dsh-badge' }, String(t.count)) : null)
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
