# Contributing / 贡献与发版

This repository ships two installable DeepSeek Harness plugins. Each plugin
directory is one **bundle package**: the `package.json` declares `dsh.bundle`
(host layer in `cordis.patch.yml`, entry `index.js`) and, for the dashboard,
`dsh.client` (pre-built browser bundle at `lib/client.js` in the
`window.__ModuleLoader__` factory format). The `plugin.host.js` /
`plugin.client.js` files are the session-scoped **dynamic** variants of the
same code.

本仓库发布两个可安装的 DeepSeek Harness 插件。每个插件目录是一个**组合包**：
`package.json` 声明 `dsh.bundle`（host 层在 `cordis.patch.yml`，入口
`index.js`）；dashboard 还声明 `dsh.client`（预构建的浏览器 bundle
`lib/client.js`，`window.__ModuleLoader__` 工厂格式）。`plugin.host.js` /
`plugin.client.js` 是同一代码的会话级**动态**变体。

## Development loop / 开发循环

```bash
node verify.js        # parse + JSON + counts + byte-equality + regex spot checks
```

- Edit data under `plugins/*/data/` — the dashboard reads them at runtime, and
  `verify.js` checks the counts and the probe batteries byte-for-byte.
- `dsh-prior-probe` embeds its batteries: after editing the batteries, keep
  `index.js` (bundle) and `plugin.host.js` (dynamic) in sync — `verify.js`
  byte-checks `plugin.host.js` against `data/`; check `index.js` too.
- The dashboard client bundle `lib/client.js` is **pre-built by hand**: there
  is no build step. Edit it directly, then run
  `node --check plugins/evidence-dashboard/lib/client.js`.

## Local install test / 本地安装测试

```sh
cd plugins/prior-probe && pnpm pack          # produces dsh-prior-probe-<ver>.tgz
dsh plugin --profile demo add ./dsh-prior-probe-<ver>.tgz
dsh --profile demo --dump-config             # expect the "# == dsh-prior-probe" layer
# clean up: dsh plugin --profile demo remove dsh-prior-probe; rm *.tgz
```

Use a scratch `DSH_HOME=/tmp/dsh-publish-test-home` for isolated tests.
The `link:` install path does not resolve dependencies — always test the
**tarball** (or npm/git) channel.

## Releasing / 发版

1. **Bump versions in lockstep** — both plugin `package.json` files carry the
   same version as the git tag:

   ```sh
   # edit plugins/prior-probe/package.json and
   #      plugins/evidence-dashboard/package.json  -> "version": "X.Y.Z"
   ```

2. **Verify and pack-check**:

   ```sh
   node verify.js
   cd plugins/prior-probe && pnpm pack && rm dsh-prior-probe-*.tgz && cd ../..
   cd plugins/evidence-dashboard && pnpm pack && rm dsh-evidence-dashboard-*.tgz && cd ../..
   ```

3. **Update the changelog** (`CHANGELOG.md`), then re-sync the bundled
   snapshot:

   ```sh
   cp CHANGELOG.md plugins/evidence-dashboard/data/CHANGELOG.md
   ```

4. **Commit, tag, push**:

   ```sh
   git add -A && git commit -m "vX.Y.Z: <summary>"
   git tag vX.Y.Z && git push origin main --tags
   ```

5. **Publish to npm** — the local default registry is the China mirror, which
   does not accept third-party publishes; always point at the official
   registry:

   ```sh
   # once per session (2FA accounts: use an Automation token, or have the
   # interactive OTP prompt ready — one code per package)
   npm login --registry=https://registry.npmjs.org

   cd plugins/prior-probe
   npm publish --registry=https://registry.npmjs.org --access public
   cd ../evidence-dashboard
   npm publish --registry=https://registry.npmjs.org --access public
   ```

6. **Verify the release**:

   ```sh
   npm view dsh-prior-probe version dist-tags --registry=https://registry.npmjs.org
   npm view dsh-evidence-dashboard version dist-tags --registry=https://registry.npmjs.org
   ```

Notes / 说明:

- Published versions are immutable — a botched publish cannot be replaced
  under the same version number. Never republish an existing version.
- `files` whitelists in each `package.json` control what ships; keep data
  files, the patch layer, and the entry inside it.
- npm 发布版本不可变——同一版本号无法重发，出错只能发新版本号。
- 各 `package.json` 的 `files` 白名单控制上传内容；确保数据文件、patch 层与
  入口都在其中。
