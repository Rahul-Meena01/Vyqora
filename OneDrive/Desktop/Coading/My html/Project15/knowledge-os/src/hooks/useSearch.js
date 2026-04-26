import { useMemo, useState } from "react";
import Fuse from "fuse.js";

const fuseConfig = {
  keys: [
    { name: "title", weight: 0.6 },
    { name: "content", weight: 0.3 },
    { name: "tags", weight: 0.1 },
  ],
  threshold: 0.35,
  includeScore: true,
};

export const useSearch = (notes) => {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => new Fuse(notes, fuseConfig), [notes]);

  const results = useMemo(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return notes;
    }

    return fuse.search(trimmedQuery).map((result) => result.item);
  }, [fuse, notes, query]);

  return { results, query, setQuery };
};
