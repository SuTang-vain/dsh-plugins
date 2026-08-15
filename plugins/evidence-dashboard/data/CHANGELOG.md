# Changelog

All notable changes to the DSH plugin suite.

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
