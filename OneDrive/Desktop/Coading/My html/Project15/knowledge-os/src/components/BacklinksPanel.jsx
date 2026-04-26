export default function BacklinksPanel({
  incoming,
  outgoing,
  onNavigate,
  onResolveLink,
}) {
  if (!incoming.length && !outgoing.length) {
    return null;
  }

  return (
    <aside className="backlinks-panel" aria-label="Backlinks">
      {!!incoming.length && (
        <section>
          <div className="section-title">Linked here ({incoming.length})</div>
          <div className="backlink-list">
            {incoming.map((note) => (
              <button
                type="button"
                key={note.id}
                className="backlink-item"
                onClick={() => onNavigate(note.id)}
              >
                <span>{note.title}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {!!outgoing.length && (
        <section>
          <div className="section-title">
            Outgoing links ({outgoing.length})
          </div>
          <div className="backlink-list">
            {outgoing.map((target) => {
              const exists = Boolean(target.note);

              return (
                <button
                  type="button"
                  key={`${target.title}-${target.index}`}
                  className={`backlink-item ${exists ? "valid" : "missing"}`}
                  onClick={() => {
                    if (target.note) {
                      onNavigate(target.note.id);
                      return;
                    }
                    onResolveLink(target.title);
                  }}
                >
                  <span>{target.title}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </aside>
  );
}
