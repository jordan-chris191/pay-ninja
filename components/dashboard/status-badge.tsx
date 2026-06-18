import { STATUS_CFG } from "./constants";
import type { Invoice } from "./types";

export function StatusBadge({ status }: { status: Invoice["status"] }) {
  const cfg = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}