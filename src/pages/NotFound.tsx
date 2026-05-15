import { Link } from "react-router-dom";
import { usePageTitle } from "../components/PageTitle";

export function NotFound() {
  usePageTitle("Page introuvable");
  return (
    <div>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
}
