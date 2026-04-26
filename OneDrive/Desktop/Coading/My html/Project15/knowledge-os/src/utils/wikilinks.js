const normalizeTitle = (title = "") =>
  (typeof title === "string" ? title : "").trim().toLowerCase();

export const parseLinks = (content = "") => {
  const text = typeof content === "string" ? content : "";

  return [...text.matchAll(/\[\[([^\]]+)\]\]/g)]
    .map((match) => match[1].trim())
    .filter(Boolean);
};

export const resolveLink = (title, notes = []) => {
  const normalized = normalizeTitle(title);
  return (
    notes.find((note) => normalizeTitle(note.title) === normalized) || null
  );
};

export const buildBacklinks = (notes = []) => {
  const backlinks = new Map();

  for (const note of notes) {
    backlinks.set(note.id, []);
  }

  for (const source of notes) {
    const targets = parseLinks(source.content);
    const seen = new Set();

    for (const targetTitle of targets) {
      const target = resolveLink(targetTitle, notes);
      if (!target || target.id === source.id || seen.has(target.id)) {
        continue;
      }

      backlinks.set(target.id, [
        ...(backlinks.get(target.id) || []),
        source.id,
      ]);
      seen.add(target.id);
    }
  }

  return backlinks;
};
