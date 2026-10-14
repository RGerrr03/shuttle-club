# 羽球局 · Shuttle Club

七位球友；抽签前选择到场人员；15/21 分；固定两人分队；1v1、2v2、3v3；胜率及横屏记分。

网站入口：https://rgerrr03.github.io/shuttle-club/

GitHub Pages 提供静态网页；Neon 免费项目提供 Auth 与 Data API。球友公开只读，数据库权限限制只有已验证并绑定的管理员能写入。管理员邮箱仅保存在私有数据库表中。

## 开发与发布
Node.js 24，npm ci 后执行 npm run check 和 npm test。
配置 PUBLIC_AUTH_URL 和 PUBLIC_DATA_API_URL 后执行 npm run build，生成 dist/index.html。
GitHub Pages 从 main 分支根目录发布 index.html。

scripts/data-api.sql 为现有 club_state、club_owner 表配置 RLS 与 RPC。新数据库需先创建表、初始化名单，并在 club_private.settings 安全设置管理员邮箱。不要将数据库密码、访问密钥或管理员配置提交到公开仓库。

源码归档：shuttle-club-source.zip；根目录 index.html 为发布构建。
