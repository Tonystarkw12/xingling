# 星灵 Novel Web Experience - Implementation Plan

## Context

The user wants to create a beautiful interactive website that presents the novel 星灵 (Star Spirit) as a visual novel / web game experience. The novel is a 16-volume, ~200-chapter Chinese sci-fi/fantasy epic (1.7MB, 6,514 lines). Players should be able to experience the story, view characters, worldbuilding, and other game-like features.

## Approach: Single-Page Application with Vite + React + TypeScript

A lightweight SPA that parses the markdown at build time and delivers an immersive reading experience with game-like UI elements.

### Tech Stack
- **Vite** - Fast build tool and dev server
- **React 18 + TypeScript** - Component framework
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations and transitions
- **Zustand** - State management (lightweight)
- **React Router** - Navigation between sections

### Architecture

```
xingling-web/
├── src/
│   ├── data/
│   │   ├── novel.ts          # Parsed novel content (auto-generated from 星灵.md)
│   │   ├── characters.ts     # Character database (extracted/manually curated)
│   │   └── world.ts          # Worldbuilding data (races, locations, timeline)
│   ├── components/
│   │   ├── Home.tsx           # Landing page with animated title
│   │   ├── VolumeSelector.tsx # Volume selection screen
│   │   ├── ChapterReader.tsx  # Main reading experience
│   │   ├── CharacterBook.tsx  # Character encyclopedia
│   │   ├── WorldMap.tsx       # Worldbuilding browser
│   │   ├── Timeline.tsx       # Story timeline
│   │   ├── SaveSystem.tsx     # Reading progress save/load
│   │   ├── Settings.tsx       # Font size, theme, reading mode
│   │   └── ui/                # Shared UI components
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       ├── Button.tsx
│   │       └── ProgressBar.tsx
│   ├── store/
│   │   └── index.ts           # Zustand store (reading progress, settings)
│   ├── styles/
│   │   └── globals.css        # Global styles, animations
│   ├── App.tsx
│   └── main.tsx
├── scripts/
│   └── parse-novel.ts         # Build script: 星灵.md → structured JSON
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### Key Features

1. **Immersive Reading Experience**
   - Chapter-by-chapter reading with animated text reveal
   - Background atmosphere effects (snow, stars, fire particles per volume theme)
   - Volume-specific color themes and backgrounds
   - Previous/Next chapter navigation

2. **Character Encyclopedia (人物图鉴)**
   - Extracted character profiles with descriptions
   - Filter by race (安吉拉, 卡普拉, 泰坦, 精灵)
   - Character relationship web visualization

3. **Worldbuilding Browser (世界观)**
   - Timeline of events across 星灵纪元 2275-2295
   - Location cards (诺克城, 大矿洞, 卡提雅, etc.)
   - Faction/race information
   - Key artifacts (星之键, 圣星冠, 灵武)

4. **Game-like Systems**
   - Reading progress tracking with localStorage
   - "Save points" at chapter boundaries
   - Achievement-like milestones (completed volumes)
   - Chapter unlock progress visualization

5. **Visual Design (星空宇宙风)**
   - Deep space dark theme with cosmic blue/purple gradients
   - Animated star particle backgrounds (custom canvas)
   - Nebula-like glow effects on interactive elements
   - Chinese typography optimization with generous line height
   - Responsive design (mobile-first)
   - Smooth page transitions with Framer Motion
   - Volume-specific atmospheric effects (snow for ice volumes, fire for battle volumes, etc.)

### Implementation Phases

**Phase 1: Project Setup & Parsing (1-2 hours)**
- Initialize Vite + React + TS project
- Build parse-novel.ts script to extract volumes/chapters/content from 星灵.md
- Generate structured JSON data files
- Basic routing and layout shell

**Phase 2: Core Reading Experience (2-3 hours)**
- Landing page with animated title and volume selection
- Chapter reader with text formatting and navigation
- Reading progress persistence
- Background effects per volume theme

**Phase 3: Game Features (2-3 hours)**
- Character encyclopedia page
- Worldbuilding browser page
- Timeline view
- Save/load system

**Phase 4: Polish & Polish (1-2 hours)**
- Animations and transitions
- Mobile responsiveness
- Settings (font size, theme toggle)
- Final testing

### Parsing Strategy

The parse-novel.ts script will:
1. Read 星灵.md
2. Split by `# ` markers for volumes
3. Split each volume by `## ` markers for chapters
4. Extract chapter titles and content
5. Output as `src/data/novel.ts` with typed interfaces

### Character/Worldbuilding Data

Since the novel is already written, characters and worldbuilding data will be manually curated into structured files based on the novel content. Key characters identified:
- 安培尔 (Ampere) - electromagnetic powers, protagonist
- 艾莉丝 (Iris) - space powers, companion
- 凯奥斯 (Chaos) - time traveler
- 托尼 (Tony) - sensor/locator
- 费德里科 (Federico) - miner leader
- 阿尔基姆 (Alchim) - noble流浪汉
- 珍妮弗 (Jennifer) - Federico's daughter

### Verification

1. Run `bun run dev` and verify dev server starts
2. Navigate through all 16 volumes and chapters
3. Test character encyclopedia page
4. Test worldbuilding browser
5. Test reading progress persistence (refresh page)
6. Test on mobile viewport
7. Verify all text renders correctly with proper Chinese formatting
