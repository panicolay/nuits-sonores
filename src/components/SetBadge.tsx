import type { SetStatus } from "../data/programme";

export function SetBadge({ status }: { status: SetStatus }) {
  if (status === "live") {
    return (
      <span className="badge badge--live">
        <span className="badge__dot" aria-hidden />
        En direct
      </span>
    );
  }
  if (status === "soon") {
    return <span className="badge badge--soon">Bientôt</span>;
  }
  return null;
}
