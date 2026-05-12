import { useEffect, useState } from "react";
import { getDebugNow, setDebugNow, useNow } from "../data/now";

function toLocalInput(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

export function DebugPanel() {
  const now = useNow();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(() => toLocalInput(now));
  const overridden = getDebugNow() !== null;

  useEffect(() => {
    if (!overridden) setValue(toLocalInput(now));
  }, [now, overridden]);

  const apply = () => {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) setDebugNow(d);
  };

  return (
    <div className={`debug${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="debug__toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`debug__indicator${overridden ? " is-fake" : ""}`} />
        {now.toLocaleString("fr-FR", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </button>
      {open && (
        <div className="debug__panel">
          <input
            type="datetime-local"
            className="debug__input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button type="button" className="debug__btn" onClick={apply}>
            Appliquer
          </button>
          <button
            type="button"
            className="debug__btn"
            onClick={() => setDebugNow(null)}
            disabled={!overridden}
          >
            Réel
          </button>
        </div>
      )}
    </div>
  );
}
