# 页面优化建议（Jekyll 架构适配版）

> 适用于当前技术架构：GitHub Pages + Jekyll + 多年份目录（`/2026`、`/2027`）+ 共享布局与数据（`_layouts`、`_includes`、`_data`）。

---

## 1. 会议 SEO 元数据改为“布局层 + 年份数据层”

- **优先级**：🔴 高
- **描述**：当前 `<head>` 由共享布局输出，建议将 Event Schema 的可变字段（时间、地点、组织方、图片）下沉到年份数据文件，再由布局统一渲染，避免每年在页面正文里重复维护。
- **涉及文件**：`_layouts/conference.html`、`_data/2026/*.yml`、`_data/2027/*.yml`、`2026/index.html`、`2027/index.html`
- **示例**：在 `conference.html` 中读取 `site.data[page.year].meta` 并输出 `application/ld+json`。
- **预期改进**：SEO 配置标准化，新增年份时只需补数据，不需复制 `<head>` 逻辑。

---

## 2. Editions 导航与年份目录建立一致性校验

- **优先级**：🔴 高
- **描述**：Editions 入口来自 `_data/editions.yml`，建议建立“数据项与目录存在性”校验（至少在 PR/部署前脚本检查），避免出现数据有年份但页面目录不存在，或目录存在但导航未暴露。
- **涉及文件**：`_data/editions.yml`、`_includes/topbar.html`、`.github/workflows/deploy.yml`
- **示例**：在 CI 增加检查脚本，验证 `editions.yml` 中每个 `url` 对应目录包含 `index.html`。
- **预期改进**：消除跨年份导航断链，降低发布后回滚风险。

---

## 3. 年份页面中的资源路径统一为 `relative_url`

- **优先级**：🟡 中
- **描述**：年份页面内仍有部分相对路径写法（如 `assets/speakers/...`）。建议统一用 `relative_url` 生成站点根路径，确保 `baseurl`、子目录部署和本地预览行为一致。
- **涉及文件**：`2026/index.html`、`2027/index.html`（后续年份同规则）
- **示例**：`{{ '/2026/assets/speakers/' | append: speaker.photo | relative_url }}`
- **预期改进**：避免路径在不同运行环境下解析不一致导致 404。

---

## 4. 共享组件职责再收敛（`_includes` 与年份页面）

- **优先级**：🟡 中
- **描述**：当前顶部导航、底部导航、移动抽屉已放在 `_includes`。建议继续把跨年份共用片段（如联系方式、统一 CTA 区块）下沉为 include，年份页面仅保留差异化内容与数据绑定。
- **涉及文件**：`_includes/*.html`、`2026/index.html`、`2027/index.html`
- **示例**：提取 `conference-contact.html` include，并通过 `page.year` 读取对应数据。
- **预期改进**：降低复制粘贴修改成本，减少年份间样式/文案漂移。

---

## 5. 部署链路保持“Jekyll 构建产物发布”基线

- **优先级**：🟡 中
- **描述**：本项目依赖 Liquid 与 `_data` 渲染，部署必须走 Jekyll build；禁止使用 `.nojekyll` 直传源码。建议将此作为固定发布基线并在文档中显式约束。
- **涉及文件**：`.github/workflows/deploy.yml`、`README.md`
- **示例**：`actions/jekyll-build-pages` 输出 `_site`，再由 `upload-pages-artifact` 发布。
- **预期改进**：避免模板变量未渲染导致的线上 404 与 SEO 元数据失效。

---

## 执行方式（建议）

按优先级一次只执行一个优化项；每完成一项后更新本文档状态，再进入下一项。
