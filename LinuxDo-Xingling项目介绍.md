# 星灵：把一部长篇中文科幻小说，做成可以游玩的世界

> 一个还在持续开发中的中文科幻 / 奇幻互动叙事项目：小说、网页阅读站、Phaser 游戏客户端，全部放在同一个开源仓库里。

项目地址：<https://github.com/Tonystarkw12/xingling>

![诺克城](https://raw.githubusercontent.com/Tonystarkw12/xingling/master/xingling-game/public/assets/scenes/nock_city.png)

## 这是什么项目？

《星灵》原本是一部长篇中文科幻 / 奇幻小说，现在正在逐步变成一套沉浸式互动叙事作品。

项目当前包含三部分：

- **小说正文**：主线《星灵》以及《境界彼方》等前传、外传和短篇作品。
- **网页展示站**：用 React 构建的小说阅读与世界观展示页面。
- **互动游戏**：用 Phaser 制作的视觉小说 / 卡牌战斗方向游戏，目前以第一章内容为主要体验入口。

它不是单独做一个 Demo，而是尝试把文字、角色、场景、音乐、配音和交互系统放进同一个持续演化的世界里。

## 世界观：从星之键到圣皇战争

故事围绕几个核心概念展开：

- **星灵种族**：拥有独特文明与能力体系的核心种族。
- **星之键**：贯穿世界观和主线剧情的重要神器。
- **权能体系**：包括电磁、空间、绝对零度等方向的特殊能力。
- **圣皇战争**：推动主要冲突发展的宏大历史背景。
- **拉提麦尔星系 / 艾尔登超星系团**：故事展开的主要宇宙舞台。

项目当前仍处于开发阶段，因此更适合把它看作一座正在建设中的“数字小说世界”，而不是已经完成的商业游戏。

## 游戏部分：从阅读到操作

游戏端使用 Phaser 3 + TypeScript + Vite 构建，目标是将章节叙事和游戏机制结合起来。

![战斗场景](https://raw.githubusercontent.com/Tonystarkw12/xingling/master/xingling-game/public/assets/scenes/battle_arena.png)

目前可以看到的方向包括：

- 章节式剧情推进
- 对话与选项交互
- 角色与敌人数据
- 卡牌战斗
- 双人小队战斗
- 卡牌冷却机制
- 装备、角色面板、章节选择、设置等系统化界面
- 背景音乐、语音和战斗特效资源

这些系统还会继续调整。现在的重点不是堆叠玩法，而是先让世界观、角色和叙事节奏成立，再逐步补齐游戏体验。

![第一章分镜](https://raw.githubusercontent.com/Tonystarkw12/xingling/master/xingling-game/public/assets/storyboards/scene_E01S01.png)

## 网页端：先让故事容易被读到

网页端采用 React 19、TypeScript、Vite、Tailwind CSS、Framer Motion 和 Zustand。

网页端承担更轻量的阅读入口：

- 浏览小说正文
- 查看角色与世界观内容
- 通过动效增强阅读氛围
- 为后续章节化、互动化展示提供基础

如果你更关心故事本身，建议先从网页端或仓库里的 Markdown 正文开始；如果想体验交互，再尝试游戏端。

## 本地运行

### 网页端

需要 Node.js 和 npm：

```bash
git clone https://github.com/Tonystarkw12/xingling.git
cd xingling/xingling-web
npm install
npm run dev
```

然后打开终端输出的本地地址。

### 游戏端

游戏端按项目约定使用 Bun：

```bash
cd xingling-game
bun install
bun run dev
```

构建生产版本：

```bash
# 网页端
cd xingling-web
npm run build

# 游戏端
cd ../xingling-game
bun run build
```

## 不想本地构建？

仓库 Releases 提供对应平台客户端时，可以直接下载：

- Windows：`*_x64-setup.exe`
- macOS：`.dmg`
- Android：`app-debug.apk`（测试包）

下载地址：<https://github.com/Tonystarkw12/xingling/releases/latest>

中国大陆网络环境也可以尝试项目 README 中提供的 GitHub 下载镜像：

<https://ghproxy.201014.xyz/https://github.com/Tonystarkw12/xingling/releases/latest>

目前 README 主要列出 Windows、macOS 和 Android 客户端，**不把它宣传成 Linux 原生客户端**。Linux 用户可以优先尝试网页端，或自行构建游戏端并反馈兼容性问题。

## 为什么把小说做成游戏？

长篇小说擅长展开世界观，但读者只能通过文字想象场景；游戏擅长提供空间、声音和选择，但如果缺少好的文本，交互很容易变成空壳。

《星灵》想尝试把两者接起来：

1. 用小说承载完整世界观和人物关系。
2. 用网页提供低门槛阅读入口。
3. 用游戏呈现场景、战斗、音乐和选择。
4. 用结构化数据让角色、卡牌、章节和装备可以持续扩展。

这也是这个仓库有趣的地方：它同时包含文学创作和软件工程问题。剧情怎么拆成章节，角色怎么建模，卡牌如何和能力体系对应，资源如何组织，都会反过来影响作品本身。

## 当前状态与后续计划

项目仍在持续开发中，适合：

- 喜欢中文科幻 / 奇幻世界观的读者
- 对互动小说和独立游戏开发感兴趣的人
- 想研究 Phaser、React、TypeScript 项目组织的人
- 愿意试玩、提 Issue、提供剧情或交互反馈的人

后续会继续完善章节内容、角色表现、战斗机制、音频体验和多平台发布流程。

如果你对这个项目感兴趣，欢迎：

- Star 仓库
- 试玩并提交 Issue
- 分享你最喜欢的角色或世界观设定
- 反馈阅读体验、运行问题和平台兼容性

## 写在最后

《星灵》目前还不是一款完成度很高的商业游戏，它更像是一个从长篇小说出发，逐步长出网页和游戏形态的个人创作项目。

如果你也想把自己的小说、设定集或世界观做成可以阅读、可以探索、甚至可以游玩的作品，欢迎看看这个仓库，也欢迎交流实现方式。

项目地址：<https://github.com/Tonystarkw12/xingling>

> 小说文本、世界观设定及项目素材版权归作者所有。未经许可，不得转载、改编或用于商业用途。
