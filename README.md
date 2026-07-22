# 星灵 - Windows 客户端

基于 Tauri 2 构建的 Windows 桌面客户端，将 Phaser 3 网页游戏包装为原生应用。

## 前置依赖

- Rust (1.77+)
- Node.js (18+)
- Windows: 需安装 [Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) 或 Visual Studio

## 开发

```bash
# 安装 JS 依赖
cd xingling-game && npm install && cd ..

# 启动开发模式（热重载）
cd xingling-game && npm run tauri dev
```

## 构建

```bash
# 先构建 web 资源，再编译 Tauri
cd xingling-game && npm run tauri build
```

产物位于 `src-tauri/target/release/bundle/`：
- `.msi` - Windows Installer
- `.exe` - 绿色版可执行文件

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
