import { useMemo, useRef, useState } from "react";

const buildNextValue = (value, start, end, replacement) => {
  return `${value.slice(0, start)}${replacement}${value.slice(end)}`;
};

const getAutocomplete = (value, cursor, notes) => {
  const before = value.slice(0, cursor);
  const start = before.lastIndexOf("[[");

  if (start < 0) {
    return null;
  }

  const close = before.lastIndexOf("]]", cursor);
  if (close > start) {
    return null;
  }

  const fragment = before.slice(start + 2);
  if (/\n/.test(fragment)) {
    return null;
  }

  const normalizedFragment = fragment.trim().toLowerCase();
  const options = notes
    .filter((note) =>
      (typeof note.title === "string" ? note.title : "")
        .toLowerCase()
        .includes(normalizedFragment),
    )
    .slice(0, 8);

  return {
    start,
    cursor,
    fragment,
    options,
  };
};

export default function NoteEditor({ value, onChange, notes }) {
  const ref = useRef(null);
  const [cursor, setCursor] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const autocomplete = useMemo(
    () => getAutocomplete(value, cursor, notes),
    [cursor, notes, value],
  );

  const selectedIndex = autocomplete?.options.length
    ? Math.min(activeIndex, autocomplete.options.length - 1)
    : 0;

  const updateCursor = () => {
    const element = ref.current;
    if (element) {
      setCursor(element.selectionStart);
    }
  };

  const restoreCursor = (element, nextCursor) => {
    requestAnimationFrame(() => {
      element.focus();
      element.setSelectionRange(nextCursor, nextCursor);
      setCursor(nextCursor);
    });
  };

  const applyAutocomplete = (title) => {
    const element = ref.current;
    if (!element || !autocomplete) {
      return;
    }

    const replacement = `[[${title}]]`;
    const next = buildNextValue(
      value,
      autocomplete.start,
      autocomplete.cursor,
      replacement,
    );
    const cursor = autocomplete.start + replacement.length;

    onChange(next);
    restoreCursor(element, cursor);
    setActiveIndex(0);
  };

  const onValueChange = (event) => {
    onChange(event.target.value);
    setCursor(event.target.selectionStart);
    setActiveIndex(0);
  };

  const onKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const element = ref.current;
      if (!element) return;
      const { selectionStart, selectionEnd } = element;
      const next = buildNextValue(value, selectionStart, selectionEnd, "  ");
      onChange(next);
      restoreCursor(element, selectionStart + 2);
      return;
    }

    if (
      event.key === "[" &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      const element = ref.current;
      if (!element) return;

      const { selectionStart, selectionEnd } = element;
      if (
        selectionStart === selectionEnd &&
        value[selectionStart - 1] === "["
      ) {
        event.preventDefault();
        const next = buildNextValue(value, selectionStart, selectionEnd, "[]]");
        onChange(next);
        restoreCursor(element, selectionStart);
        return;
      }
    }

    if (!autocomplete) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((idx) => {
        const max = Math.max(autocomplete.options.length - 1, 0);
        return Math.min(idx + 1, max);
      });
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((idx) => Math.max(idx - 1, 0));
      return;
    }

    if (event.key === "Escape") {
      setActiveIndex(0);
      return;
    }

    if (event.key === "Enter" && autocomplete.options.length > 0) {
      event.preventDefault();
      applyAutocomplete(
        autocomplete.options[selectedIndex]?.title ||
          autocomplete.options[0].title,
      );
    }
  };

  return (
    <div className="editor-wrap">
      <textarea
        ref={ref}
        className="note-editor"
        value={value}
        onChange={onValueChange}
        onClick={updateCursor}
        onKeyDown={onKeyDown}
        onKeyUp={updateCursor}
        onSelect={updateCursor}
        onFocus={updateCursor}
        aria-label="Note content"
        spellCheck
        placeholder="Start writing... use [[Note Title]] and #tags"
      />

      {autocomplete && autocomplete.options.length > 0 && (
        <div className="autocomplete-popup" role="listbox">
          {autocomplete.options.map((note, idx) => (
            <button
              type="button"
              key={note.id}
              role="option"
              aria-selected={idx === selectedIndex}
              className={idx === selectedIndex ? "active" : ""}
              onMouseDown={(event) => {
                event.preventDefault();
                applyAutocomplete(note.title);
              }}
            >
              {note.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
