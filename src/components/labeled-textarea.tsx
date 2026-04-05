import { cn } from "../utils";

interface Props {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  bordered?: boolean;
}

export function LabeledTextarea({ label, value, onChange, bordered = false }: Props) {
  return (
    <div>
      <p className={cn("pl-2 pb-2 text-sm", bordered && "border-b")}>{label}</p>
      <textarea
        className={cn("min-h-16 field-sizing-content w-full p-2", !bordered && "bg-input rounded-lg")}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={!onChange}
      />
    </div>
  );
}
