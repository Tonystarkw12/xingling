# 星灵 Android App

WebView wrapper for the Phaser 3 web game.

## Project Structure

```
android-app/
├── app/src/main/
│   ├── AndroidManifest.xml
│   ├── java/com/xingling/game/MainActivity.kt
│   ├── res/
│   │   ├── layout/activity_main.xml
│   │   └── values/{strings,themes,colors}.xml
│   └── assets/www/          ← Phaser game goes here
├── build.gradle.kts
├── app/build.gradle.kts
├── settings.gradle.kts
└── gradle/
```

## Prerequisites

- Android Studio Hedgehog (2023.1.1) or later
- JDK 17

## Copy Web Game

Build the Phaser game first, then copy the dist output into the assets folder:

```bash
# From xingling-game directory
npm run build

# Copy dist to Android assets
rm -rf android-app/app/src/main/assets/www/*
cp -r xingling-game/dist/* android-app/app/src/main/assets/www/
```

The `assets/www/` directory must contain `index.html` as the entry point.

## Build & Run

```bash
cd android-app

# Debug build
./gradlew assembleDebug

# Install on connected device
./gradlew installDebug
```

Or open `android-app/` in Android Studio and run directly.

## Notes

- WebView has JavaScript, DOM storage, and hardware acceleration enabled
- App runs in fullscreen immersive landscape mode
- Back button navigates WebView history before exiting
- Target SDK 34, Min SDK 24
