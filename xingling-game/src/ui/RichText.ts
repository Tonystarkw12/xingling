/**
 * Rich text parser for dialogue — highlights special terms, names, emotions.
 *
 * Supported syntax in dialogue strings:
 *   「quoted text」   → golden italic
 *   《book/title》    → cyan
 *   【emphasis】      → red bold
 *   *emote*           → purple italic
 *   ~whisper~         → gray small
 *
 * Special terms are auto-highlighted based on a dictionary.
 */

export interface RichTextSegment {
  text: string;
  color?: string;
  fontStyle?: string;
  fontSize?: string;
  scale?: number;
  alpha?: number;
}

// ── Auto-highlight dictionary ──
// Terms that should always be visually distinct in dialogue.
const TERM_RULES: { pattern: RegExp; color: string; style?: string }[] = [
  // Names (always golden)
  { pattern: /安培尔/g, color: '#fbbf24', style: 'bold' },
  { pattern: /艾莉丝/g, color: '#93c5fd', style: 'bold' },
  { pattern: /凯奥斯/g, color: '#c4b5fd', style: 'bold' },
  { pattern: /彼得/g, color: '#d4d4d8', style: 'bold' },
  { pattern: /托尼/g, color: '#fde68a', style: 'bold' },

  // Key lore terms (cyan/gold)
  { pattern: /星之键/g, color: '#fde047', style: 'bold' },
  { pattern: /星灵/g, color: '#a78bfa', style: 'bold' },
  { pattern: /圣皇战争/g, color: '#f87171', style: 'bold' },
  { pattern: /冰之女皇/g, color: '#67e8f9', style: 'bold' },
  { pattern: /诺克城/g, color: '#e2e8f0' },
  { pattern: /卡达列夫/g, color: '#e2e8f0' },
  { pattern: /红场/g, color: '#e2e8f0' },

  // Form/ability terms
  { pattern: /电磁系/g, color: '#fbbf24' },
  { pattern: /冰霜系/g, color: '#67e8f9' },
  { pattern: /ALE/g, color: '#ec4899', style: 'bold' },
  { pattern: /BSE/g, color: '#94a3b8', style: 'bold' },
  { pattern: /星化/g, color: '#fde047', style: 'bold' },
  { pattern: /权能/g, color: '#c4b5fd' },

  // Battle terms
  { pattern: /格挡/g, color: '#60a5fa' },
  { pattern: /中毒/g, color: '#22c55e' },
  { pattern: /灼烧/g, color: '#f97316' },
  { pattern: /虚弱/g, color: '#60a5fa' },
  { pattern: /易伤/g, color: '#f87171' },
];

// ── Inline markup patterns ──
const MARKUP_PATTERNS: { regex: RegExp; color: string; style?: string; fontSize?: string }[] = [
  { regex: /「([^」]+)」/g, color: '#fde68a', style: 'italic' },           // Quotes
  { regex: /《([^》]+)》/g, color: '#67e8f9' },                             // Titles
  { regex: /【([^】]+)】/g, color: '#f87171', style: 'bold' },             // Emphasis
  { regex: /\*([^*]+)\*/g, color: '#c4b5fd', style: 'italic' },            // Emote
  { regex: /~([^~]+)~/g, color: '#6b7280', fontSize: '15px' },             // Whisper
];

/**
 * Parse raw dialogue text into styled segments.
 */
export function parseRichText(raw: string): RichTextSegment[] {
  // First pass: extract inline markup into placeholders
  const placeholders: { replacement: string; segments: RichTextSegment[] }[] = [];
  let processed = raw;

  for (const markup of MARKUP_PATTERNS) {
    processed = processed.replace(markup.regex, (match, inner) => {
      const idx = placeholders.length;
      const seg: RichTextSegment = {
        text: inner,
        color: markup.color,
        fontStyle: markup.style,
        fontSize: markup.fontSize,
      };
      placeholders.push({ replacement: `__PH${idx}__`, segments: [seg] });
      return `__PH${idx}__`;
    });
  }

  // Second pass: split by term dictionary and placeholders
  const segments: RichTextSegment[] = [];
  const parts = splitByTerms(processed);

  for (const part of parts) {
    // Check if this part is a placeholder
    const phMatch = part.match(/^__PH(\d+)__$/);
    if (phMatch) {
      const idx = parseInt(phMatch[1]);
      if (placeholders[idx]) {
        segments.push(...placeholders[idx].segments);
      }
      continue;
    }

    if (part.length === 0) continue;

    // Check against term dictionary
    const termRule = TERM_RULES.find((rule) => rule.pattern.test(part));
    if (termRule) {
      // Reset regex lastIndex since we used .test()
      termRule.pattern.lastIndex = 0;
      segments.push({
        text: part,
        color: termRule.color,
        fontStyle: termRule.style,
      });
    } else {
      segments.push({ text: part });
    }
  }

  return segments;
}

/**
 * Split text by all known term patterns, preserving the terms.
 */
function splitByTerms(text: string): string[] {
  // Build a combined regex from all term patterns
  const combined = TERM_RULES.map((r) => {
    // Reset lastIndex
    r.pattern.lastIndex = 0;
    return r.pattern.source;
  }).join('|');

  if (!combined) return [text];

  const regex = new RegExp(`(${combined})`, 'g');
  return text.split(regex).filter((s) => s.length > 0);
}

/**
 * Get the total character count for typewriter timing.
 * Placeholders count as their inner text length.
 */
export function getRichTextLength(raw: string): number {
  return parseRichText(raw).reduce((sum, seg) => sum + seg.text.length, 0);
}
