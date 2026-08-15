# dsh-evidence-dashboard

An archive dashboard for the DSH plugin suite. Host half serves the datasets
over Package-private RPC; Client half renders them with React.

DSH 插件套件的归档仪表盘。Host 半部分通过包私有 RPC 提供数据集；Client 半部分用 React 渲染。

## Datasets (tabs) / 数据集（标签页）

| Tab | Source file | Content |
|---|---|---|
| Overview | `data/overview.json` | Components, release highlights, runtime notes, design principles, compatibility |
| Decisions | `data/evidence-map-v2.json` | Design decisions with rationale and trade-offs |
| Rejected options | `data/attention-conflict-matrix-v2.json` | Options that were considered and rejected, with reasons |
| Versions | `data/versions.json` + `CHANGELOG.md` | Git-tree of the repository release history plus the changelog timeline |

| 标签页 | 数据文件 | 内容 |
|---|---|---|
| Overview | `data/overview.json` | 组件、发布亮点、运行时说明、设计原则、兼容性 |
| Decisions | `data/evidence-map-v2.json` | 设计决策及其理由与取舍 |
| Rejected options | `data/attention-conflict-matrix-v2.json` | 曾考虑后被否决的选项及原因 |
| Versions | `data/versions.json` + `CHANGELOG.md` | 仓库发布历史的 git 树 + changelog 时间线 |

## Install / 安装

The package has both halves: `plugin.host.js` → `code.host` and
`plugin.client.js` → `code.client` of one `cordis_define` call.

1. **Data directory.** The host probes `DATA_DIR_CANDIDATES` in order (first
   existing directory wins) and reports the resolved path through the
   `catalog` dataset. Edit the candidate list at the top of `plugin.host.js`
   if your copy of `data/` lives elsewhere.
2. Define and run. The client half registers two additive UI seats:
   - inside the latest `cordis_run` card (run the plugin → the dashboard
     renders right in the conversation flow), and
   - a persistent **Settings → DSH Evidence** section.
3. Activating a client half requires one approval in the UI.

此包有两半：`plugin.host.js` → `code.host`，`plugin.client.js` → `code.client`，
放进同一次 `cordis_define` 调用。

1. **数据目录。** Host 按 `DATA_DIR_CANDIDATES` 顺序探测（先命中者胜出），并
   通过 `catalog` 数据集报告实际路径；若你的 `data/` 在别处，编辑
   `plugin.host.js` 顶部的候选列表。
2. 定义并运行。Client 半部分注册两个增量 UI 座位：
   - 最新的 `cordis_run` 卡片内（运行插件 → 仪表盘直接出现在对话流里）；
   - 常驻的 **设置 → DSH Evidence** 入口。
3. 激活 client 半部分需要在 UI 中审批一次。

All data crosses the wire as lossless JSON; nothing live is read — the host
only parses the files listed above.

所有数据以无损 JSON 传输；不读取任何运行时状态——host 只解析上面列出的文件。
