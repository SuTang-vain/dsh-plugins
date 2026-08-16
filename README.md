# DSH Self-Harness Tools

Two self-contained plugin packages for the **DeepSeek Harness** — installable as
dynamic Cordis plugins.

两个面向 **DeepSeek Harness** 的自包含插件包，可作为动态 Cordis 插件安装。

## Plugins / 插件

| Plugin | Kind | What it does |
|---|---|---|
| [`plugins/prior-probe`](plugins/prior-probe) | Host tools | A frozen probe-battery tool: list batteries, score responses offline with deterministic regexes, or run single-shot probes against any OpenAI-compatible endpoint. |
| [`plugins/evidence-dashboard`](plugins/evidence-dashboard) | Host data + Client UI | An archive dashboard: components, design decisions, rejected options, and a git-tree view of the release history plus a changelog timeline. |

| 插件 | 类型 | 功能 |
|---|---|---|
| [`plugins/prior-probe`](plugins/prior-probe) | Host 工具 | 冻结探针电池工具：列出电池、离线确定性正则评分、或对任意 OpenAI 兼容端点执行单发探测。 |
| [`plugins/evidence-dashboard`](plugins/evidence-dashboard) | Host 数据 + Client UI | 归档仪表盘：组件概览、设计决策、已否决选项、发布历史的 git 树视图与 changelog 时间线。 |

## Install / 安装

Both `plugin.host.js` / `plugin.client.js` files are plain-JavaScript Cordis
function bodies. In a DSH session, paste them into the `code.host` /
`code.client` parameters of `cordis_define`, then `cordis_run`. See each
plugin README for details.

两个插件的 `plugin.host.js` / `plugin.client.js` 都是纯 JavaScript 的 Cordis
函数体。在 DSH 会话中把它们粘贴进 `cordis_define` 的 `code.host` /
`code.client` 参数，然后 `cordis_run`。详见各插件 README。

- `prior-probe` embeds its battery data and needs no path.
- `prior-probe` 内嵌电池数据，无需配置路径。
- `evidence-dashboard` probes a small list of candidate data-directory paths
  and reports the resolved one through its `catalog` dataset.
- `evidence-dashboard` 按候选路径列表探测数据目录，并通过 `catalog` 数据集
  报告实际命中的路径。

## Verify / 自检

```bash
node verify.js
```

Parses every plugin source as a Cordis function body, validates every JSON
dataset, checks the frozen counts, byte-compares the embedded probe batteries
against their `data/` originals, and spot-checks the grader regexes.

校验所有插件源码（按 Cordis 函数体解析）、所有 JSON 数据集、冻结计数、内嵌
探针电池与 `data/` 原件的字节一致性，并抽查评分正则。

## Releasing / 发版

Both plugins are published as DSH bundles on npm (`dsh-prior-probe`,
`dsh-evidence-dashboard`). The full release checklist — version bump, verify,
pack-check, changelog sync, tag, npm publish against the official registry —
lives in [CONTRIBUTING.md](CONTRIBUTING.md).

两个插件均以 DSH 组合包形式发布在 npm（`dsh-prior-probe`、
`dsh-evidence-dashboard`）。完整发版清单——版本号、自检、打包检查、changelog
同步、tag、对官方源执行 npm publish——见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## Versioning / 版本

Releases are tagged on the `main` branch (see [CHANGELOG](CHANGELOG.md) and the
version tree in the dashboard's Versions tab).

发布版本在 `main` 分支上打 tag（见 [CHANGELOG](CHANGELOG.md)，以及仪表盘
Versions 页里的版本树）。

## License / 许可

MIT — see [LICENSE](LICENSE).
