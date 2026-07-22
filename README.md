# 星灵 - macOS 客户端

基于 Tauri 2 构建的 macOS 桌面客户端，将 Phaser 3 网页游戏包装为原生应用。

## 前置依赖

- Rust (1.77+)
- Node.js (18+)
- Xcode Command Line Tools (`xcode-select --install`)

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
- `macos/星灵.app` - macOS 应用包
- `dmg/星灵.dmg` - 安装镜像

## Code Signing

未签名的应用在 macOS 上会提示"无法打开"。测试阶段可右键打开。

正式发布需配置：

```bash
# 设置环境变量
export APPLE_CERTIFICATE="Developer ID Application: Your Name (TEAM_ID)"
export APPLE_CERTIFICATE_PASSWORD="keychain-password"
export APPLE_SIGNING_IDENTITY="Developer ID Application: Your Name (TEAM_ID)"
export APPLE_ID="your@email.com"
export APPLE_PASSWORD="app-specific-password"
export APPLE_TEAM_ID="TEAM_ID"

# 然后构建
cd xingling-game && npm run tauri build
```

## 项目结构

```
xingling-mac/
├── xingling-game/       # Phaser 3 网页游戏（Vite + TypeScript）
│   └── dist/            # 构建产物（Tauri 加载此目录）
├── src-tauri/           # Tauri 后端（Rust）
│   ├── Cargo.toml
│   ├── tauri.conf.json  # Tauri 配置（macOS overlay titlebar）
│   ├── Info.plist       # macOS 应用信息
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
