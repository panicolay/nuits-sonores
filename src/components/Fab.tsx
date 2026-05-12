import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const ITEMS = [
  { to: "/jour/day-2", label: "Jour 2" },
  { to: "/jour/day-3", label: "Jour 3" },
  { to: "/decouvrir/moods", label: "Moods" },
  { to: "/decouvrir/genres", label: "Genres" },
];

export function Fab() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (pathname === "/") return null;

  return (
    <>
      {open && (
        <button
          type="button"
          className="fab__backdrop"
          aria-label="Fermer le menu"
          onClick={() => setOpen(false)}
        />
      )}
      {open && (
        <nav className="fab__menu" aria-label="Navigation principale">
          {ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className="fab__link">
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
      <button
        type="button"
        className="fab"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`fab__icon${open ? " is-open" : ""}`} />
      </button>
    </>
  );
}
