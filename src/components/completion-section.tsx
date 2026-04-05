import type { Background } from "../type";
import { cn } from "../utils";
import { useTaskStore } from "../use-task-store";
import { HypothesesEditor } from "./hypotheses-editor";

interface Props {
  taskId: string;
  currentBackground: Background;
  completedDate: string | null;
}

export function CompletionSection({ taskId, currentBackground, completedDate }: Props) {
  const { updateBackground, toggleCompleted } = useTaskStore();

  return (
    <div>
      <div className="flex gap-8 items-center pb-8">
        <p className="text-sm">達成状況</p>
        <button
          className={cn(
            "w-16 p-1 rounded-full flex",
            completedDate ? "bg-blue-400 justify-end" : "bg-white justify-start",
          )}
          onClick={() => toggleCompleted(taskId)}
        >
          <div className="rounded-full w-6 h-6 bg-input" />
        </button>
      </div>

      {completedDate ? (
        <div>
          <p className="pl-2 pb-2 text-sm">達成できた要因</p>
          <textarea
            className="min-h-16 field-sizing-content w-full p-2 bg-input rounded-lg"
            value={currentBackground.purpose}
            onChange={(e) =>
              updateBackground(taskId, currentBackground.createdDate, {
                ...currentBackground,
                purpose: e.target.value,
              })
            }
          />
        </div>
      ) : (
        <>
          <p className="pb-2 text-sm">達成までの仮定（改善）</p>
          <div className="pb-8">
            <HypothesesEditor
              hypotheses={currentBackground.hypotheses}
              onChange={(hypotheses) =>
                updateBackground(taskId, currentBackground.createdDate, {
                  ...currentBackground,
                  hypotheses,
                })
              }
            />
          </div>

          <div>
            <p className="pl-2 pb-2 text-sm">次回の実行計画</p>
            <textarea
              className="min-h-16 field-sizing-content w-full p-2 bg-input rounded-lg"
              value={currentBackground.plan}
              onChange={(e) =>
                updateBackground(taskId, currentBackground.createdDate, {
                  ...currentBackground,
                  plan: e.target.value,
                })
              }
            />
          </div>
        </>
      )}
    </div>
  );
}
