const segmenter = new Intl.Segmenter('sv-SE', { granularity: 'grapheme' });
const emojiPattern = /\p{Extended_Pictographic}|\p{Regional_Indicator}|\u20e3/u;
export function labelGlyphs(label: string) {
  return Array.from(segmenter.segment(label.toLocaleUpperCase('sv-SE')), ({ segment }) => ({ text: segment, emoji: emojiPattern.test(segment) }));
}
export function labelMetrics(label: string, count: number) {
  const glyphs = labelGlyphs(label);
  const width = glyphs.reduce((sum, glyph) => sum + (glyph.emoji ? 1.3 : .66), 0);
  const height = count === 1 ? 52 : 2 * 108 * Math.sin(Math.PI / count) * .8;
  const fontSize = Math.min(count > 16 ? 23 : count > 12 ? 28 : 34, 158 / Math.max(width, 1), height);
  return { glyphs, fontSize, emojiSize: Math.min(fontSize * 1.3, height, 52) };
}