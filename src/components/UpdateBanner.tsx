import { useState } from "react";
import { usePwaUpdater } from "../pwa";

export function UpdateBanner() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = usePwaUpdater();
  const [busy, setBusy] = useState(false);

  if (!needRefresh) return null;

  const onReload = async () => {
    setBusy(true);
    await updateServiceWorker(true);
  };

  return (
    <div className="update-banner" role="status">
      <span className="update-banner__text">Nouvelle version disponible.</span>
      <div className="update-banner__actions">
        <button
          type="button"
          className="update-banner__btn update-banner__btn--primary"
          onClick={onReload}
          disabled={busy}
        >
          {busy ? "Mise à jour…" : "Recharger"}
        </button>
        <button
          type="button"
          className="update-banner__btn"
          onClick={() => setNeedRefresh(false)}
          disabled={busy}
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}
