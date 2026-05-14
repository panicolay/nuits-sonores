import { useRegisterSW } from "virtual:pwa-register/react";

const UPDATE_CHECK_INTERVAL_MS = 30 * 60 * 1000;

export function usePwaUpdater() {
  return useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      window.setInterval(() => {
        if (registration.installing || !navigator.onLine) return;
        registration.update().catch(() => {
          /* silent: offline or transient network error, will retry next tick */
        });
      }, UPDATE_CHECK_INTERVAL_MS);
    },
  });
}

export async function forceReload(): Promise<
  { ok: true } | { ok: false; reason: "offline" | "unreachable" }
> {
  if (!navigator.onLine) return { ok: false, reason: "offline" };

  try {
    const probe = await fetch("/", { method: "HEAD", cache: "no-store" });
    if (!probe.ok && probe.type !== "opaque") {
      return { ok: false, reason: "unreachable" };
    }
  } catch {
    return { ok: false, reason: "unreachable" };
  }

  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update().catch(() => undefined);
      await registration.unregister().catch(() => undefined);
    }
  }
  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }
  window.location.reload();
  return { ok: true };
}
