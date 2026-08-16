<p align="center">
  <a href="https://github.com/SuTang-vain/dsh-self-harness-tools"><img src="https://img.shields.io/github/stars/SuTang-vain/dsh-self-harness-tools?style=flat&label=%E2%98%85&color=08C" alt="GitHub stars"></a>
  <a href="https://www.npmjs.com/package/dsh-prior-probe"><img src="https://img.shields.io/npm/v/dsh-prior-probe?style=flat&label=npm%20prior-probe&color=CB3837" alt="dsh-prior-probe on npm"></a>
  <a href="https://www.npmjs.com/package/dsh-evidence-dashboard"><img src="https://img.shields.io/npm/v/dsh-evidence-dashboard?style=flat&label=npm%20dashboard&color=CB3837" alt="dsh-evidence-dashboard on npm"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-2EA44F?style=flat" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/topic-dsh--plugin-4D6BFE?style=flat" alt="dsh-plugin topic">
  <img src="https://img.shields.io/badge/platform-DeepSeek%20Harness-4D6BFE?style=flat" alt="DeepSeek Harness">
  <img src="https://img.shields.io/badge/runtime-Node.js%20%7C%20Web%20GUI-4493F8?style=flat" alt="Runtime: Node.js and Web GUI">
</p>

<h3 align="center">Self-harness tooling for the DeepSeek Harness ecosystem</h3>

<p align="center"><sub><a href="README.zh.md">中文</a> · English</sub></p>

<p align="center"><b>Two installable DSH bundles that measure and inspect your own harness:</b><br>
a probe battery for model priors, and an archive dashboard for release history.</p>

## Why

DeepSeek Harness follows an *"everything is a plugin"* architecture. This
repository ships two bundles built on the official [Cordis](https://github.com/cordiverse/cordis)
plugin model, installable with `dsh plugin add` and distributed on npm:

- **`dsh-prior-probe`** — frozen probe-battery tooling. It measures how much
  of an expected answer a model can produce from prior knowledge alone
  (no-harness, single-shot completions scored with deterministic
  grader-equivalent regexes).
- **`dsh-evidence-dashboard`** — an archive dashboard for your project:
  components, design decisions, rejected options, and a git-tree of the
  release history with a changelog timeline.

## Features

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>prior-probe <a href="https://www.npmjs.com/package/dsh-prior-probe"><img src="https://img.shields.io/npm/v/dsh-prior-probe?style=flat-square&color=CB3837" alt="npm"></a></h3>
      <p>Host plugin with three model tools: <code>prior_probe_list</code> (bundled batteries), <code>prior_probe_score</code> (offline deterministic scoring), and <code>prior_probe_run</code> (no-harness single-shot probing against any OpenAI-compatible endpoint). Batteries are frozen and embedded; <code>api_key_file</code> keeps keys out of session logs.</p>
    </td>
    <td width="50%" valign="top">
      <h3>evidence-dashboard <a href="https://www.npmjs.com/package/dsh-evidence-dashboard"><img src="https://img.shields.io/npm/v/dsh-evidence-dashboard?style=flat-square&color=CB3837" alt="npm"></a></h3>
      <p>One package with both halves: the host serves the archive over <code>/api/dash-data</code>, the browser half registers a <b>Settings → DSH Evidence</b> section. Tabs: Overview, Decisions, Rejected options, and a Versions git-tree with fork/merge lanes plus a changelog timeline.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>Official bundles</h3>
      <p>Each plugin is an npm package declaring <code>dsh.bundle</code> (patch layer + ESM entry); the dashboard additionally declares <code>dsh.client</code> with a pre-built <code>window.__ModuleLoader__</code> bundle. Install from GitHub, tarball, or npm — no build step required.</p>
    </td>
    <td width="50%" valign="top">
      <h3>Verifiable by design</h3>
      <p><code>node verify.js</code> parses every source, validates every JSON dataset, byte-checks embedded batteries against their originals, and spot-checks the grader regexes — wired into CI on every push.</p>
    </td>
  </tr>
</table>

## Quick start

Install both plugins into a profile with the shortest official channel:

```sh
dsh plugin --profile demo add dsh-prior-probe
dsh plugin --profile demo add dsh-evidence-dashboard

dsh --profile demo --dump-config   # verify the "# == dsh-prior-probe" layer
dsh web --profile demo             # open Settings → DSH Evidence
```

Alternatives: from GitHub
(`dsh plugin add github:SuTang-vain/dsh-self-harness-tools#path:plugins/prior-probe`),
or from a packed tarball. See each plugin README for details.

## Documentation

| Goal | Entry point |
| --- | --- |
| Install and use the probe-battery tools | [`plugins/prior-probe/README.md`](plugins/prior-probe/README.md) |
| Install and use the archive dashboard | [`plugins/evidence-dashboard/README.md`](plugins/evidence-dashboard/README.md) |
| Self-check the repository | `node verify.js` |
| Release checklist (version bump → npm publish) | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| What changed in each release | [`CHANGELOG.md`](CHANGELOG.md) |
| See the version tree rendered in the dashboard | Versions tab (v1.0 → v1.5.1) |

## Relationship to the Official Project

This repository is built on [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
and the [Cordis](https://github.com/cordiverse/cordis) plugin model.

The official project provides the core agent capabilities, the plugin system,
and the Web UI. This repository primarily provides:

- Two reusable, installable bundles for the official `dsh plugin` flow
- Tooling to measure model priors before building a task suite
- An archive dashboard with a version tree for project history
- npm distribution with `dsh.bundle` / `dsh.client` manifests

If you prefer to contribute to the Harness core itself, refer to the official
repository first.

## Community

- Official DeepSeek Harness: [GitHub Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions) · [Discord](https://discord.gg/Ycq5dCaS4)
- This repository: report issues and open pull requests on GitHub.

## License

This project is licensed under the [MIT License](LICENSE).

> Community tooling built on DeepSeek Harness. It is not an official DeepSeek
> product.
