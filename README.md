# 竞赛日历 · competition calendar

React、TypeScript、Vite 前端和可选的 Node.js 24 后端。赛事推荐由公开规则计算；AI 说明只在配置服务端模型后启用。示例赛事没有经过当年官方核验，不能作为报名依据。

## 本机启动

需要 Node.js 24 或更新版本。在本目录执行：

```powershell
npm ci
npm run dev
```

打开 `http://127.0.0.1:5173/`。这是无需账号的浏览器演示模式：演示称呼、赛事选择保存在本机浏览器；个人文件保存在本机 IndexedDB。清理浏览器数据会丢失这些内容。

要启用真实的本机账号、分用户存储和维护者发布入口：

```powershell
Copy-Item .env.server.example .env.server
npm run dev:full
```

首次注册前可在 `.env.server` 填写 `ADMIN_EMAIL`，该邮箱注册后获得维护者权限。密码至少 12 位。数据库和上传文件写入忽略版本控制的 `runtime-data/`；请自行备份此目录。服务只监听本机。静态构建运行 `npm run build`；带后端的构建运行 `npm run build:full`，再运行 `npm run server`，同源服务从 `dist/` 提供页面。服务端测试：`npm run test:server`。

## GitHub Pages 免费预览

`.github/workflows/pages.yml` 已准备好自动构建。将本目录提交到 GitHub 仓库的 `main` 分支，在仓库 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。之后每次推送 `main` 会重新发布静态预览。普通仓库的网址通常为 `https://用户名.github.io/仓库名/`；名为 `用户名.github.io` 的仓库使用根路径。

GitHub Pages 只能运行静态网页。这里发布的是浏览器演示模式，不能承载 Node 后端、真实账号、跨设备文件同步或密钥保护的 AI。页面里的“演示登录”必须按演示理解。若要上线完整服务，需要另外部署后端及数据库，并配置 HTTPS、域名、备份和监控。项目已初始化为本地 Git 仓库，尚未发布到 GitHub。

## 使用与更新

- 用户在“我的文件”选择日期或赛事后上传，也可把文件拖到日历日期格；按名称搜索和下载。演示模式文件仅存当前浏览器，完整本机模式文件由后端按账号隔离。每个文件最多 25 MB。目前只管理文件与日期关联，不自动解析 PDF、Word 或 Excel 内容。
- 用户在“个人设置”下载 `.ics` 日历，可导入日历应用。打开页面时可自行开启 30／14／7／1 天浏览器通知；页面关闭后不会继续提醒。当前没有可开机自启的桌面组件。
- 维护者更新赛事按 [维护者操作说明](维护者操作说明.md) 操作。静态版本更新 `public/competitions.json` 并重新发布；完整本机模式可在维护者账号中发布。每项赛事应保留官方来源和核验状态。
- 前端代码按组件、推荐规则、日历、文件服务、API 适配层拆分。关键位置：`src/components/`、`src/lib/recommend.ts`、`src/lib/calendar.ts`、`src/services/`、`server/`、`public/competitions.json`。

## AI 配置

“模型”是可选的文字解释服务。先不配置也能搜索、筛选、推荐和使用日历。若以后选择提供兼容聊天接口的服务商，在 `.env.server` 填 `AI_API_URL`、`AI_MODEL` 和 `AI_API_KEY`。其中 API Key 类似密码，**只能放在后端配置**；不要写入网页、GitHub 仓库或任何 `VITE_` 变量。模型可能出错，参赛资格和日期仍需查看官方通知。免费额度取决于服务商当时的规则。

## 安全边界

后端提供密码哈希、HttpOnly 会话 Cookie、账号隔离、上传大小与文件头检查、来源限制、速率限制及赛事更新审计。正式公网开放前还需要 HTTPS 反向代理、邮件验证与找回密码、文件恶意内容扫描、可靠备份、监控和安全检查。不要把 `runtime-data/`、`.env.server` 或 AI 密钥提交到仓库。若前端和 API 分别放在 GitHub Pages 与另一域名，现有 Cookie 会话方案不能直接保证跨站正常工作；完整服务建议同源部署。

