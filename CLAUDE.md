# 星灵 (Xingling) — Project Context

## Overview

中文科幻/奇幻长篇小说《星灵》+ 双前端实现（阅读站 + Phaser 游戏）。
数据流：Markdown 小说/设定（内容层）→ `parse-novel.ts` 解析 → `src/data/*.ts` 结构化数据 → Web/Game 呈现。

## 仓库布局

```
xingling/
├── LinuxDo-Xingling项目介绍.md  # 社区介绍帖素材
├── entities.md / entities.json # 根级实体定义（内容弱，多为工具生成残留）
├── mempalace.yaml          # 记忆宫殿房间映射（xingling_web/plans/scripts/documentation/planning/general）
│
├── novels/                 # 小说内容总目录
│   ├── 星灵.md             # 主小说全文（第一卷 自行始终，6500+行）— web 解析脚本的唯一上游
│   ├── 企划.md             # 项目企划
│   ├── 评分报告_星灵.md    # 主小说评分
│   ├── 境界彼方.md / 境界彼方（改进版）.md  # 前传/外传
│   ├── *.md                # 短篇正文（卢米诺斯、烬火与霓虹、坠日之后 等）
│   ├── 评分报告_*.md       # 与小说同名对应的评分报告
│   ├── entities.md         # 短篇角色设定
│   └── Plans/              # 小说相关计划
│
├── xingling-web/           # React 阅读站（有独立 CLAUDE.md）
├── xingling-game/          # Phaser 游戏（有独立 CLAUDE.md）
│
├── Plans/                  # 实现计划文档
├── docs/comet/             # Comet 工作流目录 specs/ changes/ archive/（当前均为空）
└── README.md
```

## 关键管线（改动前必读）

- 改 `novels/星灵.md` 后必须在 `xingling-web/` 跑 `bun run parse`，否则 `src/data/novel.ts` 过期
- `xingling-web/src/data/novel.ts` 头部标注 `Auto-generated from 星灵.md - DO NOT EDIT` — 勿手改
- `characters.ts` / `world.ts` 为手写数据，可直接编辑

## Tech Stack

### xingling-web（阅读站）
- React 19 + TypeScript 6 + Vite 8 + Tailwind 4 + Framer Motion + Zustand + React Router 7
- 路由：`/` Home · `/volumes` 卷选择 · `/read/:volumeIndex/:chapterIndex` 阅读 · `/characters` 角色书 · `/world` 世界观 · `/timeline` 时间线
- 命令：`bun run dev` / `build`（tsc -b && vite build）/ `lint` / `parse` / `preview`
- 部署：`xingling.service` systemd 单元 + `start-preview.sh`，`vite preview --host 0.0.0.0 --port 5178`

### xingling-game（游戏）
- Phaser 3.90 + TypeScript 5.8 + Vite 6 + Tailwind 3
- 命令：`bun run dev` / `build` / `preview`
- 详见 `xingling-game/CLAUDE.md`

## Conventions

- 项目语言中文；代码注释和 commit message 中英皆可
- 两子项目各自独立依赖，**均用 bun 管理**（bun.lock 已提交）；`xingling-game/yarn.lock` 为残留物，勿依据它安装
- 禁用 pnpm 管理本项目依赖
- 小说内容 Markdown 存储；构建脚本解析为 TS 数据
- agent 工具产物目录（`.agents/ .comet/ .claude-flow/ .swarm/ agentdb.rvf* semantica.log` 等）已 gitignore，勿提交、勿当项目内容分析

## Key Domain Concepts

- **星灵纪元** — 纪年系统
- **星之键** — 神器，核心剧情线索
- **权能** — 能力体系（电磁系、空间系、绝对零度等）
- **拉提麦尔星系** — 主要舞台；**艾尔登超星系团** — 更大宇宙结构
- **ALE崩坏病** — 疾病设定；**紫晶** — 关键资源；**灵武** — 星灵武器

## Git

- 分支 `master`，remote `cnb/master`
- 工作区常态：有未提交改动 + 未跟踪新源码（游戏 data/scenes/ui 扩展），提交前先 `git status` 核对
- 初始 commit：`eaa854a Initial commit`

<comet-ambient-resume>
<!-- Managed by Comet. Edits inside this block may be replaced by comet init/update. -->
<!-- Contract: comet.resume_probe.v2 -->

## Comet Ambient Resume

在这个仓库中，开始处理需要改动或调查的任务前，如果可能存在活跃 Comet workflow，把当前用户请求传入只读探针：`comet resume-probe . --stdin --json`。

- 如果用户通过宿主明确调用任意 Comet Skill（例如 `@comet`、`/comet`、`@comet-native` 或 `/comet-hotfix`），显式调用优先于本恢复协议；不要运行 resume probe，直接进入被调用的 Skill。
- 只信任返回的 `workflow`、`skill` 和 `entrySource`；它们只由项目配置或无配置兼容回退决定。不得扫描或切换另一套 workflow。
- 如果 probe 返回 `auto_resume`，简短说明选中的 active change，并进入 `nextCommand` 指向的永久入口。不要把状态命令当作恢复入口直接推进。
- 如果 probe 返回 `ask_user`，只问一个简短问题并等待用户回复。
- 如果当前请求未明确调用 Comet Skill，且 probe 返回 `out_of_scope` 或 `none`，不要进入 Comet workflow。
- 如果配置或状态无效且没有 `nextCommand`，停止并报告原因；不要猜测另一个 workflow。
- 不能只因为存在 active change 就把无关任务挂到该 change。Native 的未提交改动由 Native 入口检查，不由探针自动归因。
</comet-ambient-resume>
