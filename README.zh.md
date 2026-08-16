<p align="center">
  <a href="https://github.com/SuTang-vain/dsh-self-harness-tools"><img src="https://img.shields.io/github/stars/SuTang-vain/dsh-self-harness-tools?style=flat&label=%E2%98%85&color=08C" alt="GitHub stars"></a>
  <a href="https://www.npmjs.com/package/dsh-prior-probe"><img src="https://img.shields.io/npm/v/dsh-prior-probe?style=flat&label=npm%20prior-probe&color=CB3837" alt="dsh-prior-probe on npm"></a>
  <a href="https://www.npmjs.com/package/dsh-evidence-dashboard"><img src="https://img.shields.io/npm/v/dsh-evidence-dashboard?style=flat&label=npm%20dashboard&color=CB3837" alt="dsh-evidence-dashboard on npm"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-2EA44F?style=flat" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/topic-dsh--plugin-4D6BFE?style=flat" alt="dsh-plugin topic">
  <img src="https://img.shields.io/badge/platform-DeepSeek%20Harness-4D6BFE?style=flat" alt="DeepSeek Harness">
  <img src="https://img.shields.io/badge/runtime-Node.js%20%7C%20Web%20GUI-4493F8?style=flat" alt="Runtime: Node.js and Web GUI">
</p>

<h3 align="center">面向 DeepSeek Harness 生态的 self-harness 工具集</h3>

<p align="center"><sub>中文 · <a href="README.md">English</a></sub></p>

<p align="center"><b>两个可安装的 DSH 组合包，测量并检视你自己的 harness：</b><br>
一个是模型先验知识探针电池，一个是发布历史归档仪表盘。</p>

## 为什么

DeepSeek Harness 采用 *「一切都是插件」* 的架构。本仓库基于官方
[Cordis](https://github.com/cordiverse/cordis) 插件模型发布两个组合包，
支持 `dsh plugin add` 安装，并在 npm 上分发：

- **`dsh-prior-probe`** — 冻结探针电池工具。测量模型仅凭先验知识能给出多少
  预期答案（无 harness、单发补全，用确定性 grader 等价正则评分）。
- **`dsh-evidence-dashboard`** — 项目归档仪表盘：组件概览、设计决策、已否决
  选项，以及带 changelog 时间线的发布历史 git 树。

## 特性

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>prior-probe <a href="https://www.npmjs.com/package/dsh-prior-probe"><img src="https://img.shields.io/npm/v/dsh-prior-probe?style=flat-square&color=CB3837" alt="npm"></a></h3>
      <p>Host 插件，含三个模型工具：<code>prior_probe_list</code>（列出内嵌电池）、<code>prior_probe_score</code>（离线确定性评分）、<code>prior_probe_run</code>（对任意 OpenAI 兼容端点执行无 harness 单发探测）。电池冻结并内嵌；<code>api_key_file</code> 让密钥不进会话日志。</p>
    </td>
    <td width="50%" valign="top">
      <h3>evidence-dashboard <a href="https://www.npmjs.com/package/dsh-evidence-dashboard"><img src="https://img.shields.io/npm/v/dsh-evidence-dashboard?style=flat-square&color=CB3837" alt="npm"></a></h3>
      <p>一个包携带两半：host 通过 <code>/api/dash-data</code> 提供归档数据，浏览器半注册 <b>设置 → DSH Evidence</b> 面板。标签页：Overview、Decisions、Rejected options，以及带分叉/合并泳道的 Versions git 树与 changelog 时间线。</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>官方组合包格式</h3>
      <p>每个插件都是声明 <code>dsh.bundle</code>（patch 层 + ESM 入口）的 npm 包；dashboard 额外声明 <code>dsh.client</code>，携带预构建的 <code>window.__ModuleLoader__</code> bundle。GitHub / tarball / npm 三种安装渠道，无需构建步骤。</p>
    </td>
    <td width="50%" valign="top">
      <h3>可验证设计</h3>
      <p><code>node verify.js</code> 解析全部源码、校验每个 JSON 数据集、对内嵌电池做字节比对、抽查评分正则——并已接入 CI，每次推送自动执行。</p>
    </td>
  </tr>
</table>

## 快速开始

用最短的官方渠道把两个插件装进 profile：

```sh
dsh plugin --profile demo add dsh-prior-probe
dsh plugin --profile demo add dsh-evidence-dashboard

dsh --profile demo --dump-config   # 验证 "# == dsh-prior-probe" 层
dsh web --profile demo             # 打开 设置 → DSH Evidence
```

其他渠道：GitHub（`dsh plugin add github:SuTang-vain/dsh-self-harness-tools#path:plugins/prior-probe`）
或打包好的 tarball。详见各插件 README。

## 文档

| 目标 | 入口 |
| --- | --- |
| 安装与使用探针电池工具 | [`plugins/prior-probe/README.md`](plugins/prior-probe/README.md) |
| 安装与使用归档仪表盘 | [`plugins/evidence-dashboard/README.md`](plugins/evidence-dashboard/README.md) |
| 仓库自检 | `node verify.js` |
| 发版清单（版本号 → npm 发布） | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| 各版本变更记录 | [`CHANGELOG.md`](CHANGELOG.md) |
| 在仪表盘中查看版本树 | Versions 页（v1.0 → v1.5.1） |

## 与官方项目的关系

本仓库构建于 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
与 [Cordis](https://github.com/cordiverse/cordis) 插件模型之上。

官方项目提供核心 Agent 能力、插件系统与 Web UI。本仓库主要提供：

- 两个可复用、可安装的官方 `dsh plugin` 流程组合包
- 构建任务套件前测量模型先验的工具
- 带版本树的项目历史归档仪表盘
- 携带 `dsh.bundle` / `dsh.client` manifest 的 npm 分发

若你想为 Harness 核心本身做贡献，请优先参考官方仓库。

## 社区

- DeepSeek Harness 官方：[GitHub Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions) · [Discord](https://discord.gg/Ycq5dCaS4)
- 本仓库：欢迎在 GitHub 上提 issue 与 pull request。

## 许可

本项目基于 [MIT License](LICENSE) 发布。

> 基于 DeepSeek Harness 构建的社区工具，并非 DeepSeek 官方产品。
