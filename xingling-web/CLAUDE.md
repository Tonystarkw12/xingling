# xingling-web — 小说阅读站

React SPA，展示《星灵》小说正文、角色、世界观、时间线。

## 命令

```bash
bun run dev      # 开发服务器
bun run build    # tsc -b && vite build
bun run lint     # eslint
bun run parse    # tsx scripts/parse-novel.ts — 重新生成 src/data/novel.ts
bun run preview  # 预览
```

依赖用 **bun**（bun.lock 为准）。

## 数据流（核心约束）

```
仓库根/novels/星灵.md → scripts/parse-novel.ts → src/data/novel.ts（Auto-generated，勿手改）
```

- 改 `novels/星灵.md` 后必须 `bun run parse`，否则站点内容过期
- `src/data/characters.ts`、`world.ts` 手写，直接编辑
- `src/store/index.ts` — Zustand 全局状态

## 路由（src/App.tsx）

| 路径 | 页面 |
|---|---|
| `/` | Home |
| `/volumes` | VolumeSelector |
| `/read/:volumeIndex/:chapterIndex` | ChapterReader |
| `/characters` | CharacterBook |
| `/world` | WorldView |
| `/timeline` | Timeline |

组件结构：`src/components/pages/`（页面）、`effects/StarField.tsx`（星空背景）、`ui/`（通用组件）。

## 部署

- systemd 单元 `xingling.service`：`vite preview --host 0.0.0.0 --port 5178`
- 手动等价：`./start-preview.sh`（端口 5178）
- 部署前需 `bun run build` 产出 `dist/`

## 规则

- 构建 = `tsc -b && vite build`，类型错误即构建失败 — 提交前跑 build
- `src/scripts/` 为空目录（残留），解析脚本在仓库级 `scripts/parse-novel.ts`
