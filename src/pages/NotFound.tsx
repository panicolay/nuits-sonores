import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div>
      <h1>Page introuvable</h1>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
}
