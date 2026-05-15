import { Link } from "react-router-dom";
import { usePageTitleValue } from "./PageTitle";

export function Header() {
  const title = usePageTitleValue();
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        NS26
      </Link>
      {title && (
        <>
          <span className="header__separator" aria-hidden>
            |
          </span>
          <span className="header__title">{title}</span>
        </>
      )}
    </header>
  );
}
