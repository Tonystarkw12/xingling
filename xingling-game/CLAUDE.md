# xingling-game — Phaser 视觉小说/卡牌战斗游戏

《星灵》小说的互动游戏化。第一卷 Episode 1 共 14 个场景（S01–S14），含对话、分支选择、卡牌战斗、装备/升级系统。

## 命令

```bash
bun run dev      # 开发服务器
bun run build    # vite build
bun run preview  # 预览构建
```

依赖用 **bun**（bun.lock 为准；yarn.lock 是残留，忽略）。

## 架构

### 场景流（src/main.ts 注册，key → 类）

```
Preloader → TitleScreen → ChapterSelectScene → Chapter1Scene（剧情）
                                    ├→ SettingsScene / CharacterPanelScene / EquipmentScene / CardUpgradeScene
                                    └→ BattleScene（= SquadBattleScene 类）→ ChapterCompleteScene
```

⚠️ 陷阱：`scenes/BattleScene.ts` **零引用（遗留文件）**。main.ts 以 key `'BattleScene'` 注册的是 **SquadBattleScene**。改战斗逻辑先确认目标类，勿改错文件。

### 场景（src/scenes/）

| 文件 | 职责 |
|---|---|
| `BaseChapterScene.ts` | 章节场景基类，Chapter1Scene 继承它 |
| `Chapter1Scene.ts` | 第一章剧情（对话/选择） |
| `SquadBattleScene.ts` | 现役战斗系统（注册 key `BattleScene`） |
| `BattleScene.ts` | 旧战斗系统，未注册，遗留 |
| `ChapterSelectScene` / `ChapterCompleteScene` / `TitleScreen` / `Preloader` / `SettingsScene` / `TutorialScene` | 导航与外壳 |

### 数据层（src/data/）

- `ChapterDatabase.ts` / `chapter1.ts` — 章节与剧情数据
- `CardDatabase.ts` + `CardUpgradeSystem.ts` — 卡牌与升级
- `EnemyDatabase.ts` / `EquipmentDatabase.ts` / `CharacterDatabase.ts`
- `SaveSystem.ts` — 存档，**localStorage**（SAVE_KEY 进度 + EQUIP_KEY 装备）
- `SettingsSystem.ts` — 设置持久化

### UI（src/ui/）

DialogueBox、ChoicePanel、Card、EquipmentCard、CharacterPortrait、PauseMenu、RichText、BattleVFX（战斗特效）、BattleTutorial、SFXManager（音效）。

### 资产（public/assets/，asset-pack.json 为清单）

- `storyboards/scene_E01S01-14.png` — 14 张分镜
- `characters/` — 立绘（ampere/iris/peter + enemy_* 四种敌人；`*_nobg.png` 为去底版）
- `audio/` — `voice_E01S{NN}_{idx}.wav` 逐句语音 + `*_merged.wav` 合并版 + `bgm_episode1.mp3`；`*_silent.wav` 为占位
- `scenes/`（nock_city、battle_arena）、`props/`（star_key_dawn）

## 改动热点（历史 bug 集中区，改前谨慎）

`BattleScene.ts`、`CardDatabase.ts`、`Chapter1Scene.ts` — 近 90 天提交最频繁。

## 当前待办（todo.md）

1. 立绘改进（BSE/ALE/星化状态）
2. 语音核对 + 补战斗语音/特效/光效/动效
3. 卡组平衡 + 敌人技能/立绘/语音完善

## 规则

- 改剧情文本优先改数据层（chapter1.ts / ChapterDatabase），不要硬编码进 Scene
- 新资产加入后同步更新 `asset-pack.json`
- 存档格式改动需考虑 localStorage 旧档兼容（SaveSystem 有 raw 解析容错）
