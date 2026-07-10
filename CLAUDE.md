# 星灵 (Xingling) — Project Context

## Overview

星灵是一个创意写作 + 交互式小说网站项目。核心内容是一部中文科幻/奇幻长篇小说《星灵》（16卷、~200章、6500+行），围绕星灵种族、星之键、圣皇战争等宏大世界观展开。项目目标是将小说呈现为沉浸式视觉小说/网页游戏体验。

## Repository Structure

```
xingling/
├── 星灵.md              # 主小说全文（第一卷 自行始终，6500+行）
├── 境界彼方.md           # 前传/外传小说（第一卷 境界彼方）
├── 企划.md              # 项目企划文档
├── entities.md / entities.json  # 角色/实体定义
├── mempalace.yaml       # 记忆宫殿配置（用于内容组织）
├── 评分报告_星灵.md      # 小说评分报告
│
├── novels/              # 短篇小说集 + 评分报告
│   ├── 境界彼方.md / 境界彼方（改进版）.md
│   ├── 卢米诺斯.md / 烬火与霓虹.md / 坠日之后.md / ...
│   ├── Plans/           # 小说相关计划
│   └── 评分报告_*.md    # 各篇评分
│
├── xingling-web/        # React SPA — 小说网页展示
│   ├── src/
│   │   ├── components/  # UI 组件
│   │   ├── data/        # 解析后的小说数据、角色、世界观
│   │   ├── store/       # Zustand 状态管理
│   │   ├── styles/      # 样式文件
│   │   └── scripts/     # 构建脚本（parse-novel.ts 等）
│   └── package.json     # React 19 + Vite 8 + Tailwind 4 + Framer Motion + Zustand
│
├── xingling-game/       # Phaser 游戏
│   ├── src/
│   │   ├── scenes/      # 游戏场景
│   │   ├── ui/          # UI 组件
│   │   ├── data/        # 游戏数据
│   │   └── main.ts      # 入口
│   └── package.json     # Phaser 3.90 + Vite 6 + Tailwind 3 + TypeScript
│
└── Plans/               # 实现计划文档
```

## Tech Stack

### xingling-web（主站）
- **Runtime:** React 19 + TypeScript 6
- **Build:** Vite 8
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion
- **State:** Zustand
- **Routing:** React Router 7
- **Icons:** Lucide React
- **Dev commands:**
  - `npm run dev` — 启动开发服务器
  - `npm run build` — 构建（tsc + vite build）
  - `npm run lint` — ESLint 检查
  - `npm run parse` — 解析小说 Markdown（tsx scripts/parse-novel.ts）

### xingling-game（游戏）
- **Engine:** Phaser 3.90
- **Build:** Vite 6
- **Styling:** Tailwind CSS 3
- **Language:** TypeScript 5.8
- **Dev commands:**
  - `npm run dev` — 启动开发服务器
  - `npm run build` — 构建

## Conventions

- 项目语言为中文，代码注释和 commit message 使用中文或英文均可
- 小说内容以 Markdown 格式存储，通过构建脚本解析为结构化数据
- 两个子项目各自独立管理依赖（各自的 node_modules）
- xingling-web 使用 `npm`，xingling-game 使用 `bun`

## Key Domain Concepts

- **星灵纪元** — 小说世界的时间纪年系统
- **星之键** — 传说中的神器，核心剧情线索
- **权能** — 星灵的特殊能力体系（电磁系、空间系、绝对零度等）
- **拉提麦尔星系** — 故事主要发生的星系
- **艾尔登超星系团** — 更大的宇宙结构
- **ALE崩坏病** — 世界中的疾病设定
- **紫晶** — 关键资源/能源
- **灵武** — 星灵的武器

## Git Workflow

- 当前分支：master
- 大量文件尚未跟踪（novels/、xingling-game/、xingling-web/ 等均为 untracked）
- 初始 commit：`eaa854a Initial commit`
