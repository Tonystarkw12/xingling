import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const novelPath = join(__dirname, '..', '..', '星灵.md');
const outputPath = join(__dirname, '..', 'src', 'data', 'novel.ts');

interface Chapter {
  title: string;
  content: string;
  lineStart: number;
}

interface Volume {
  title: string;
  chapters: Chapter[];
  theme: string;
}

const volumeThemes: Record<number, string> = {
  1: 'snow',     // 自行始终 - ice/snow theme
  2: 'storm',    // 风暴突袭 - storm/wind
  3: 'medicine', // 靶向药物 - medical/lab
  4: 'ice',      // 爱与冰雪 - ice/love
  5: 'home',     // 家在何方 - home/warmth
  6: 'forest',   // 森林奇缘 - forest/nature
  7: 'fate',     // 命运之门(上) - fate/mystery
  8: 'fate2',    // 命运之门(下) - fate/revelation
  9: 'ocean',    // 暗流涌动 - ocean/deep
  10: 'shadow',   // 往日之影 - shadow/past
  11: 'surge',    // 来势汹汹 - surge/power
  12: 'break1',   // 分崩离析(上) - breaking/fire
  13: 'break2',   // 分崩离析(下) - breaking/truth
  14: 'reunion',  // 久别重逢 - reunion/warmth
  15: 'night1',   // 长夜孤星(上) - night/darkness
  16: 'night2',   // 长夜孤星(下) - night/end
};

function parseNovel(): Volume[] {
  const content = readFileSync(novelPath, 'utf-8');
  const lines = content.split('\n');
  const volumes: Volume[] = [];
  let currentVolume: Volume | null = null;
  let currentChapter: Chapter | null = null;
  let volumeIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Volume header: # 第X卷 ...
    const volumeMatch = line.match(/^#\s+第([\d一二三四五六七八九十百千]+)卷\s+(.+)/);
    if (volumeMatch) {
      if (currentVolume && currentChapter) {
        currentVolume.chapters.push(currentChapter);
      }
      if (currentVolume) {
        volumes.push(currentVolume);
      }
      volumeIndex++;
      currentVolume = {
        title: `第${volumeMatch[1]}卷 ${volumeMatch[2]}`,
        chapters: [],
        theme: volumeThemes[volumeIndex] || 'default',
      };
      currentChapter = null;
      continue;
    }

    // Chapter header: ## 第X章：... or ## 第X章: ...
    const chapterMatch = line.match(/^##\s+第([一二三四五六七八九十百千\d]+)[章:：]\s*(.+)/);
    if (chapterMatch && currentVolume) {
      if (currentChapter) {
        currentVolume.chapters.push(currentChapter);
      }
      currentChapter = {
        title: `第${chapterMatch[1]}章：${chapterMatch[2]}`,
        content: '',
        lineStart: i,
      };
      continue;
    }

    // Accumulate chapter content
    if (currentChapter && currentVolume) {
      if (currentChapter.content) {
        currentChapter.content += '\n' + line;
      } else {
        currentChapter.content = line;
      }
    }
  }

  // Push last chapter and volume
  if (currentChapter && currentVolume) {
    currentVolume.chapters.push(currentChapter);
  }
  if (currentVolume) {
    volumes.push(currentVolume);
  }

  return volumes;
}

const volumes = parseNovel();

const tsContent = `// Auto-generated from 星灵.md - DO NOT EDIT
export interface Chapter {
  title: string;
  content: string;
  lineStart: number;
}

export interface Volume {
  title: string;
  chapters: Chapter[];
  theme: string;
}

export const volumes: Volume[] = ${JSON.stringify(volumes, null, 2)};

export const totalChapters = volumes.reduce((sum, v) => sum + v.chapters.length, 0);
export const totalVolumes = volumes.length;
`;

writeFileSync(outputPath, tsContent, 'utf-8');
console.log(`Parsed ${volumes.length} volumes, ${volumes.reduce((s, v) => s + v.chapters.length, 0)} chapters`);
console.log(`Output: ${outputPath}`);
