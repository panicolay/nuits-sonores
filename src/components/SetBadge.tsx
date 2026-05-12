import type { SetStatus } from "../data/programme";

export function SetBadge({ status }: { status: SetStatus }) {
  if (status === "live") {
    return (
      <span className="badge badge--live">
        <span className="badge__dot" aria-hidden />
        Live
      </span>
    );
  }
  if (status === "soon") {
    return <span className="badge badge--soon">Soon</span>;
  }
  if (status === "past") {
    return <span className="badge badge--past">Terminé</span>;
  }
  return null;
}
