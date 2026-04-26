import TagCloud from "./TagCloud";

const relativeTime = (timestamp) => {
  const deltaSec = Math.floor((Date.now() - timestamp) / 1000);

  if (deltaSec < 60) return "just now";
  if (deltaSec < 3600) return `${Math.floor(deltaSec / 60)}m ago`;
  if (deltaSec < 86400) return `${Math.floor(deltaSec / 3600)}h ago`;
  return `${Math.floor(deltaSec / 86400)}d ago`;
};

export default function Sidebar({
  notes,
  filteredNotes,
  activeId,
  onSelect,
  onCreate,
  query,
  onQueryChange,
  tags,
  activeTag,
  onTagChange,
  isOpen,
  isGraph,
  onGraphToggle,
  searchInputRef,
}) {
  return (
    <aside
      className={`sidebar ${isOpen ? "open" : "collapsed"}`}
      aria-label="Notes sidebar"
      aria-hidden={!isOpen}
    >
      <div className="sidebar-header">
        <div className="sidebar-logo-row">
          <div className="sidebar-logo-mark">K</div>
          <div>
            <div className="sidebar-logo-title">KnowledgeOS</div>
            <div className="sidebar-logo-sub">{notes.length} notes</div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary sidebar-new"
          onClick={onCreate}
        >
          + New Note
        </button>

        <div className="search-wrap">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            ref={searchInputRef}
            id="search-notes"
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            aria-label="Search notes"
            placeholder="Search notes..."
          />
        </div>
      </div>

      <div className="sidebar-body">
        <div className="section-title">Tags</div>
        <TagCloud tags={tags} activeTag={activeTag} onTagClick={onTagChange} />

        <div className="section-title notes-title-row">
          <span>
            {activeTag ? `#${activeTag}` : query.trim() ? "Results" : "Recent"}
          </span>
          <span>{filteredNotes.length}</span>
        </div>

        <div className="note-list">
          {filteredNotes.map((note) => (
            <button
              type="button"
              key={note.id}
              className={`note-row ${note.id === activeId ? "active" : ""}`}
              onClick={() => onSelect(note.id)}
              aria-current={note.id === activeId ? "true" : undefined}
            >
              <span className="note-row-title">
                {note.title || "Untitled Note"}
              </span>
              <span className="note-row-time">
                {relativeTime(note.updated)}
              </span>
            </button>
          ))}
          {!filteredNotes.length && (
            <div className="empty-state">No notes found.</div>
          )}
        </div>
      </div>

      <div className="sidebar-footer">
        <button
          type="button"
          className={`btn ${isGraph ? "btn-primary" : "btn-ghost"}`}
          onClick={onGraphToggle}
          aria-pressed={isGraph}
        >
          Graph View
        </button>
      </div>
    </aside>
  );
}
