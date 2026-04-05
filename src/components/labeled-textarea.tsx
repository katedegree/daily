import { cn } from "../utils";

interface Props {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  bordered?: boolean;
}

export function LabeledTextarea({ label, value, onChange, bordered = false }: Props) {
  return (
    <div className="mb-3 last:mb-0">
      <p
        className={cn(
          "text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5",
          bordered && "pb-1.5 border-b border-zinc-700/60",
        )}
      >
        {label}
      </p>
      <textarea
        className={cn(
          "min-h-12 field-sizing-content w-full px-3 py-2 text-sm leading-relaxed",
          bordered
            ? "bg-transparent placeholder:text-zinc-600"
            : "bg-zinc-800/60 border border-zinc-700/50 rounded-lg focus:border-zinc-500 transition-colors placeholder:text-zinc-600",
        )}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={!onChange}
      />
    </div>
  );
}
