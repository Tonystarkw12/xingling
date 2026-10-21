# xingling-web — 小说阅读站

React SPA，展示《星灵》小说正文、官方外传《境界彼方》、角色、世界观、时间线。

## 命令

```bash
bun run dev               # 开发服务器
bun run build             # tsc -b && vite build
bun run lint              # eslint
bun run parse             # 全量解析生成正传与外传数据 (src/data/novel.ts & otherworld.ts)
bun run parse:main        # 重新生成正传 src/data/novel.ts
bun run parse:otherworld  # 重新生成外传 src/data/otherworld.ts
bun run preview           # 预览
```

依赖用 **bun**（bun.lock 为准）。

## 数据流（核心约束）

```
正传：仓库根/novels/星灵.md → scripts/parse-novel.ts → src/data/novel.ts（Auto-generated）
外传：仓库根/theotherworld/境界彼方.md → scripts/parse-otherworld.ts → src/data/otherworld.ts（Auto-generated）
```

- 改 `novels/星灵.md` 或 `theotherworld/境界彼方.md` 后运行 `bun run parse`，否则站点内容过期
- `src/data/characters.ts`、`world.ts` 手写，直接编辑
- `src/store/index.ts` — Zustand 全局状态（支持正传与外传阅读进度与已读章节持久化）

## 路由（src/App.tsx）

| 路径 | 页面 | 说明 |
|---|---|---|
| `/` | Home | 主站首页，含正传与外传双入口与精选推荐 |
| `/volumes` | VolumeSelector | 正传卷级选择器（16卷） |
| `/read/:volumeIndex/:chapterIndex` | ChapterReader | 正传章节阅读器 |
| `/characters` | CharacterBook | 角色图鉴（支持正传/外传分类筛选） |
| `/world` | WorldView | 世界观百科（含拉尼亚星云、阿波罗号等外传设定） |
| `/timeline` | Timeline | 编年史时间线（含星灵纪元1857-2308外传先驱大事件） |
| `/otherworld` | OtherworldOverview | 官方外传《境界彼方》全景概览与选章页 |
| `/otherworld/read/:chapterIndex` | OtherworldReader | 官方外传《境界彼方》沉浸式阅读器 |

组件结构：`src/components/pages/`（页面）、`effects/StarField.tsx`（星空背景）、`ui/`（通用组件）。

## 部署

- systemd 单元 `xingling.service`：`vite preview --host 0.0.0.0 --port 5178`
- 手动等价：`./start-preview.sh`（端口 5178）
- 部署前需 `bun run build` 产出 `dist/`

## 规则

- 构建 = `tsc -b && vite build`，类型错误即构建失败 — 提交前跑 build
- `src/scripts/` 为空目录（残留），解析脚本在仓库级 `scripts/parse-novel.ts` 和 `scripts/parse-otherworld.ts`
