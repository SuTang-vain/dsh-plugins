# Changelog

All notable changes to the DSH plugin suite.

## v1.6 (2026-08-16)

- **evidence-dashboard "Release Cockpit"**: KPI stat cards (click to switch
  tabs), pill navigation, skeleton loading and fade transitions, a header
  with data-source chip and refresh, an interactive git-tree (click a node
  for its detail card, collapse branches, kind legend, hover tooltips),
  filter chips on the Decisions and Rejected options tabs, expandable
  changelog blocks, and empty states.
- **visual refresh**: emojis replaced with monochrome inline SVG icons
  (`currentColor` stroke, no external assets) for a cleaner look.
- `data/versions.json` extended with the v1.5.0 / v1.5.1 / v1.6.0-rc / v1.6.0
  nodes (the v1.6 merge renders the fork/merge lanes in the tree);
  `verify.js` checks the 11-node graph and the v1.6.0 merge shape.

## v1.5.1 (2026-08-16)

- repository renamed to **dsh-self-harness-tools** (npm package names
  unchanged); dashboard titles, version-tree label, overview title, and
  README install paths now use the new suite name.

## v1.5 (2026-08-16)

- **prior-probe**: now an official DSH **bundle** — `package.json` declares
  `dsh.bundle`, `cordis.patch.yml` carries the layer, and `index.js` is the
  ESM entry registering tools through `ctx.tools` / `defineTool`. Verified
  end-to-end with `dsh plugin add ./dsh-prior-probe-1.5.0.tgz` +
  `--dump-config` in a scratch profile. Install from GitHub, tarball, or npm.
  The session-scoped dynamic variant (`plugin.host.js`) stays available.
- **evidence-dashboard**: now an official **bundle + web client package** —
  host half serves the archive over an exact `/api/dash-data` route; the
  browser half ships as a pre-built `dsh.client` bundle
  (`exports["./client"]` → `lib/client.js`, `window.__ModuleLoader__` factory
  format) registering a **Settings → DSH Evidence** section. Verified with a
  tarball install + `--dump-config` and a simulated browser factory load.
- repo now carries the `dsh-plugin` / `deepseek-harness` topics for ecosystem
  discoverability.
- **published to npm**: `dsh-prior-probe@1.5.0` and
  `dsh-evidence-dashboard@1.5.0` are live on the public registry — install
  with `dsh plugin add dsh-prior-probe` / `dsh plugin add
  dsh-evidence-dashboard`.

## v1.4 (2026-08-15)

- **evidence-dashboard visual upgrade (git-tree)**: graph lines use the
  stronger border token; nodes are larger with a background ring; kind labels
  render as color-coded pills; node rows highlight on hover; branch cards
  carry an accent bar.

## v1.3.1 (2026-08-15)

- **evidence-dashboard bugfix**: switching tabs crashed the panel because the
  render after a tab click still carried the previous tab's dataset. Tab
  clicks now clear data synchronously, and every view guards its data shape.

## v1.3 (2026-08-15)

- **evidence-dashboard**: lane-based git-graph for the Versions tab — real
  fork lines and merge lines with connector rows; `data/versions.json` moved
  to an explicit `parents`-array schema (version-graph v1).

## v1.2 (2026-08-15)

- **evidence-dashboard**: new Versions tab — the repository release history
  rendered as a version tree, with the changelog timeline below it.

## v1.1 (2026-08-15)

- **prior-probe**: `prior_probe_run` gains an optional `api_key_file` argument
  so bearer keys stay out of the session log.
- **evidence-dashboard**: portable data directory (candidate probing),
  file-backed overview dataset, tab count badges, retry button, search on the
  list tabs, theme-token borders.
- **packaging**: `.gitignore`, GitHub Actions workflow running `verify.js`,
  and this changelog.

## v1.0 (2026-08-15)

Initial release: `prior-probe` (frozen probe-battery tools) and
`evidence-dashboard` (archive dashboard), with bundled datasets, READMEs, and
a self-check script.
