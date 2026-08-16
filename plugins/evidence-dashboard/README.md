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

### Official bundle install (recommended) / 官方组合包安装（推荐）

One package carries both halves: `package.json` declares `dsh.bundle` (host
layer in `cordis.patch.yml`, entry `index.js` serving the data API at
`/api/dash-data`) and `dsh.client` (`exports["./client"]` → the pre-built
`lib/client.js` bundle). Install into a profile with any of the three
official channels:

一个包携带两半：`package.json` 声明 `dsh.bundle`（host 层在
`cordis.patch.yml`，入口 `index.js` 在 `/api/dash-data` 提供数据 API）与
`dsh.client`（`exports["./client"]` → 预构建的 `lib/client.js`）。三种官方
渠道任选其一安装进 profile：

```sh
# 1. from GitHub (the client bundle is pre-built; no build step needed)
dsh plugin --profile demo add github:SuTang-vain/dsh-plugins#path:plugins/evidence-dashboard

# 2. from a packed tarball
dsh plugin --profile demo add ./dsh-evidence-dashboard-1.5.0.tgz

# 3. from npm
dsh plugin --profile demo add dsh-evidence-dashboard
```

Then start a web profile that lists this bundle and open
**Settings → DSH Evidence**:

启动列出此 bundle 的 web profile，然后打开 **设置 → DSH Evidence**：

```sh
dsh --profile demo --dump-config   # shows the "# == dsh-evidence-dashboard" layer
dsh web --profile demo             # the dashboard registers its settings section
```

### Dynamic variant / 动态插件变体

`plugin.host.js` + `plugin.client.js` are the same dashboard as **dynamic**
plugin bodies (session-scoped, two UI seats including the run card). Paste
them into `code.host` / `code.client` of one `cordis_define` call, then
`cordis_run`. Prefer the bundle for anything persistent.

`plugin.host.js` + `plugin.client.js` 是同一仪表盘的**动态**插件函数体（会话级，
含运行卡片在内的两个 UI 座位）。把它们粘贴进同一次 `cordis_define` 的
`code.host` / `code.client`，然后 `cordis_run`。需要持久安装请用上面的 bundle。

All data crosses the wire as lossless JSON; nothing live is read — the host
only parses the files listed above.

所有数据以无损 JSON 传输；不读取任何运行时状态——host 只解析上面列出的文件。
