// gen-bundle.cjs — regenerates lib/client.js (the official pre-built
// dsh.client web bundle) from plugin.client.js (the dynamic variant).
//
// The two variants share one UI implementation but differ in runtime glue:
//   dynamic variant  → host.call RPC + tool.view.cordis + settings.section
//   official bundle  → fetch('/api/dash-data') + settings.section only
//
// Usage: node tools/gen-bundle.cjs [version]
//   version defaults to the version field of package.json.

'use strict'

const fs = require('fs')
const path = require('path')

const pluginDir = path.dirname(__dirname)
const pkg = JSON.parse(fs.readFileSync(path.join(pluginDir, 'package.json'), 'utf8'))
const version = process.argv[2] || pkg.version

const src = fs.readFileSync(path.join(pluginDir, 'plugin.client.js'), 'utf8')

const stylesStart = src.indexOf('const STYLES = [')
const returnMarker = "\nreturn {\n  name: 'dsh-evidence-dashboard',\n  apply(ctx) {"
const returnIdx = src.indexOf(returnMarker)
if (stylesStart < 0 || returnIdx < 0) {
  throw new Error('plugin.client.js markers not found (const STYLES / return block)')
}

const middle = src.slice(stylesStart, returnIdx)
const stylesEndMarker = "].join('\\n')"
const stylesEnd = middle.indexOf(stylesEndMarker)
if (stylesEnd < 0) throw new Error('STYLES block end marker not found')

const stylesBlock = middle.slice(0, stylesEnd + stylesEndMarker.length)
let rest = middle.slice(stylesEnd + stylesEndMarker.length)

// Runtime glue rewrites for the official bundle.
rest = rest.split('React.').join('react.')
rest = rest.replace("host.call('dash_data', { dataset: 'catalog' })", "dashData('catalog')")
rest = rest.replace("host.call('dash_data', { dataset: id })", 'dashData(id)')

const bundleHeader = `// dsh-evidence-dashboard — Client half (official web bundle), v${version}.
// Pre-built dsh.client bundle in the window.__ModuleLoader__ factory format.
// Generated from plugin.client.js (dynamic variant) — keep both in sync.
`

// Inserted right after STYLES so the style injection never sees a TDZ.
const helpers = `
    function dashData(dataset) {
      return fetch('/api/dash-data?dataset=' + encodeURIComponent(dataset)).then(function (resp) {
        if (!resp.ok) throw new Error('HTTP ' + resp.status)
        return resp.json()
      })
    }

    if (typeof document !== 'undefined' && document.head && !document.getElementById('dsh-evidence-dashboard-styles')) {
      var styleEl = document.createElement('style');
      styleEl.id = 'dsh-evidence-dashboard-styles';
      styleEl.textContent = STYLES;
      document.head.appendChild(styleEl);
    }
`

const tail = `
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
`

const bundle = `window.__ModuleLoader__.load({
  id: "dsh-evidence-dashboard",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    let react = require("react");

${bundleHeader}${stylesBlock}${helpers}${rest}${tail}
    return module.exports;
  }
})
`

fs.writeFileSync(path.join(pluginDir, 'lib/client.js'), bundle)
console.log('generated lib/client.js (v' + version + ', ' + bundle.length + ' bytes)')
