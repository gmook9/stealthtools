type StatusKind = "info" | "success" | "error";

type StatusNoteProps = {
  status: string;
  kind?: StatusKind;
};

export default function StatusNote({ status, kind = "info" }: StatusNoteProps) {
  if (!status) return null;

  return (
    <p className={`status-note status-${kind}`} role={kind === "error" ? "alert" : "status"}>
      {status}
    </p>
  );
}
