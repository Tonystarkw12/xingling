# 星灵桌面客户端

基于 Tauri 2 构建，将 Phaser 3 网页游戏包装为原生应用。

## 下载

从 [GitHub Releases](https://github.com/Tonystarkw12/xingling/releases/latest) 下载对应平台安装包：

- **Windows**：`*_x64-setup.exe`（NSIS 安装程序）
- **macOS**：`.dmg`
- **Android**：`app-debug.apk`（测试包；安装前需在设备设置中允许未知来源应用）

## 前置依赖

- Rust（1.77+）
- Node.js（18+）
- Windows：安装 [Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) 或 Visual Studio

## 开发

```bash
npm install
npm --prefix xingling-game install
npx tauri dev
```

## 构建

```bash
npm install
npm --prefix xingling-game ci
npx tauri build
```

Windows 产物位于 `src-tauri/target/release/bundle/nsis/`。

## 发布

推送 `v*` tag 自动运行 GitHub Actions，构建 Windows NSIS `.exe` 并发布到 GitHub Release。

```bash
git tag -a v0.1.2 -m "Release v0.1.2"
git push origin v0.1.2
```

## 项目结构

```
xingling-windows/
├── xingling-game/       # Phaser 3 网页游戏（Vite + TypeScript）
│   └── dist/            # 构建产物（Tauri 加载此目录）
├── src-tauri/           # Tauri 后端（Rust）
│   ├── Cargo.toml
│   ├── tauri.conf.json  # Tauri 配置
│   ├── src/
│   │   ├── main.rs
│   │   └── lib.rs
│   └── icons/           # 应用图标
└── README.md
```

## 图标生成

将 1024x1024 PNG 图标放入 `src-tauri/icons/`，运行：

```bash
cd xingling-game && npx @tauri-apps/cli icon path/to/icon.png
```
