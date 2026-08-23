export interface ChapterInfo {
  id: string;
  title: string;
  subtitle: string;
  sceneKey: string;
  description: string;
  backgroundImage?: string;
  isDemo?: boolean;  // 标记为 demo 内容
}

/**
 * Chapter registry — add new chapters here.
 * Unlocked state comes from SaveSystem.completedChapters.
 */
export const CHAPTERS: ChapterInfo[] = [
  {
    id: 'chapter1',
    title: '第一章 · 为何而来',
    subtitle: '雪原诺克城',
    sceneKey: 'Chapter1Scene',
    description: '安培尔与艾莉丝降落诺克城，寻找传说中的星之键。一位神秘老者的出现，揭开了安培尔身世的序幕。',
    backgroundImage: 'bg_story03',
  },
  {
    id: 'chapter2',
    title: '第二章 · 冰封真相',
    subtitle: '地下遗迹',
    sceneKey: '',  // 尚未实现
    description: '星之键的线索指向诺克城地下的远古遗迹。冰之女皇的传说背后，隐藏着一个惊天秘密。',
    backgroundImage: 'bg_story07',
  },
  {
    id: 'chapter3',
    title: '第三章 · 星火重燃',
    subtitle: '圣皇战场',
    sceneKey: '',  // 尚未实现
    description: '千年前的圣皇战争真相逐渐浮出水面，安培尔必须做出改变命运的抉择。',
  },
];

/**
 * Get chapter by ID.
 */
export function getChapter(id: string): ChapterInfo | undefined {
  return CHAPTERS.find((ch) => ch.id === id);
}

/**
 * Get all chapters with unlock state.
 */
export function getChaptersWithState(completedChapters: string[]): (ChapterInfo & { unlocked: boolean; completed: boolean })[] {
  return CHAPTERS.map((ch, index) => {
    const completed = completedChapters.includes(ch.id);
    // First chapter always unlocked; others unlock when previous is completed
    const unlocked = index === 0 || completedChapters.includes(CHAPTERS[index - 1].id);
    return { ...ch, unlocked, completed };
  });
}
