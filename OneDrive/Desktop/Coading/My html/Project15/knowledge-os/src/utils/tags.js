export const parseTags = (content = "") => {
  const text = typeof content === "string" ? content : "";

  return [...text.matchAll(/#([a-zA-Z0-9_-]+)/g)].map((match) =>
    match[1].toLowerCase(),
  );
};

export const getTagFrequency = (notes = []) => {
  const freq = new Map();

  for (const note of notes) {
    for (const tag of parseTags(note.content)) {
      freq.set(tag, (freq.get(tag) || 0) + 1);
    }
  }

  return [...freq.entries()].sort((a, b) => b[1] - a[1]);
};
