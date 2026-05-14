import { useState } from "react";
import { forceReload, usePwaUpdater } from "../pwa";

export function UpdateBanner() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = usePwaUpdater();
  const [busy, setBusy] = useState<"update" | "force" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onReload = async () => {
    setBusy("update");
    await updateServiceWorker(true);
  };

  const onForce = async () => {
    setBusy("force");
    setError(null);
    const result = await forceReload();
    if (!result.ok) {
      setBusy(null);
      setError(
        result.reason === "offline"
          ? "Pas de connexion."
          : "Réseau indisponible.",
      );
    }
  };

  if (needRefresh) {
    return (
      <div className="update-banner" role="status">
        <span className="update-banner__text">Nouvelle version disponible.</span>
        <div className="update-banner__actions">
          <button
            type="button"
            className="update-banner__btn update-banner__btn--primary"
            onClick={onReload}
            disabled={busy !== null}
          >
            {busy === "update" ? "Mise à jour…" : "Recharger"}
          </button>
          <button
            type="button"
            className="update-banner__btn"
            onClick={() => setNeedRefresh(false)}
            disabled={busy !== null}
            aria-label="Ignorer"
          >
            Plus tard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="update-footer">
      <button
        type="button"
        className="update-footer__btn"
        onClick={onForce}
        disabled={busy === "force"}
      >
        {busy === "force" ? "Mise à jour…" : "Forcer la mise à jour"}
      </button>
      {error && <span className="update-footer__error">{error}</span>}
    </div>
  );
}
