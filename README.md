# 俄语背单词网站

基于 React + Vite 构建，直接读取项目根目录的 `russian_vocab_final.json` 作为词库数据源。

## 功能

- 首页按俄语字母分类浏览
- 单词列表支持搜索和 `initial` 筛选
- 卡片模式背单词，点击显示中文释义
- 支持标记“认识 / 不认识”
- 自动保存学习进度和错词本到 `localStorage`
- 错词本支持单独复习和移除已掌握单词
- 兼容电脑和手机

## 运行

先安装 Node.js 18 或更高版本，然后在项目目录执行：

```bash
npm install
npm run dev
```

默认开发地址通常是：

```text
http://localhost:5173
```

## 打包

```bash
npm run build
npm run preview
```
