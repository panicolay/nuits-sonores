import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        Nuits Sonores 2026
      </Link>
    </header>
  );
}
