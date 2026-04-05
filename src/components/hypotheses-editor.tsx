import { ChevronDown, X } from "lucide-react";

interface Props {
  hypotheses: string[];
  onChange: (hypotheses: string[]) => void;
}

export function HypothesesEditor({ hypotheses, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {hypotheses.map((hypothesis, index) => (
        <div key={index} className="relative">
          {index !== 0 && (
            <button
              className="absolute top-1 right-2"
              onClick={() => onChange(hypotheses.filter((_, i) => i !== index))}
            >
              <X size={20} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <ChevronDown />
            <p className="text-sm pb-2">How</p>
          </div>
          <textarea
            className="min-h-16 field-sizing-content w-full p-2 bg-input rounded-lg"
            value={hypothesis}
            onChange={(e) =>
              onChange(hypotheses.map((h, i) => (i === index ? e.target.value : h)))
            }
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...hypotheses, ""])}
        className="w-full h-12 border border-dashed rounded-lg"
      >
        追加
      </button>
    </div>
  );
}
