# 星灵（Xingling）

《星灵》是一个中文科幻 / 奇幻长篇小说项目，并包含面向沉浸式阅读和互动叙事的网页与游戏实现。

## 项目内容

- `星灵.md`：主小说正文
- `境界彼方.md`：前传 / 外传
- `novels/`：短篇小说、改进版本及评分报告
- `entities.md` / `entities.json`：角色与实体设定
- `mempalace.yaml`：内容组织配置
- `xingling-web/`：React 小说展示站
- `xingling-game/`：Phaser 互动游戏

## 客户端下载

从 [GitHub Releases](https://github.com/Tonystarkw12/xingling/releases/latest) 下载对应平台客户端：

- **Windows**：`*_x64-setup.exe`（NSIS 安装程序）
- **macOS**：`.dmg`
- **Android**：`app-debug.apk`（测试包；安装前需允许未知来源应用）

中国大陆网络可通过 [GitHub 下载镜像](https://ghproxy.201014.xyz/https://github.com/Tonystarkw12/xingling/releases/latest) 访问。

## 技术栈

### xingling-web

React 19、TypeScript、Vite、Tailwind CSS、Framer Motion、Zustand。

```bash
cd xingling-web
npm install
npm run dev
```

### xingling-game

Phaser 3、TypeScript、Vite、Tailwind CSS。

```bash
cd xingling-game
bun install
bun run dev
```

## 构建

```bash
# Web
cd xingling-web
npm run build

# Game
cd xingling-game
bun run build
```

## 核心世界观

故事围绕星灵种族、星之键、权能体系与圣皇战争展开，主要舞台包括拉提麦尔星系和艾尔登超星系团。

## 许可

小说文本、世界观设定及项目素材版权归作者所有。未经许可，不得转载、改编或用于商业用途。
