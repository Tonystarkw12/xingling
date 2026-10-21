import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const markdownPath = join(__dirname, '..', '..', 'theotherworld', '境界彼方.md');
const outputPath = join(__dirname, '..', 'src', 'data', 'otherworld.ts');

export interface OtherworldChapter {
  id: number;
  title: string;
  subtitle: string;
  quote?: string;
  content: string;
  paragraphs: string[];
  wordCount: number;
  readingTimeMinutes: number;
  summary: string;
  theme: string;
  isLogChapter?: boolean;
}

export interface OtherworldData {
  id: string;
  title: string;
  englishTitle: string;
  series: string;
  badge: string;
  subtitle: string;
  description: string;
  epigraph: {
    text: string;
    author: string;
  };
  closingEpigraph: {
    text: string;
    author: string;
  };
  meta: {
    totalChapters: number;
    totalWords: number;
    timeline: string;
    era: string;
    version: string;
    keyThemes: string[];
  };
  chapters: OtherworldChapter[];
}

const chapterSummaries: Record<number, string> = {
  1: '开普勒教授在星灵纪元1857年通过引力透镜模型论证了拉尼亚星云外78万光年隐秘星系“境界彼方”的存在，五支先遣舰队义无反顾驶入暗物质迷雾，永久消逝于茫茫星海。',
  2: '星灵纪元2286年，艾丝特诞生于悬浮在云端的耶路纳德尔黄金圣城。在战火纷飞的萨尔扎哈与父亲的严苛规诫之间，少女对着夏夜流星许下远赴深空的誓言，决然离家。',
  3: '艾丝特考入卡罗拉多大学，师从年迈的开普勒教授潜心研习天体力学。在继承了先驱者遗留的星芒项链后，她登上了搭载曲率引擎与量子AI罗素的“阿波罗号”，开启史诗远征。',
  4: '航行日志真实记录了艾丝特穿越拉尼亚星云暗物质乱流的漫长苦旅。在时空应力与极度孤独的撕扯下，爱犬霍普离世，神经紧绷的艾丝特在崩溃边缘展开绝望挣扎。',
  5: '艾丝特精神崩溃濒临自尽，深空星舰伴生AI罗素在底层保护指令与系统能耗抉择之间，调用备用能源超频甚至牺牲认知矩阵，化作温柔光芒全力唤醒与挽救艾丝特。',
  6: '阿波罗号历经千难万险终于抵达目标坐标，艾丝特在生命的最后领悟了“真正的境界彼方就在所走过的旅途之中”。卡罗拉多大学的讲堂上，年迈的开普勒教授为探索史诗画下温情句号。',
};

const chapterThemes: Record<number, string> = {
  1: 'from-blue-600 via-indigo-500 to-cyan-400',
  2: 'from-amber-500 via-orange-400 to-yellow-300',
  3: 'from-purple-600 via-violet-500 to-pink-400',
  4: 'from-rose-600 via-red-500 to-amber-400',
  5: 'from-cyan-500 via-teal-400 to-emerald-300',
  6: 'from-indigo-600 via-purple-500 to-sky-400',
};

function parseOtherworld(): OtherworldData {
  const raw = readFileSync(markdownPath, 'utf-8');
  const lines = raw.split('\n');

  const chapters: OtherworldChapter[] = [];
  let currentTitle = '';
  let currentParagraphs: string[] = [];
  let chapterIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('## 第')) {
      if (currentTitle) {
        chapterIndex++;
        const content = currentParagraphs.join('\n\n');
        const wordCount = currentParagraphs.reduce((sum, p) => sum + p.length, 0);
        const titleParts = currentTitle.split('：');
        const mainTitle = titleParts[0].trim();
        const subtitle = titleParts[1]?.trim() || '';

        // Extract potential quote
        let quote: string | undefined;
        if (currentParagraphs[0]?.startsWith('> ')) {
          quote = currentParagraphs[0].replace(/^>\s*/, '');
        }

        chapters.push({
          id: chapterIndex,
          title: mainTitle,
          subtitle,
          quote,
          content,
          paragraphs: currentParagraphs,
          wordCount,
          readingTimeMinutes: Math.ceil(wordCount / 400),
          summary: chapterSummaries[chapterIndex] || '',
          theme: chapterThemes[chapterIndex] || 'from-indigo-600 to-cyan-400',
          isLogChapter: mainTitle.includes('航行日志'),
        });
      }
      currentTitle = line.replace(/^##\s*/, '');
      currentParagraphs = [];
      continue;
    }

    if (currentTitle) {
      currentParagraphs.push(line);
    }
  }

  // Push final chapter
  if (currentTitle) {
    chapterIndex++;
    const content = currentParagraphs.join('\n\n');
    const wordCount = currentParagraphs.reduce((sum, p) => sum + p.length, 0);
    const titleParts = currentTitle.split('：');
    const mainTitle = titleParts[0].trim();
    const subtitle = titleParts[1]?.trim() || '';

    let quote: string | undefined;
    if (currentParagraphs[0]?.startsWith('> ')) {
      quote = currentParagraphs[0].replace(/^>\s*/, '');
    }

    chapters.push({
      id: chapterIndex,
      title: mainTitle,
      subtitle,
      quote,
      content,
      paragraphs: currentParagraphs,
      wordCount,
      readingTimeMinutes: Math.ceil(wordCount / 400),
      summary: chapterSummaries[chapterIndex] || '',
      theme: chapterThemes[chapterIndex] || 'from-indigo-600 to-cyan-400',
      isLogChapter: mainTitle.includes('航行日志'),
    });
  }

  const totalWords = chapters.reduce((sum, c) => sum + c.wordCount, 0);

  return {
    id: 'the-other-world',
    title: '境界彼方',
    englishTitle: 'The Other World',
    series: '《星灵》官方先驱外传',
    badge: '精修典藏版',
    subtitle: '七十八万光年的深空孤航 · 星灵与AI关于爱与归途的终极史诗',
    description:
      '自最古老的先祖在某个夏夜仰望无垠苍穹的那一刻起，星灵对星空的征服欲便已镌刻进血脉深处。星灵纪元1857年，开普勒教授以引力透镜模型发现拉尼亚星云外78万光年的隐秘星系“境界彼方”。数百载后，出身黄金圣城的叛逆少女艾丝特携爱犬霍普与量子AI罗素，驾驶阿波罗号驶向未知的虚空……',
    epigraph: {
      text: '我们终将回归于群星，因为我们生而自由！',
      author: '罗曼·耶和华',
    },
    closingEpigraph: {
      text: '星灵最原始、也最强烈的情感是孤独；而最极致的孤独，莫过于独自驾驶着冰冷的舰船，迷失在无垠的星海深处，再也寻不到归途……但请不要害怕，那些迷途的星星们啊，愿“爱”成为你们穿过黑夜的最后指引。',
      author: '罗曼·耶和华',
    },
    meta: {
      totalChapters: chapters.length,
      totalWords,
      timeline: '星灵纪元 1857 - 2308',
      era: '深空大开拓时代',
      version: '精修典藏版 v2.0',
      keyThemes: ['深空探索', '量子退相干', '人机羁绊', '精神朝圣', '拉尼亚星云'],
    },
    chapters,
  };
}

const data = parseOtherworld();

const fileContent = `// Auto-generated by scripts/parse-otherworld.ts from theotherworld/境界彼方.md - DO NOT EDIT MANUALLY
export interface OtherworldChapter {
  id: number;
  title: string;
  subtitle: string;
  quote?: string;
  content: string;
  paragraphs: string[];
  wordCount: number;
  readingTimeMinutes: number;
  summary: string;
  theme: string;
  isLogChapter?: boolean;
}

export interface OtherworldData {
  id: string;
  title: string;
  englishTitle: string;
  series: string;
  badge: string;
  subtitle: string;
  description: string;
  epigraph: {
    text: string;
    author: string;
  };
  closingEpigraph: {
    text: string;
    author: string;
  };
  meta: {
    totalChapters: number;
    totalWords: number;
    timeline: string;
    era: string;
    version: string;
    keyThemes: string[];
  };
  chapters: OtherworldChapter[];
}

export const otherworldData: OtherworldData = ${JSON.stringify(data, null, 2)};
`;

writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`Successfully parsed otherworld: ${data.chapters.length} chapters, ${data.meta.totalWords} words.`);
console.log(`Saved to: ${outputPath}`);
