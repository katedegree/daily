import { ChevronDown, Plus, X } from "lucide-react";
import { cn } from "../utils";

interface Props {
  hypotheses: string[];
  onChange: (hypotheses: string[]) => void;
}

export function HypothesesEditor({ hypotheses, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {hypotheses.map((hypothesis, index) => (
        <div
          key={index}
          className={cn("relative", index !== 0 && "pl-3 border-l-2 border-zinc-700")}
        >
          {index !== 0 && (
            <>
              <button
                className="absolute -top-1 right-0 text-zinc-600 hover:text-zinc-300"
                onClick={() => onChange(hypotheses.filter((_, i) => i !== index))}
              >
                <X size={13} />
              </button>
              <div className="flex items-center gap-1 mb-1.5">
                <ChevronDown size={12} className="text-zinc-500" />
                <p className="text-xs text-zinc-500">How</p>
              </div>
            </>
          )}
          <textarea
            className="min-h-12 field-sizing-content w-full px-3 py-2 text-sm bg-zinc-800/60 border border-zinc-700/50 rounded-lg focus:border-zinc-500 transition-colors leading-relaxed"
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
        className="flex items-center justify-center gap-1.5 w-full h-9 border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 rounded-lg text-xs font-medium"
      >
        <Plus size={13} />
        追加
      </button>
    </div>
  );
}
