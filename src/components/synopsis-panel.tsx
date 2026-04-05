import type { Task } from "../type";
import { buildReportText } from "../utils";

interface Props {
  synopsis: string;
  onSynopsisChange: (v: string) => void;
  onSave: () => void;
  remainingTasks: Task[];
  newTasks: Task[];
}

export function SynopsisPanel({
  synopsis,
  onSynopsisChange,
  onSave,
  remainingTasks,
  newTasks,
}: Props) {
  return (
    <div className="grid grid-rows-[1fr_auto]">
      <textarea
        className="w-full bg-board p-4 rounded-lg overflow-y-auto"
        value={synopsis}
        onChange={(e) => onSynopsisChange(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4 pt-4">
        <button className="bg-input py-2 rounded-lg" onClick={onSave}>
          保存する
        </button>
        <button
          className="bg-input py-2 rounded-lg"
          onClick={async () => {
            if (!synopsis.trim()) {
              alert("業務内容を入力してください");
              return;
            }
            await navigator.clipboard.writeText(
              buildReportText(synopsis, remainingTasks, newTasks),
            );
          }}
        >
          日報をコピー
        </button>
      </div>
    </div>
  );
}
