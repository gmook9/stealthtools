/**
 * Lorem ipsum generator. Deterministic given the same RNG seed for tests.
 */

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum",
];

export type LoremOptions = {
  count: number;
  unit: "words" | "sentences" | "paragraphs";
  startWithLorem?: boolean;
};

const mulberry32 = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const pickWord = (rand: () => number) => WORDS[Math.floor(rand() * WORDS.length)];

const buildSentence = (rand: () => number, length: number): string => {
  const words: string[] = [];
  for (let i = 0; i < length; i += 1) words.push(pickWord(rand));
  if (words.length > 0) words[0] = words[0][0].toUpperCase() + words[0].slice(1);
  return `${words.join(" ")}.`;
};

export function generateLorem(options: LoremOptions, seed = 42): string {
  const rand = mulberry32(seed);
  const count = Math.max(0, Math.floor(options.count));
  if (count === 0) return "";
  if (options.unit === "words") {
    const words: string[] = [];
    for (let i = 0; i < count; i += 1) words.push(pickWord(rand));
    if (options.startWithLorem !== false) {
      words.splice(0, Math.min(5, words.length), "Lorem", "ipsum", "dolor", "sit", "amet");
      words.length = count;
    }
    if (words.length > 0) words[0] = words[0][0].toUpperCase() + words[0].slice(1);
    return words.join(" ");
  }
  if (options.unit === "sentences") {
    const sentences: string[] = [];
    for (let i = 0; i < count; i += 1) {
      const length = 6 + Math.floor(rand() * 12);
      sentences.push(buildSentence(rand, length));
    }
    if (options.startWithLorem !== false && sentences.length > 0) {
      sentences[0] = `Lorem ipsum dolor sit amet, ${buildSentence(rand, 8).toLowerCase()}`;
    }
    return sentences.join(" ");
  }
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const sentenceCount = 3 + Math.floor(rand() * 5);
    const sentences: string[] = [];
    for (let j = 0; j < sentenceCount; j += 1) {
      const length = 6 + Math.floor(rand() * 12);
      sentences.push(buildSentence(rand, length));
    }
    paragraphs.push(sentences.join(" "));
  }
  if (options.startWithLorem !== false && paragraphs.length > 0) {
    paragraphs[0] = `Lorem ipsum dolor sit amet, ${paragraphs[0].toLowerCase()}`;
  }
  return paragraphs.join("\n\n");
}
