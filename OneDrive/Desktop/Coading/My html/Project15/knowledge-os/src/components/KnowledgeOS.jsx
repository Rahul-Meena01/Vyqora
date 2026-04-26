import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BacklinksPanel from "./BacklinksPanel";
import GraphView from "./GraphView";
import MarkdownPreview from "./MarkdownPreview";
import NoteEditor from "./NoteEditor";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useNotes } from "../hooks/useNotes";
import { useSearch } from "../hooks/useSearch";
import { useShortcuts } from "../hooks/useShortcuts";
import { getTagFrequency, parseTags } from "../utils/tags";
import { buildBacklinks, parseLinks, resolveLink } from "../utils/wikilinks";

const contentWords = (content = "") =>
  content.trim().split(/\s+/).filter(Boolean).length;

const copyTextToClipboard = async (text) => {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  return false;
};

export default function KnowledgeOS() {
  const {
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
  } = useNotes();

  const { results, query, setQuery } = useSearch(notes);

  const [mode, setMode] = useState("edit");
  const [showGraph, setShowGraph] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return true;
    }

    return !window.matchMedia("(max-width: 720px)").matches;
  });
  const [activeTag, setActiveTag] = useState(null);
  const [toast, setToast] = useState("");

  const searchInputRef = useRef(null);
  const undoStacksRef = useRef({});
  const undoInProgressRef = useRef(false);
  const toastTimerRef = useRef(0);

  const backlinks = useMemo(() => buildBacklinks(notes), [notes]);
  const tagFrequency = useMemo(() => getTagFrequency(notes), [notes]);

  const filteredByTag = useMemo(() => {
    if (!activeTag) {
      return results;
    }
    return results.filter((note) =>
      parseTags(note.content).includes(activeTag),
    );
  }, [activeTag, results]);

  const sortedNotes = useMemo(() => {
    return [...filteredByTag].sort((a, b) => b.updated - a.updated);
  }, [filteredByTag]);

  const incoming = useMemo(() => {
    if (!active) {
      return [];
    }

    const incomingIds = backlinks.get(active.id) || [];
    return incomingIds
      .map((id) => notes.find((note) => note.id === id))
      .filter(Boolean);
  }, [active, backlinks, notes]);

  const outgoing = useMemo(() => {
    if (!active) {
      return [];
    }

    return parseLinks(active.content).map((title, index) => ({
      title,
      index,
      note: resolveLink(title, notes),
    }));
  }, [active, notes]);

  const notify = useCallback((message) => {
    setToast(message);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(""), 1800);
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(toastTimerRef.current);
  }, []);

  const openOrCreateLink = useCallback((title) => {
    const found = resolveLink(title, notes);
    if (found) {
      setActiveId(found.id);
      setShowGraph(false);
      setMode("edit");
      return found;
    }

    const created = createNote();
    updateNote(created.id, {
      title: title.trim() || "Untitled Note",
      content: `# ${title.trim() || "Untitled Note"}\n\n`,
    });
    setActiveId(created.id);
    setShowGraph(false);
    setMode("edit");
    notify(`Created new note: '${title.trim() || "Untitled Note"}'`);
    return created;
  }, [createNote, notes, notify, setActiveId, updateNote]);

  const handleCreateNote = useCallback(() => {
    createNote();
    setMode("edit");
    setShowGraph(false);
  }, [createNote]);

  const handleDeleteNote = useCallback(() => {
    if (!activeId) {
      return;
    }
    deleteNote(activeId);
    notify("Note deleted");
  }, [activeId, deleteNote, notify]);

  const pushUndoState = useCallback((noteId, previousContent) => {
    if (!noteId || undoInProgressRef.current) {
      return;
    }

    if (!undoStacksRef.current[noteId]) {
      undoStacksRef.current[noteId] = [];
    }

    undoStacksRef.current[noteId].push(previousContent);
    if (undoStacksRef.current[noteId].length > 120) {
      undoStacksRef.current[noteId].shift();
    }
  }, []);

  const handleContentChange = useCallback((nextContent) => {
    if (!active) {
      return;
    }

    if (nextContent !== active.content) {
      pushUndoState(active.id, active.content);
      updateNote(active.id, { content: nextContent });
    }
  }, [active, pushUndoState, updateNote]);

  const undoContent = useCallback(() => {
    if (!active) {
      return;
    }

    const stack = undoStacksRef.current[active.id] || [];
    if (!stack.length) {
      return;
    }

    const previous = stack.pop();
    undoInProgressRef.current = true;
    updateNote(active.id, { content: previous });
    undoInProgressRef.current = false;
    notify("Undid last content change");
  }, [active, notify, updateNote]);

  const forceSave = useCallback(() => {
    notify(saveNotes() ? "Saved" : "Save failed");
  }, [notify, saveNotes]);

  const handleImport = useCallback(() => {
    const raw = window.prompt("Paste exported notes JSON");
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      notify(importNotes(parsed) ? "Imported notes" : "Import failed");
    } catch {
      notify("Import failed");
    }
  }, [importNotes, notify]);

  const handleExport = useCallback(async () => {
    const text = exportNotes();
    try {
      const copied = await copyTextToClipboard(text);
      if (copied) {
        notify("Export copied to clipboard");
        return;
      }
    } catch {
      // Fall back to a selectable prompt below when clipboard permission fails.
    }

    window.prompt("Copy exported notes JSON", text);
    notify("Export ready to copy");
  }, [exportNotes, notify]);

  const handleSidebarSelect = useCallback((id) => {
    setActiveId(id);
    setShowGraph(false);
  }, [setActiveId]);

  const handleGraphNavigate = useCallback((id) => {
    setActiveId(id);
    setShowGraph(false);
  }, [setActiveId]);

  const handleBacklinkNavigate = useCallback((id) => {
    setActiveId(id);
    setMode("edit");
  }, [setActiveId]);

  useShortcuts([
    {
      key: "n",
      ctrlOrMeta: true,
      handler: handleCreateNote,
    },
    {
      key: "f",
      ctrlOrMeta: true,
      handler: () => {
        setSidebarOpen(true);
        window.requestAnimationFrame(() => searchInputRef.current?.focus());
      },
    },
    {
      key: "z",
      ctrlOrMeta: true,
      handler: undoContent,
      allowWhileTyping: true,
    },
    {
      key: "Escape",
      handler: () => {
        setQuery("");
        setActiveTag(null);
      },
      allowWhileTyping: true,
    },
    {
      key: "s",
      ctrlOrMeta: true,
      handler: forceSave,
      allowWhileTyping: true,
    },
    {
      key: "g",
      ctrlOrMeta: true,
      shift: true,
      handler: () => setShowGraph((prev) => !prev),
      allowWhileTyping: true,
    },
  ]);

  if (!active) {
    return (
      <main className="app-root empty-root">
        <div className="empty-card">
          <h1>KnowledgeOS</h1>
          <p>No notes found.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCreateNote}
          >
            Create First Note
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="app-root">
      <Sidebar
        notes={notes}
        filteredNotes={sortedNotes}
        activeId={active.id}
        onSelect={handleSidebarSelect}
        onCreate={handleCreateNote}
        query={query}
        onQueryChange={setQuery}
        tags={tagFrequency}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        isOpen={sidebarOpen}
        isGraph={showGraph}
        onGraphToggle={() => setShowGraph((prev) => !prev)}
        searchInputRef={searchInputRef}
      />

      <section className="main-column">
        <Topbar
          title={active.title}
          onTitleChange={(title) => updateNote(active.id, { title })}
          wordCount={contentWords(active.content)}
          linkCount={parseLinks(active.content).length}
          updated={active.updated}
          mode={mode}
          onModeChange={setMode}
          onDelete={handleDeleteNote}
          onSidebarToggle={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="toolbar-row">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleImport}
          >
            Import JSON
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleExport}
          >
            Export JSON
          </button>
        </div>

        {showGraph ? (
          <GraphView
            notes={notes}
            onNavigate={handleGraphNavigate}
          />
        ) : (
          <div className="content-pane">
            <div className="editor-pane">
              {mode === "edit" ? (
                <NoteEditor
                  value={active.content}
                  onChange={handleContentChange}
                  notes={notes}
                />
              ) : (
                <MarkdownPreview
                  content={active.content}
                  onWikiLinkClick={openOrCreateLink}
                />
              )}
            </div>

            <BacklinksPanel
              incoming={incoming}
              outgoing={outgoing}
              onNavigate={handleBacklinkNavigate}
              onResolveLink={openOrCreateLink}
            />
          </div>
        )}
      </section>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </main>
  );
}
