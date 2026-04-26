export default function TagCloud({ tags, activeTag, onTagClick }) {
  if (!tags.length) {
    return null;
  }

  return (
    <div className="tag-cloud">
      {tags.map(([tag, count]) => (
        <button
          type="button"
          key={tag}
          className={`tag-cloud-item ${activeTag === tag ? "active" : ""}`}
          onClick={() => onTagClick(activeTag === tag ? null : tag)}
          aria-pressed={activeTag === tag}
        >
          #{tag} <span>{count}</span>
        </button>
      ))}
    </div>
  );
}
