import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULTS } from "../data/defaults";
import { parseTags } from "../utils/tags";
import { uid } from "../utils/uid";

export const STORAGE_KEY = "kos_notes_v1";

const normalizeText = (value, fallback = "") =>
  typeof value === "string" ? value : fallback;

const sanitizeIncoming = (notes) => {
  const now = Date.now();
  const seenIds = new Set();

  return notes.filter(Boolean).map((note) => {
    const content = normalizeText(note.content);
    const created = Number(note.created);
    const updated = Number(note.updated);
    const candidateId = normalizeText(note.id).trim();

    let id = candidateId;
    if (!id || seenIds.has(id)) {
      id = uid();
      while (seenIds.has(id)) {
        id = uid();
      }
    }

    seenIds.add(id);

    return {
      id,
      title:
        normalizeText(note.title, "Untitled Note").trim() || "Untitled Note",
      content,
      tags: parseTags(content),
      created: Number.isFinite(created) && created > 0 ? created : now,
      updated: Number.isFinite(updated) && updated > 0 ? updated : now,
    };
  });
};

const persistNotes = (notes) => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return false;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch {
    return false;
  }
};

const loadNotes = () => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return DEFAULTS;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULTS;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return DEFAULTS;
    }

    return sanitizeIncoming(parsed);
  } catch {
    return DEFAULTS;
  }
};

const createInitialState = () => {
  const notes = loadNotes();
  return {
    notes,
    activeId: notes[0]?.id || "",
  };
};

export const useNotes = () => {
  const [state, setState] = useState(createInitialState);
  const { notes, activeId } = state;

  const setNotes = useCallback((value) => {
    setState((current) => {
      const nextNotes =
        typeof value === "function" ? value(current.notes) : value;
      const nextActiveId = nextNotes.some(
        (note) => note.id === current.activeId,
      )
        ? current.activeId
        : nextNotes[0]?.id || "";

      return {
        notes: nextNotes,
        activeId: nextActiveId,
      };
    });
  }, []);

  const setActiveId = useCallback((value) => {
    setState((current) => {
      const requestedId =
        typeof value === "function" ? value(current.activeId) : value;
      const nextActiveId = current.notes.some((note) => note.id === requestedId)
        ? requestedId
        : current.notes[0]?.id || "";

      if (nextActiveId === current.activeId) {
        return current;
      }

      return {
        ...current,
        activeId: nextActiveId,
      };
    });
  }, []);

  const active = useMemo(
    () => notes.find((note) => note.id === activeId),
    [activeId, notes],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      persistNotes(notes);
    }, 400);

    return () => clearTimeout(timer);
  }, [notes]);

  const createNote = useCallback(() => {
    const timestamp = Date.now();
    const newNote = {
      id: uid(),
      title: "Untitled Note",
      content: "# Untitled Note\n\n",
      tags: [],
      created: timestamp,
      updated: timestamp,
    };

    setState((prev) => ({
      notes: [newNote, ...prev.notes],
      activeId: newNote.id,
    }));
    return newNote;
  }, []);

  const updateNote = useCallback((id, patch) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((note) => {
        if (note.id !== id) {
          return note;
        }

        const next = {
          ...note,
          ...patch,
          updated: Date.now(),
        };

        const content = normalizeText(next.content);
        return {
          ...next,
          content,
          tags: parseTags(content),
        };
      }),
    }));
  }, []);

  const deleteNote = useCallback(
    (id) => {
      setNotes((prev) => prev.filter((note) => note.id !== id));
    },
    [setNotes],
  );

  const importNotes = useCallback((incomingNotes) => {
    if (!Array.isArray(incomingNotes)) {
      return false;
    }

    const nextNotes = sanitizeIncoming(incomingNotes);
    setState({
      notes: nextNotes,
      activeId: nextNotes[0]?.id || "",
    });
    return true;
  }, []);

  const exportNotes = useCallback(
    () => JSON.stringify(notes, null, 2),
    [notes],
  );

  const saveNotes = useCallback(() => persistNotes(notes), [notes]);

  return {
    notes,
    activeId,
    active,
    setActiveId,
    createNote,
    updateNote,
    deleteNote,
    importNotes,
    exportNotes,
    saveNotes,
  };
};
