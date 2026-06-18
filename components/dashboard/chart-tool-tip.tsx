import { fmt } from "./utils";

export function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-lg text-xs">
      <div className="font-medium text-card-foreground">{label}</div>
      <div className="text-muted-foreground">{fmt(payload[0].value)}</div>
    </div>
  );
}