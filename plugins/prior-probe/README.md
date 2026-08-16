# dsh-prior-probe

A frozen probe-battery tool for the DeepSeek Harness, packaged as a
self-contained **Host plugin** that registers three model tools.

冻结探针电池工具（DeepSeek Harness 用），打包为自包含 **Host 插件**，注册三个模型工具。

## What it does / 功能

For a frozen battery of questions, the tool measures how much of the expected
answer a model can produce from prior knowledge alone — a no-harness,
single-shot completion scored with deterministic grader-equivalent regexes.

对一套冻结的问题电池，测量模型仅凭先验知识能给出多少预期答案——无 harness、
单发补全 + 确定性正则评分。

| Tool / 工具 | Purpose / 用途 |
|---|---|
| `prior_probe_list` | List the bundled frozen batteries (8 general probes, 6 MCP TypeScript SDK probes). |
| `prior_probe_score` | Deterministic, offline regex scoring of response texts — audit the scoring or hand-score answers. |
| `prior_probe_run` | Run a battery as no-harness single-shot completions (temperature 0, no tools, no system prompt) against any OpenAI-compatible `/chat/completions` endpoint. |

| 工具 | 用途 |
|---|---|
| `prior_probe_list` | 列出内嵌冻结电池（8 条通用探针、6 条 MCP TypeScript SDK 探针）。 |
| `prior_probe_score` | 离线确定性正则评分——审计评分逻辑或手工评分。 |
| `prior_probe_run` | 以无 harness 单发方式（温度 0、无工具、无系统提示）对任意 OpenAI 兼容端点跑一套电池。 |

`prior_probe_run` requires an endpoint and model id; the Bearer key comes
from `api_key` (recorded in the session log — use a disposable key) or from
`api_key_file` (the file's first line, keeping the key out of the log). It
calls the model through the host `web` service; in a DSH runtime without a
registered web fetch provider the tool reports `transport_error` per probe
instead of crashing.

`prior_probe_run` 需要端点与模型 id；Bearer 密钥来自 `api_key`（会记录进会话
日志——请用一次性密钥）或 `api_key_file`（文件首行，密钥不进日志）。它通过
host 的 `web` 服务调用模型；在没有注册 web fetch provider 的 DSH 运行时，
工具会按探针返回 `transport_error` 而不会崩溃。

## Install / 安装

### Official bundle install (recommended) / 官方组合包安装（推荐）

The plugin ships as an official DSH **bundle** (`package.json` declares
`dsh.bundle`; the layer lives in `cordis.patch.yml`; the entry is
`index.js`). Install it into a profile with any of the three official
channels:

插件以官方 DSH **组合包**形式发布（`package.json` 声明 `dsh.bundle`，层定义在
`cordis.patch.yml`，入口为 `index.js`）。三种官方渠道任选其一安装进 profile：

```sh
# 1. from GitHub (source, plain JS — no build step needed)
dsh plugin --profile demo add github:SuTang-vain/dsh-self-harness-tools#path:plugins/prior-probe

# 2. from a packed tarball (no network)
dsh plugin --profile demo add ./dsh-prior-probe-1.5.0.tgz

# 3. from npm
dsh plugin --profile demo add dsh-prior-probe
```

Then verify the layer and start:

验证层并启动：

```sh
dsh --profile demo --dump-config   # shows the "# == dsh-prior-probe" layer
dsh --profile demo                 # or dsh --profile demo "run a probe battery"
```

### Dynamic variant / 动态插件变体

`plugin.host.js` is the same instrument as a **dynamic** plugin body. In a
DSH session, paste the whole file into the `code.host` parameter of a
`cordis_define` call (new Plugin, any 3–6 letter id prefix), then
`cordis_run` the returned packageId. Note: dynamic plugins are session-scoped
and do not survive a process restart — prefer the bundle for anything
persistent.

`plugin.host.js` 是同一工具的**动态**插件函数体。在 DSH 会话中把整个文件粘贴进
`cordis_define` 的 `code.host` 参数（新插件，任意 3–6 字母 id 前缀），然后对
返回的 packageId 执行 `cordis_run`。注意：动态插件是会话级的，进程重启后失效——
需要持久安装请用上面的 bundle 方式。

There is no client half, no external dependency, and no runtime data read —
both batteries are embedded, so the plugin works with the `data/` directory
deleted; those files ship only for provenance audit (`node verify.js`
byte-checks the embedded copies against them).

无 client 半部分、无外部依赖、无运行时数据读取——两套电池均内嵌，删除 `data/`
目录插件也能工作；这些文件仅用于溯源审计（`node verify.js` 会做字节比对）。

## Bundled data / 内置数据

| File | Content |
|---|---|
| `data/prior-guessability-probes-v1.json` | 8 general probes (frozen 2026-08-14) |
| `data/prior-guessability-probes-ts-mcp-v1.json` | 6 MCP TypeScript SDK probes (frozen 2026-08-14) |

Batteries are frozen before use: do not edit a pattern without a recorded
reason — the tooling is only meaningful against the frozen regexes.

电池冻结后使用：没有记录理由不要修改正则——工具只有针对冻结正则才有意义。

## Example output / 示例输出

`data/example-score-run.json` is a deterministic offline demo produced by the
**shipped scoring code** (no model calls; the responses are synthetic). It
shows the exact output shape of `prior_probe_score`:

| Field | Demo value |
|---|---|
| battery / frozen_at / stale_after | `dsh-v1` / `2026-08-14` / `2026-11-14` |
| scored | 5/8 |
| G | 0.8 |
| flags | 3 low-direction probes matched → flagged "above expected (prior-covered?)" |

The demo input deliberately mixes matching and non-matching answers so both
the pass logic and the low-direction flag logic are visible. For a live run
against a real endpoint, call `prior_probe_run` with your own
`base_url`/`model`/`api_key_file`.

`data/example-score-run.json` 是确定性离线演示，由**随包发布的评分代码**生成
（无模型调用；回答为合成样例），展示 `prior_probe_score` 的精确输出形态：
`dsh-v1` 电池 5/8 计分、G=0.8，并演示了低方向探针命中时的
"above expected (prior-covered?)" 告警。对真实端点做实测请用
`prior_probe_run` 并传入你自己的 `base_url`/`model`/`api_key_file`。
