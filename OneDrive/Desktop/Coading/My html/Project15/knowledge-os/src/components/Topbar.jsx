const formatUpdatedDate = (timestamp) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function Topbar({
  title,
  onTitleChange,
  wordCount,
  linkCount,
  updated,
  mode,
  onModeChange,
  onDelete,
  onSidebarToggle,
}) {
  return (
    <div className="topbar">
      <button
        type="button"
        className="icon-btn"
        onClick={onSidebarToggle}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <input
        className="topbar-title"
        type="text"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        aria-label="Note title"
        placeholder="Note title"
      />

      <div className="topbar-stats">
        <span>{wordCount}w</span>
        <span>{linkCount} links</span>
        <span>{formatUpdatedDate(updated)}</span>
      </div>

      <div className="topbar-divider" />

      <div className="mode-toggle" role="group" aria-label="Editor mode">
        <button
          type="button"
          className={`btn ${mode === "edit" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => onModeChange("edit")}
          aria-pressed={mode === "edit"}
        >
          Edit
        </button>
        <button
          type="button"
          className={`btn ${mode === "preview" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => onModeChange("preview")}
          aria-pressed={mode === "preview"}
        >
          Preview
        </button>
      </div>

      <button
        type="button"
        className="icon-btn danger"
        onClick={onDelete}
        aria-label="Delete note"
      >
        ✕
      </button>
    </div>
  );
}
