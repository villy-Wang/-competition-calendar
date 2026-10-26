# 竞赛日历 · competition calendar

面向学生的公开基础版：[打开网站](https://villy-wang.github.io/-competition-calendar/)。源码位于 [GitHub 仓库](https://github.com/villy-Wang/-competition-calendar)（仓库名以 `-` 开头）。

## 数据与功能边界

- 网站无需注册或邮箱。个人画像、已加入赛事和设置存于当前浏览器的 localStorage；上传的个人文件存于当前浏览器的 IndexedDB。清除浏览器数据、更换设备或浏览器，会失去这些个人数据。网站没有云端账号或跨设备同步。
- 赛事清单是公开的 `public/competitions.json`，不包含用户上传文件。首批 6 个条目依据教育部或赛事组委会页面核对，**并非完整全国赛事目录**。每条带来源链接和核验日期。来源已核验只表示当时核对过通知，不表示报名仍开放。
- 学校自定或未公布准确截止日期时，公开清单的 `deadline` 设为 `null`。已选赛事会出现在总览待办和日历的“已选赛事安排”中。用户核对本校通知后，可在“我的赛事”填写仅自己可见的截止日；日历、提醒和 .ics 导出会使用该日期。未填写日期的条目不会生成倒计时或定时提醒。已过期的日期会标为“已截止”。
- 推荐规则只做初步筛选。复杂资格条件需打开赛事详情和官方通知逐项核对。不能凭匹配分认定具备参赛资格。
- .ics 导出和浏览器通知仅覆盖有明确截止日期的条目，包括用户自行填写的本校日期。若只有待确认日期，下载按钮会说明原因并指向设置入口。通知需要网页保持打开；当前没有桌面组件或关页后推送。

## 本地运行

需要 Node.js 24 及以上：

```powershell
npm ci
npm run dev
```

浏览 `http://127.0.0.1:5173/`。构建发布版本：

```powershell
npm run build
npm run preview
```

`npm run build` 会先运行 `npm run check:data`，检查赛事 ID、来源、日期及必填字段，再做 TypeScript 和 Vite 构建。

## 更新赛事

按 [维护者操作说明](维护者操作说明.md) 更新 `public/competitions.json`。在本地开发环境打开 `http://127.0.0.1:5173/?maintenance=1` 可导出当前清单或导入 JSON 预览。预览只影响当前页面；要让全部访客看到更新，需保存文件、运行构建检查并提交推送到 `main`。GitHub Actions 会自动重新发布。不要把下一届日期从上一届推算出来。

## 项目结构

- `src/App.tsx`：页面流程、个人画像和本地状态。
- `src/components/`：年度日历、文件管理和浏览器提醒。
- `src/lib/recommend.ts`：本地推荐与资格初筛。
- `src/lib/validate.ts`、`scripts/check-catalog.mjs`：数据格式检查。
- `src/services/calendarExport.ts`、`src/services/files.ts`：日历导出和浏览器文件服务。
- `public/competitions.json`：公开赛事数据源。
- `server/`：早期可选后端原型，**不在 GitHub Pages 上运行，也不是公开基础版的账号或 AI 服务**。正式接入前需另行设计身份、数据迁移、安全和运维方案；密钥不能写入前端。

## 用户上传文件

在“文件管理”选择日期和赛事，点击选择文件或拖入；也可以拖到日历日期格。支持 PDF、Office、文本和常见图片，每个最多 25 MB。可按文件名搜索、下载和删除；点击日历中对应日期也能查看与下载。浏览器会存储原始文件，本项目不解析其内容，也不会替用户提交给赛事主办方。

## 发布与隐私

`.github/workflows/pages.yml` 在推送 `main` 后发布静态站点，Pages Source 为 GitHub Actions。此版本没有用户资料上传接口、邮箱收集、广告或第三方分析代码。访问网站及下载公开赛事文件仍会经过 GitHub Pages 的基础托管服务；点击赛事来源链接会前往对应第三方网站。
