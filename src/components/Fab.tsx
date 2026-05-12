import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { scenes } from "../data/programme";

type FabItem = { to: string; label: string };

const SECTIONS: FabItem[][] = [
  [
    { to: "/jour/day-2", label: "Jeudi" },
    { to: "/jour/day-3", label: "Vendredi" },
  ],
  scenes.map((s) => ({ to: `/scene/${s.slug}`, label: s.value })),
  [
    { to: "/decouvrir/moods", label: "Moods" },
    { to: "/decouvrir/genres", label: "Genres" },
  ],
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
          {SECTIONS.map((items, i) => (
            <div key={i} className="fab__section">
              {items.map((item) => (
                <NavLink key={item.to} to={item.to} className="fab__link">
                  {item.label}
                </NavLink>
              ))}
            </div>
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
