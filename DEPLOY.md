# 部署到 GitHub Pages

## 自动部署（推荐）

仓库已包含 GitHub Actions 工作流：`.github/workflows/deploy-drone-brochure.yml`

推送 `main` 分支后，Actions 会将 `drone-brochure/` 目录发布到 GitHub Pages。

### 首次设置步骤

1. **在 GitHub 创建仓库**（若还没有）
   - 打开 https://github.com/new
   - 仓库名例如：`first-cc` 或 `drone-brochure`

2. **推送代码到 GitHub**

   ```bash
   cd E:\cc\first-cc
   git init
   git add .
   git commit -m "Add drone brochure and GitHub Pages workflow"
   git branch -M main
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```

3. **启用 GitHub Pages**
   - 打开仓库 → **Settings** → **Pages**
   - **Source** 选择：**GitHub Actions**
   - 保存

4. **等待部署完成**
   - 打开 **Actions** 标签，查看 `Deploy Drone Brochure` 工作流
   - 成功后访问：`https://你的用户名.github.io/仓库名/`

### 访问地址

| 页面 | URL |
|------|-----|
| 网页版宣传手册 | `https://用户名.github.io/仓库名/` |
| A4 印刷版 | `https://用户名.github.io/仓库名/print-a4.html` |

### 更新内容

修改 `drone-brochure/` 内文件后 push，Actions 会自动重新部署（约 1~2 分钟）。
