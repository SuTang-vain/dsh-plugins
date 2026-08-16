# dsh-plugin-kit

> 品质保障工具包：为 DSH 插件提供**声明式验证**与**模板驱动的 client bundle 生成**，把"插件仓库怎么质检自己"变成任何 DSH 插件都能直接调用的能力。零依赖，纯 Node.js。

Quality-assurance toolkit for DSH plugin bundles: a declarative verify
runner and a template-driven generator for official `dsh.client` web
bundles. Zero dependencies, plain Node.js.

**Note**: this package is a *development tool for plugin repositories* — it
is not a DSH bundle itself and declares no `dsh.bundle` / `dsh.client`
manifest.

## Why

The DSH plugin model gives bundles a lifecycle (`dsh plugin add`, patch
layers, the `window.__ModuleLoader__` client format) but ships no quality
layer: no way to assert that sources parse, datasets stay consistent, the
dynamic and official variants agree, or the package packs cleanly. Plugin
repositories invent these checks privately.

`dsh-plugin-kit` generalizes them:

- **verify** — read a declarative `dsh-plugin-kit.yml`, run builtin checks
  (parse / json / contains / property / resolves-file / count /
  graph-parents / pack-dry-run), then run repository-specific extensions.
- **gen-bundle** — regenerate the official client bundle from the dynamic
  variant through a documented assembly protocol: cut markers, injected
  helpers, literal replaces, and per-plugin template files.

## Install / run

```sh
npx dsh-plugin-kit verify            # from the repository root
npx dsh-plugin-kit verify --root /path/to/repo
npx dsh-plugin-kit gen-bundle plugins/evidence-dashboard
```

Or keep a thin `verify.js` in the repo (CI-friendly, no install step):

```js
require('./dsh-plugin-kit/lib/runner.cjs').main(__dirname).then(
  (ok) => process.exit(ok ? 0 : 1))
```

## verify

The runner reads `dsh-plugin-kit.yml` from the root directory, executes
every entry of the `verify` list, and then runs every export of
`dsh-plugin-kit.ext.cjs` (optional) with `ctx = { root, config, ok }`.

```yaml
version: 1

verify:
  - parse: plugins/example/plugin.host.js
    mode: function-body          # Cordis function body (new Function)
  - parse: plugins/example/index.js
    mode: node-check             # node --check (ESM/browser entries)
  - json: plugins/example/data/overview.json
  - contains:
      file: plugins/example/cordis.patch.yml
      text: dsh-example
      message: patch layer references the package
  - property:
      file: plugins/example/package.json
      path: dsh.bundle.patch
      type: string
  - property:
      file: plugins/example/package.json
      path: [dsh, client, platform]   # array form for dotted keys
      equals: web
  - resolves-file:
      file: plugins/example/package.json
      path: [exports, ./client]
      base: plugins/example
  - count:
      file: plugins/example/data/versions.json
      path: branches[0].nodes.length
      equals: 13
  - graph-parents:
      file: plugins/example/data/versions.json
      branches: branches
      node-message: version node well-formed
      parent-message: version node parent exists
  - pack-dry-run:
      dir: plugins/example
```

### Builtin checks

| Check | Spec keys | Semantics |
| --- | --- | --- |
| `parse` | `parse` (file), `mode` (`function-body` \| `node-check`) | source parses |
| `json` | `json` (file) | file parses as JSON |
| `contains` | `file`, `text`, optional `not` | literal substring present/absent |
| `file-exists` | `file-exists` (file) | file exists |
| `property` | `file`, `path`, optional `type`, `equals` | JSON path value matches |
| `resolves-file` | `file`, `path`, `base` | string value resolves to an existing file |
| `count` | `file`, `path`, `equals` | JSON path value (or array length) equals N |
| `graph-parents` | `file`, `branches` (path to branch list), `node-message`, `parent-message` | every node is well-formed and its parents exist |
| `pack-dry-run` | `dir` (or shorthand `pack-dry-run: dir`) | `npm pack --dry-run` succeeds |

`path` accepts dot/bracket strings (`branches[0].nodes.length`) or arrays
(`[exports, ./client]`); `.length` works on arrays and strings.

### Extensions

Domain checks that do not fit a primitive go into `dsh-plugin-kit.ext.cjs`:

```js
module.exports = {
  mergeShapes(ctx) {
    const graph = require(path.join(ctx.root, 'data/graph.json'))
    ctx.ok(graph.head === 'v1.0.0', 'graph head is v1.0.0')
  }
}
```

## gen-bundle

Regenerates the official `dsh.client` web bundle from the dynamic client
variant, following the `bundle` section of the plugin's own
`dsh-plugin-kit.yml`:

```yaml
bundle:
  name: dsh-example                 # {{name}}
  id: dsh-example                   # {{id}} (bundle id / style element id)
  from: plugin.client.js            # dynamic variant (source)
  to: lib/client.js                 # generated bundle (output)
  version-source: package.json      # version for {{version}} (or pass as argv)
  cut-before: "const STYLES = ["    # keep the section starting here
  inject-after: "].join('\\n')"     # helpers injected right after this marker
  cut-after: "\nreturn {\n..."      # dynamic return block starts here (dropped)
  replace:                          # literal [from, to] pairs on the tail section
    - [React., react.]
  templates:                        # assembly fragments, {{var}} placeholders
    wrapper-head: tools/bundle/wrapper-head.txt
    header: tools/bundle/header.txt
    helpers: tools/bundle/helpers.txt
    tail: tools/bundle/tail.txt
    wrapper-tail: tools/bundle/wrapper-tail.txt
```

Assembly:

```
wrapper-head + header
+ <from-file: cut-before .. inject-after>   (e.g. the STYLES block)
+ helpers
+ <from-file: inject-after .. cut-after>    (with replace applied)
+ tail + wrapper-tail
```

The wrapper templates are where the `window.__ModuleLoader__.load({ ... })`
factory format lives; per-plugin glue (RPC → `fetch`, slot registration,
style injection) lives in `helpers.txt` / `tail.txt`.

## Config format notes

The YAML subset parser supports block maps, lists, quoted scalars
(double-quoted with `\\ \" \' \n \t` escapes), flow lists `[a, b]`,
full-line comments and trailing ` #` comments. Indentation is **2 spaces per
level** (tabs rejected). Anything fancier (anchors, block scalars, flow
maps) is rejected with a line number.

## Field-tested distribution formats

The kit has been exercised against third-party repositories covering the
three distribution shapes seen in the wild:

1. **npm bundle** (`dsh.bundle.patch` + `cordis.patch.yml` with `- insert:`) —
   the classic format (this repository's own plugins). Recipe:

   ```yaml
   - property: { file: package.json, path: dsh.bundle.patch, type: string }
   - file-exists: cordis.patch.yml
   - contains: { file: cordis.patch.yml, text: <package-name> }
   ```

2. **repository-plugin** (`.dsh-plugin/package.json` with `dsh.entry`) — the
   official `.dsh-plugin` format; the package lives in a subdirectory, and
   the kit's config paths simply point there:

   ```yaml
   - property: { file: .dsh-plugin/package.json, path: dsh.entry, type: string }
   - parse: { file: .dsh-plugin/index.mjs, mode: node-check }
   ```

3. **profile snippet** (no `dsh` field; a `cordis.example.yml` fragment the
   user pastes into their profile) — verify what exists: manifest JSON, the
   snippet referencing the package, and the entry sources.

Notes from the field:

- `pack-dry-run` runs npm lifecycle scripts (`prepack`), which need
  dependencies installed — on a cold checkout pass `args: [--ignore-scripts]`
  or install first. (This repository's packages have no build step, so the
  behavior never showed up here.)
- `parse` / `json` / `file-exists` accept both the shorthand
  (`- json: x.json`) and the object form (`- json: { file: x.json }`).
- `node-check` runs Node's parser; modern Node (22.18+) type-strips `.ts`
  entries for syntax checking (types are not checked — pair it with a
  `tsc --noEmit` script for that).

## Status & roadmap

Pre-1.0, iterating as an independent ecosystem package. Current shape:
`verify` (9 builtin checks + extensions), `gen-bundle` (assembly protocol),
a zero-dependency YAML-subset parser, and a self-test suite
(`npm test` — parser, walker, generator round-trip, runner end-to-end).

Before 1.0: real-world usage feedback, a conformance note pinning the YAML
subset (the parser rejects anything outside it loudly, so the subset is
enforceable today), and possibly a `dsh-plugin-kit init` scaffold for new
plugin repositories.

## Relationship to upstream `dsh`

The official CLI's `dsh plugin` command forwards its arguments to pnpm (it
manages profile dependencies and reconciles bundle layers); it exposes no
verification hook, and `@deepseek-ai/dsh` currently does not accept external
pull requests. This package therefore ships its own `dsh-plugin-kit` binary
instead of a `dsh plugin verify` subcommand — the ecosystem route the
official CONTRIBUTING invites.

If upstream ever adopts a verify command, the port is small and was kept in
mind: upstream already depends on `js-yaml`, so the config could be parsed
natively there; the check vocabulary (`parse` / `json` / `count` /
`graph-parents` / …) and this repository's `dsh-plugin-kit.yml` files would
map over as-is. The YAML subset spec doubles as the interoperability
baseline between the two parsers.

## License

MIT — see the repository `LICENSE`.
