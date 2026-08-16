# dsh-plugin-kit field test

Third-party evidence for the kit's generality claim: `dsh-plugin-kit verify`
run against three community DSH plugin repositories with three different
distribution shapes. Each repository was shallow-cloned and given a minimal
`dsh-plugin-kit.yml` written only from its public structure — no source
changes.

## Samples

| Repository | Distribution shape | Key characteristics |
|---|---|---|
| `omdsh-dev/dsh-session-health` | npm bundle (classic) | `dsh.bundle.patch` + `cordis.patch.yml` (`- insert:`); TypeScript source with committed build output; `prepack` build script |
| `coppynight/dsh-doctor` | repository-plugin | package in `.dsh-plugin/` with `dsh.entry`; no `cordis.patch.yml` at the root |
| `lhh010/dsh-bash-encoding` | profile snippet | no `dsh` manifest field; `cordis.example.yml` fragment; source-only (TypeScript) |

## Results

| Repository | Checks | Result |
|---|---|---|
| `dsh-session-health` | 7 | 6 passed; the default `pack-dry-run` failed on the cold-checkout `prepack` (dependencies not installed) and passed with `args: [--ignore-scripts]` |
| `dsh-doctor` | 5 | 5 passed |
| `dsh-bash-encoding` | 3 | 3 passed |

14/15 checks green across all three foreign shapes; the single failure was
environmental (missing dependencies on a fresh clone), not a kit defect, and
is now covered by the `args` option.

## Fixes the field test produced

- `parse` / `json` / `file-exists` now accept both the shorthand
  (`- json: x.json`) and the object form (`- json: { file: x.json }`) —
  the object form silently failed before this test.
- `pack-dry-run` accepts `args` (e.g. `[--ignore-scripts]`) for packages
  whose lifecycle scripts need dependencies.

## Notes

- The `.dsh-plugin` repository-plugin format works through config path
  mapping alone (`file: .dsh-plugin/package.json`); no code changes needed.
- Modern Node (22.18+) type-strips `.ts` entries, so `node-check` performs
  syntax checking for TypeScript entry files (types are not checked).
- Recipes for all three shapes live in
  [`dsh-plugin-kit/README.md`](../dsh-plugin-kit/README.md).
