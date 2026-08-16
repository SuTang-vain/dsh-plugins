// dsh-evidence-dashboard — Client half (dynamic variant), v1.6.2 "Release Cockpit".
// Registered in two additive slots:
//   tool.view.cordis (key 'self')  — inside this Package's latest run card
//   settings.section (dsh-evidence) — a full settings page for later browsing
// All data arrives over Package-private RPC from the Host half.
//
// v1.6.2: horizontal release-history timeline (SVG; forks/merges arc above
// the main line, node click opens an inline detail) and a unified, simplified
// visual language (accent bars removed, flat cards everywhere).
// Earlier: self-contained EN/中文 toggle, monochrome SVG icons, KPI cards,
// filter chips, expandable changelog, skeleton/fade/empty states.

const STYLES = [
  '.dsh-wrap { font-size: 13px; line-height: 1.5; color: var(--dsw-alias-label-primary, inherit); max-width: 860px; }',
  '.dsh-header { margin-bottom: 10px; }',
  '.dsh-header-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }',
  '.dsh-header-actions { display: flex; align-items: center; gap: 6px; }',
  '.dsh-title { font-size: 15px; font-weight: 600; margin: 0 0 2px; }',
  '.dsh-sub { color: var(--dsw-alias-label-secondary, inherit); opacity: 0.85; font-size: 12px; }',
  '.dsh-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }',
  '.dsh-chip { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; border: 1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.35)); border-radius: 10px; padding: 1px 8px; color: var(--dsw-alias-label-secondary, inherit); white-space: nowrap; }',
  '.dsh-icon-btn { display: inline-flex; align-items: center; gap: 4px; background: transparent; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.5)); border-radius: 6px; padding: 2px 8px; cursor: pointer; color: inherit; font-size: 12px; }',
  '.dsh-lang-btn { display: inline-flex; align-items: center; background: transparent; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.5)); border-radius: 6px; padding: 2px 8px; cursor: pointer; color: inherit; font-size: 11px; }',
  '.dsh-kpis { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }',
  '.dsh-kpi { flex: 1; min-width: 96px; border: 1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.35)); border-radius: 10px; padding: 8px 10px; cursor: pointer; background: transparent; }',
  '.dsh-kpi:hover { border-color: var(--dsw-alias-border-l2, rgba(128,128,128,0.5)); }',
  '.dsh-kpi-active { border-color: var(--dsw-alias-brand-primary, #48e); }',
  '.dsh-kpi-head { display: flex; align-items: center; gap: 6px; }',
  '.dsh-kpi-num { font-size: 18px; font-weight: 700; }',
  '.dsh-kpi-label { font-size: 11px; color: var(--dsw-alias-label-secondary, inherit); }',
  '.dsh-tabs { display: flex; gap: 6px; flex-wrap: wrap; margin: 10px 0; }',
  '.dsh-tab { display: inline-flex; align-items: center; gap: 5px; background: transparent; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.4)); border-radius: 999px; padding: 4px 12px; cursor: pointer; font-size: 12px; color: inherit; }',
  '.dsh-tab-active { border-color: var(--dsw-alias-brand-primary, currentColor); font-weight: 600; }',
  '.dsh-badge { display: inline-block; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.5)); border-radius: 10px; padding: 0 7px; font-size: 11px; white-space: nowrap; margin-left: 4px; }',
  '.dsh-stack { display: flex; flex-direction: column; gap: 10px; }',
  '.dsh-h3 { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; margin: 4px 0; }',
  '.dsh-h3 .dsh-icon { color: var(--dsw-alias-label-secondary, inherit); }',
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
  '.dsh-empty { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 18px; color: var(--dsw-alias-label-secondary, inherit); border: 1px dashed var(--dsw-alias-border-l1, rgba(128,128,128,0.45)); border-radius: 8px; font-size: 12px; }',
  '.dsh-chips-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 4px; }',
  '.dsh-chip-btn { background: transparent; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.4)); border-radius: 999px; padding: 1px 10px; cursor: pointer; font-size: 11px; color: inherit; }',
  '.dsh-chip-btn-active { border-color: var(--dsw-alias-brand-primary, #48e); font-weight: 600; }',
  // horizontal version-tree styles
  '.dsh-legend { display: flex; gap: 10px; flex-wrap: wrap; font-size: 11px; color: var(--dsw-alias-label-secondary, inherit); }',
  '.dsh-legend-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; }',
  '.dsh-gh-branch-head { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 4px; }',
  '.dsh-chevron { color: var(--dsw-alias-label-secondary, inherit); margin-right: 4px; }',
  '.dsh-tree-scroll { overflow-x: auto; padding-bottom: 4px; }',
  '.dsh-tree { display: block; }',
  '.dsh-tree line, .dsh-tree path { stroke: var(--dsw-alias-border-l2, rgba(128,128,128,0.6)); stroke-width: 2; fill: none; }',
  '.dsh-tree text { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 10.5px; fill: var(--dsw-alias-label-primary, inherit); }',
  '.dsh-tree circle { stroke: var(--dsw-alias-border-l2, rgba(128,128,128,0.7)); stroke-width: 1.5; cursor: pointer; }',
  '.dsh-tree-ring { fill: none; stroke: var(--dsw-alias-brand-primary, #48e); stroke-width: 1.5; cursor: pointer; }',
  '.dsh-gh-note { font-size: 11px; font-style: italic; color: var(--dsw-alias-label-secondary, inherit); }',
  '.dsh-gh-detail { margin-top: 8px; padding: 6px 10px; background: var(--dsw-alias-bg-layer-1, rgba(128,128,128,0.06)); border-radius: 8px; }',
  // changelog timeline styles
  '.dsh-ch-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; background: var(--dsw-alias-state-success-primary, #3a5); }',
  '.dsh-ch-version-btn { display: inline-flex; align-items: center; background: transparent; border: none; color: inherit; cursor: pointer; padding: 0; font-weight: 600; font-size: 13px; }',
  '.dsh-ch-sub { margin-top: 6px; }',
  '.dsh-ch-bullet { margin: 2px 0 2px 14px; }'
].join('\n')

// Monochrome inline SVG icon set (stroke = currentColor, no external assets).
const ICONS = {
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
}

function Icon(props) {
  const def = ICONS[props.name]
  if (!def) return null
  return React.createElement('svg', {
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
    return React.createElement(el.tag, Object.assign({ key: i }, el.props))
  }))
}

const TAB_META = [
  { id: 'overview', icon: 'grid' },
  { id: 'evidence', icon: 'list' },
  { id: 'conflicts', icon: 'ban' },
  { id: 'versions', icon: 'branch' }
]

// Self-contained bilingual dictionary; the header toggle flips LANG state.
const T = {
  en: {
    title: 'DSH Self-Harness Tools — Release Dashboard',
    subtitle: 'Archive dashboard for the DSH self-harness tool suite: components, design decisions, rejected options, and the version tree.',
    updated: '2026-08-16',
    refresh: 'Refresh',
    retry: 'Retry',
    hostError: 'Host data unavailable: ',
    filter: 'filter…',
    all: 'all',
    showing: 'showing',
    entries: 'entries',
    records: 'records',
    empty: 'No entries match the current filter.',
    noChangelog: 'No changelog found.',
    schema: 'schema',
    source: 'source',
    tabs: { overview: 'Overview', evidence: 'Decisions', conflicts: 'Rejected options', versions: 'Versions' },
    sections: { highlights: 'Release highlights', components: 'Components', runtime: 'Runtime notes', principles: 'Design principles', compat: 'Compatibility', history: 'Release history', changelog: 'Changelog' },
    legend: { initial: 'initial', hotfix: 'hotfix', prerelease: 'prerelease', release: 'release', reverted: 'reverted', eol: 'end-of-life' },
    head: 'head',
    parents: 'parents',
    root: '(root)',
    kind: 'kind',
    noNotes: 'No additional notes.',
    refreshTitle: 'Refresh data',
    langSwitch: '中文'
  },
  zh: {
    title: 'DSH Self-Harness Tools — 发布仪表盘',
    subtitle: 'DSH self-harness 工具套件归档仪表盘：组件概览、设计决策、已否决选项与版本树。',
    updated: '2026-08-16',
    refresh: '刷新',
    retry: '重试',
    hostError: 'Host 数据不可用：',
    filter: '筛选…',
    all: '全部',
    showing: '显示',
    entries: '条',
    records: '条记录',
    empty: '没有匹配当前筛选的条目。',
    noChangelog: '未找到 changelog。',
    schema: 'schema',
    source: '来源',
    tabs: { overview: '概览', evidence: '决策', conflicts: '已否决选项', versions: '版本' },
    sections: { highlights: '发布亮点', components: '组件', runtime: '运行时说明', principles: '设计原则', compat: '兼容性', history: '发布历史', changelog: '变更日志' },
    legend: { initial: '初始', hotfix: '热修复', prerelease: '预发布', release: '发布', reverted: '已回滚', eol: '生命周期结束' },
    head: 'HEAD',
    parents: '父节点',
    root: '(根)',
    kind: '类型',
    noNotes: '无附加说明。',
    refreshTitle: '刷新数据',
    langSwitch: 'EN'
  }
}

function detectLang() {
  try {
    if (typeof navigator !== 'undefined' && navigator.language) {
      return String(navigator.language).toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en'
    }
  } catch (ignored) { /* keep en */ }
  return 'en'
}

function matches(query, fields) {
  if (!query) return true
  const hay = fields.join(' ').toLowerCase()
  return hay.indexOf(query.toLowerCase()) !== -1
}

function StatCards(props) {
  const datasets = props.datasets
  if (!datasets) return null
  return React.createElement('div', { className: 'dsh-kpis' },
    datasets.map(function (ds) {
      const meta = TAB_META.find(function (t) { return t.id === ds.id })
      return React.createElement('div', {
        key: ds.id,
        className: 'dsh-kpi' + (props.active === ds.id ? ' dsh-kpi-active' : ''),
        onClick: function () { props.onSelect(ds.id) },
        title: ds.description || props.t.tabs[ds.id]
      },
        React.createElement('div', { className: 'dsh-kpi-head' },
          React.createElement(Icon, { name: meta ? meta.icon : 'grid', size: 14 }),
          React.createElement('div', { className: 'dsh-kpi-label' }, props.t.tabs[ds.id] || ds.label)),
        React.createElement('div', { className: 'dsh-kpi-num' }, ds.count !== null && ds.count !== undefined ? String(ds.count) : '—'))
    }))
}

function Skeleton() {
  return React.createElement('div', { className: 'dsh-stack' },
    React.createElement('div', { className: 'dsh-skeleton' }),
    React.createElement('div', { className: 'dsh-skeleton' }),
    React.createElement('div', { className: 'dsh-skeleton' }))
}

function EmptyState(props) {
  return React.createElement('div', { className: 'dsh-empty' },
    React.createElement(Icon, { name: 'search', size: 14 }),
    props.text)
}

function H3(props) {
  return React.createElement('h3', { className: 'dsh-h3' },
    React.createElement(Icon, { name: props.icon, size: 13 }),
    props.text)
}

function OverviewView(props) {
  const d = props.data
  const t = props.t
  if (!d) return null
  const columns = ['Component', 'Category', 'Status']
  return React.createElement('div', { className: 'dsh-stack' },
    d.highlights ? React.createElement('div', { className: 'dsh-card' },
      React.createElement(H3, { icon: 'sparkle', text: t.sections.highlights + ' — ' + d.highlights.title }),
      React.createElement('ul', { style: { margin: '4px 0' } },
        (d.highlights.points || []).map(function (o) { return React.createElement('li', { key: o, className: 'dsh-li' }, o) }))) : null,
    React.createElement('div', null,
      React.createElement(H3, { icon: 'grid', text: t.sections.components }),
      React.createElement('table', { className: 'dsh-table' },
        React.createElement('thead', null,
          React.createElement('tr', null, columns.map(function (c) { return React.createElement('th', { key: c }, c) }))),
        React.createElement('tbody', null, (d.components || []).map(function (item) {
          return React.createElement('tr', { key: item.id },
            React.createElement('td', null, React.createElement('b', null, item.id)),
            React.createElement('td', null, item.category),
            React.createElement('td', null, React.createElement('span', { className: 'dsh-badge' }, item.status)))
        })))),
    React.createElement('div', { className: 'dsh-cols' },
      d.performance ? React.createElement('div', { className: 'dsh-col' },
        React.createElement(H3, { icon: 'bolt', text: t.sections.runtime }),
        React.createElement('div', { className: 'dsh-card' },
          React.createElement('ul', { style: { margin: '2px 0' } },
            (d.performance.points || []).map(function (o) { return React.createElement('li', { key: o, className: 'dsh-li' }, o) })))) : null,
      d.principles ? React.createElement('div', { className: 'dsh-col' },
        React.createElement(H3, { icon: 'compass', text: t.sections.principles }),
        React.createElement('div', { className: 'dsh-card' },
          React.createElement('ul', { style: { margin: '2px 0' } },
            (d.principles.points || []).map(function (o) { return React.createElement('li', { key: o, className: 'dsh-li' }, o) })))) : null,
      d.compatibility ? React.createElement('div', { className: 'dsh-col' },
        React.createElement(H3, { icon: 'link', text: t.sections.compat }),
        React.createElement('div', { className: 'dsh-card' },
          React.createElement('ul', { style: { margin: '2px 0' } },
            (d.compatibility.points || []).map(function (o) { return React.createElement('li', { key: o, className: 'dsh-li' }, o) })))) : null))
}

function DecisionsView(props) {
  const d = props.data
  const query = props.query
  const t = props.t
  const chipState = React.useState(null)
  const chip = chipState[0]
  const setChip = chipState[1]
  if (!d) return null
  const entries = d.entries || []
  const values = [t.all].concat(Array.from(new Set(entries.map(function (e) { return e.claim_level || '—' }))))
  const filtered = entries.filter(function (e) {
    const chipOk = chip === null || chip === t.all || (e.claim_level || '—') === chip
    return chipOk && matches(query, [e.id || '', e.claim_level || '', e.target || ''])
  })
  return React.createElement('div', { className: 'dsh-stack' },
    React.createElement('div', { className: 'dsh-chips-row' },
      values.map(function (v) {
        const active = (chip === null && v === t.all) || chip === v
        return React.createElement('button', {
          key: v,
          className: 'dsh-chip-btn' + (active ? ' dsh-chip-btn-active' : ''),
          onClick: function () { setChip(v === t.all ? null : v) }
        }, v)
      })),
    React.createElement('div', { className: 'dsh-sub' }, t.schema + ' ' + d.schema_version + ' · ' + t.showing + ' ' + filtered.length + '/' + entries.length + ' ' + t.entries),
    filtered.length === 0 ? React.createElement(EmptyState, { text: t.empty }) : filtered.map(function (e) {
      return React.createElement('div', { key: e.id, className: 'dsh-card' },
        React.createElement('div', null,
          React.createElement('b', null, e.id), ' ',
          React.createElement('span', { className: 'dsh-badge' }, e.claim_level || '—')),
        React.createElement('div', { className: 'dsh-muted' }, t.source + ': ' + (e.source || '—')),
        (e.supports && e.supports.length) ? React.createElement('div', null, React.createElement('b', null, 'supports'), React.createElement('ul', { style: { margin: '2px 0' } }, e.supports.map(function (s) { return React.createElement('li', { key: s, className: 'dsh-li' }, s) }))) : null,
        (e.does_not_support && e.does_not_support.length) ? React.createElement('div', null, React.createElement('b', null, 'does not support'), React.createElement('ul', { style: { margin: '2px 0' } }, e.does_not_support.map(function (s) { return React.createElement('li', { key: s, className: 'dsh-li' }, s) }))) : null)
    }))
}

function RejectedView(props) {
  const d = props.data
  const query = props.query
  const t = props.t
  const chipState = React.useState(null)
  const chip = chipState[0]
  const setChip = chipState[1]
  if (!d) return null
  const entries = d.entries || []
  const values = [t.all].concat(Array.from(new Set(entries.map(function (e) { return e.lineage_decision || 'recorded' }))))
  const filtered = entries.filter(function (e) {
    const chipOk = chip === null || chip === t.all || (e.lineage_decision || 'recorded') === chip
    return chipOk && matches(query, [e.id || '', e.target || '', e.path || '', e.lineage_decision || '', e.suspected_conflict || ''])
  })
  return React.createElement('div', { className: 'dsh-stack' },
    React.createElement('div', { className: 'dsh-chips-row' },
      values.map(function (v) {
        const active = (chip === null && v === t.all) || chip === v
        return React.createElement('button', {
          key: v,
          className: 'dsh-chip-btn' + (active ? ' dsh-chip-btn-active' : ''),
          onClick: function () { setChip(v === t.all ? null : v) }
        }, v)
      })),
    React.createElement('div', { className: 'dsh-sub' }, t.schema + ' ' + d.schema_version + ' · ' + t.showing + ' ' + filtered.length + '/' + entries.length + ' ' + t.records),
    filtered.length === 0 ? React.createElement(EmptyState, { text: t.empty }) : filtered.map(function (e) {
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

// Horizontal git-graph layout: the same lane assignment as a vertical graph,
// but time flows left → right along a horizontal main line and fork/merge
// edges arc above/below it. Returns SVG-ready geometry: per-edge descriptors,
// per-node coordinates, and the canvas size.
const KIND_FILL = {
  initial: 'var(--dsw-alias-label-secondary, #888)',
  hotfix: 'var(--dsw-alias-state-warn-primary, #d90)',
  prerelease: 'var(--dsw-alias-brand-primary, #48e)',
  release: 'var(--dsw-alias-state-success-primary, #3a5)',
  reverted: 'var(--dsw-alias-state-error-primary, #d05)',
  eol: 'var(--dsw-alias-state-warn-primary, #d90)'
}

function buildHorizontalTree(branch) {
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
  const COL_GAP = 64
  const LANE_GAP = 34
  const PAD_X = 26
  const PAD_Y = 8
  const R = 6
  const mainY = 22
  const laneCount = lanes.length
  const yRaw = function (lane) {
    if (lane === 0) return mainY
    const k = Math.ceil(lane / 2)
    return lane % 2 === 1 ? mainY - k * LANE_GAP : mainY + k * LANE_GAP
  }
  let minY = mainY
  let maxY = mainY
  for (let l = 0; l < laneCount; l++) {
    const y = yRaw(l)
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  const shiftY = PAD_Y - minY
  const yFor = function (lane) { return yRaw(lane) + shiftY }
  const xFor = function (i) { return PAD_X + i * COL_GAP }
  const width = PAD_X * 2 + Math.max(nodes.length - 1, 0) * COL_GAP
  const height = (maxY - minY) + PAD_Y + 26
  const elements = []
  nodes.forEach(function (node, i) {
    const l = laneOf[node.id]
    const y = yFor(l)
    const cx = xFor(i)
    for (const p of node.parents || []) {
      const pl = laneOf[p]
      if (pl === undefined) continue
      const py = yFor(pl)
      const px = xFor(indexById[p])
      if (pl === l) {
        elements.push({ tag: 'line', key: p + '→' + node.id, props: { x1: px + R, y1: y, x2: cx - R, y2: y } })
      } else {
        elements.push({ tag: 'path', key: p + '→' + node.id, props: { d: 'M ' + (px + R) + ' ' + py + ' V ' + y + ' H ' + (cx - R) } })
      }
    }
  })
  return { nodes: nodes, laneOf: laneOf, xFor: xFor, yFor: yFor, width: width, height: height, elements: elements }
}

const LEGEND_KINDS = ['initial', 'hotfix', 'prerelease', 'release', 'reverted', 'eol']

function HorizontalTreeView(props) {
  const d = props.data
  const t = props.t
  if (!d) return null
  const selected = props.selected
  const treeCard = function (branch) {
    const layout = buildHorizontalTree(branch)
    const selectedNode = selected && selected.branch === branch.id
      ? branch.nodes.find(function (n) { return n.id === selected.node })
      : null
    const detail = selectedNode ? React.createElement('div', { className: 'dsh-gh-detail' },
      React.createElement('div', { className: 'dsh-muted' },
        t.parents + ': ' + ((selectedNode.parents && selectedNode.parents.length) ? selectedNode.parents.join(' ← ') : t.root)),
      React.createElement('div', { className: 'dsh-gh-note' }, selectedNode.note || t.noNotes),
      React.createElement('div', { className: 'dsh-muted' },
        t.kind + ': ' + selectedNode.kind + (selectedNode.promoted_at ? ' · ' + selectedNode.promoted_at : ''))) : null
    const circles = layout.nodes.map(function (node, i) {
      const x = layout.xFor(i)
      const y = layout.yFor(layout.laneOf[node.id])
      const isSelected = selectedNode && selectedNode.id === node.id
      const parts = [
        React.createElement('title', { key: 'tt' + node.id }, node.summary),
        React.createElement('circle', {
          key: 'dot' + node.id,
          cx: x, cy: y, r: 6,
          fill: KIND_FILL[node.kind] || KIND_FILL.initial,
          onClick: function () { props.onSelectNode(branch.id, node.id) }
        }),
        React.createElement('text', { key: 'lb' + node.id, x: x, y: y + 18, textAnchor: 'middle' }, node.label || node.id)
      ]
      if (isSelected) parts.push(React.createElement('circle', { key: 'ring' + node.id, className: 'dsh-tree-ring', cx: x, cy: y, r: 9.5 }))
      return parts
    })
    const lines = layout.elements.map(function (el) {
      return React.createElement(el.tag, Object.assign({ key: el.key }, el.props))
    })
    const svg = React.createElement('svg', { className: 'dsh-tree', width: layout.width, height: layout.height, viewBox: '0 0 ' + layout.width + ' ' + layout.height, role: 'img' }, lines, circles)
    return React.createElement('div', { key: branch.id, className: 'dsh-card' },
      React.createElement('div', { className: 'dsh-gh-branch-head' },
        React.createElement('b', null, branch.label),
        React.createElement('span', { className: 'dsh-muted' }, branch.track),
        React.createElement('span', { className: 'dsh-badge' }, t.head + ': ' + branch.head)),
      React.createElement('div', { className: 'dsh-tree-scroll' }, svg),
      detail)
  }
  return React.createElement('div', { className: 'dsh-stack' },
    React.createElement('div', { className: 'dsh-sub' }, t.schema + ' ' + d.schema_version + ' · ' + t.updated + ' ' + d.updated_at + ' — ' + d.provenance),
    React.createElement('div', { className: 'dsh-legend' },
      LEGEND_KINDS.map(function (kind) {
        return React.createElement('span', { key: kind },
          React.createElement('span', { className: 'dsh-legend-dot', style: { background: KIND_FILL[kind] } }),
          t.legend[kind] || kind)
      })),
    (d.branches || []).map(treeCard))
}

function ChangelogView(props) {
  const d = props.data
  const t = props.t
  const openState = React.useState(null)
  const openSet = openState[0]
  const setOpenSet = openState[1]
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
  const effective = openSet === null ? (blocks.length ? { [blocks[0].version]: true } : {}) : openSet
  return React.createElement('div', { className: 'dsh-stack' },
    React.createElement('div', { className: 'dsh-sub' }, t.source + ': ' + (d.source || '—')),
    blocks.length === 0 ? React.createElement(EmptyState, { text: t.noChangelog }) : blocks.map(function (block) {
      const open = Boolean(effective[block.version])
      return React.createElement('div', { key: block.version, className: 'dsh-card' },
        React.createElement('div', null,
          React.createElement('button', { className: 'dsh-ch-version-btn', onClick: function () { const next = Object.assign({}, effective); if (open) delete next[block.version]; else next[block.version] = true; setOpenSet(next) } },
            React.createElement('span', { className: 'dsh-chevron' }, open ? '▾' : '▸'),
            React.createElement('span', { className: 'dsh-ch-dot' }),
            block.version)),
        open ? React.createElement('div', null,
          (block.intro || []).map(function (b, i) {
            return React.createElement('div', { key: 'i' + i, className: 'dsh-ch-bullet' }, '• ' + b)
          }),
          block.subs.map(function (sub) {
            return React.createElement('div', { key: sub.title },
              React.createElement('div', { className: 'dsh-ch-sub' }, React.createElement('b', null, sub.title)),
              sub.bullets.map(function (b, i) {
                return React.createElement('div', { key: 'b' + i, className: 'dsh-ch-bullet' }, '• ' + b)
              }))
          })) : null)
    }))
}

function VersionsView(props) {
  const d = props.data
  const t = props.t
  if (!d) return null
  return React.createElement('div', { className: 'dsh-stack' },
    React.createElement('div', null,
      React.createElement(H3, { icon: 'branch', text: t.sections.history }),
      React.createElement(HorizontalTreeView, {
        data: d.versions,
        t: t,
        selected: props.selected,
        onSelectNode: props.onSelectNode
      })),
    React.createElement('div', null,
      React.createElement(H3, { icon: 'doc', text: t.sections.changelog }),
      React.createElement(ChangelogView, { data: d.changelog, t: t })))
}

function Dashboard(props) {
  const [tab, setTab] = React.useState('overview')
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [query, setQuery] = React.useState('')
  const [meta, setMeta] = React.useState(null)
  const [reloadKey, setReloadKey] = React.useState(0)
  const [selected, setSelected] = React.useState(null)
  const [lang, setLang] = React.useState(detectLang)

  const t = T[lang] || T.en

  React.useEffect(function () {
    let alive = true
    host.call('dash_data', { dataset: 'catalog' }).then(function (value) {
      if (!alive) return
      if (value && typeof value.error !== 'string' && Array.isArray(value.datasets)) setMeta(value)
    }).catch(function () { /* catalog is optional */ })
    return function () { alive = false }
  }, [reloadKey])

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

  const switchTab = function (id) {
    setTab(id)
    setQuery('')
    setData(null)
    setError(null)
    setSelected(null)
  }

  const selectNode = function (branch, node) {
    setSelected(function (prev) {
      if (prev && prev.branch === branch && prev.node === node) return null
      return { branch: branch, node: node }
    })
  }

  const tabs = (meta && meta.datasets) ? meta.datasets : TAB_META
  const showSearch = tab === 'evidence' || tab === 'conflicts'

  const body = error
    ? React.createElement('div', { className: 'dsh-err' },
        t.hostError + error,
        React.createElement('button', { className: 'dsh-retry', onClick: function () { setReloadKey(function (k) { return k + 1 }) } }, t.retry))
    : !data
      ? React.createElement(Skeleton)
      : React.createElement('div', { className: 'dsh-fade', key: tab + ':' + reloadKey + ':' + lang },
          tab === 'overview'
            ? React.createElement(OverviewView, { data: data, t: t })
            : tab === 'versions'
              ? React.createElement(VersionsView, { data: data, t: t, selected: selected, onSelectNode: selectNode })
              : React.createElement('div', { className: 'dsh-stack' },
                  showSearch ? React.createElement('div', null,
                    React.createElement('input', { className: 'dsh-input', placeholder: t.filter, value: query, onChange: function (e) { setQuery(e.target.value) } })) : null,
                  tab === 'evidence'
                    ? React.createElement(DecisionsView, { data: data, query: query, t: t })
                    : React.createElement(RejectedView, { data: data, query: query, t: t })))

  const dataDir = meta && meta.data_dir ? String(meta.data_dir).split('/').pop() : null

  return React.createElement('div', { className: 'dsh-wrap' },
    React.createElement('div', { className: 'dsh-header' },
      React.createElement('div', { className: 'dsh-header-row' },
        React.createElement('div', { className: 'dsh-title' }, t.title),
        React.createElement('div', { className: 'dsh-header-actions' },
          React.createElement('button', { className: 'dsh-lang-btn', title: 'Language / 语言', onClick: function () { setLang(lang === 'zh' ? 'en' : 'zh') } }, t.langSwitch),
          React.createElement('button', { className: 'dsh-icon-btn', title: t.refreshTitle, onClick: function () { setReloadKey(function (k) { return k + 1 }) } },
            React.createElement(Icon, { name: 'refresh', size: 13 }),
            t.refresh))),
      React.createElement('div', { className: 'dsh-sub' }, t.subtitle),
      React.createElement('div', { className: 'dsh-chips' },
        dataDir ? React.createElement('span', { className: 'dsh-chip' },
          React.createElement(Icon, { name: 'folder', size: 11 }),
          dataDir) : null,
        React.createElement('span', { className: 'dsh-chip' },
          React.createElement(Icon, { name: 'clock', size: 11 }),
          t.updated))),
    React.createElement(StatCards, { datasets: tabs, active: tab, onSelect: switchTab, t: t }),
    React.createElement('div', { className: 'dsh-tabs' },
      tabs.map(function (tabItem) {
        const icon = TAB_META.find(function (m) { return m.id === tabItem.id })
        return React.createElement('button', {
          key: tabItem.id,
          className: 'dsh-tab' + (tab === tabItem.id ? ' dsh-tab-active' : ''),
          onClick: function () { switchTab(tabItem.id) }
        },
          React.createElement(Icon, { name: icon ? icon.icon : 'grid', size: 12 }),
          t.tabs[tabItem.id] || tabItem.label,
          tabItem.count !== null && tabItem.count !== undefined ? React.createElement('span', { className: 'dsh-badge' }, String(tabItem.count)) : null)
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
