import { Trash2 } from "lucide-react";
import type { Background, Origin } from "../type";
import { cn, today } from "../utils";
import { useTaskStore } from "../use-task-store";
import { HypothesesEditor } from "./hypotheses-editor";
import { LabeledTextarea } from "./labeled-textarea";

interface Props {
  taskId: string;
  origin: Origin;
  pastBackground?: Background;
  currentBackground: Background;
  createdDate: string;
  completedDate: string | null;
}

export function Card({
  taskId,
  origin,
  pastBackground,
  currentBackground,
  createdDate,
  completedDate,
}: Props) {
  const { updateOrigin, updateBackground, toggleCompleted, destoryTask } =
    useTaskStore();
  const isToday = createdDate === today();

  return (
    <div className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shrink-0">
      <div className="px-4 pt-3 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
            #{taskId}
          </span>
          <button
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 hover:bg-red-500/10 px-2 py-1 rounded-lg"
            onClick={() => destoryTask(taskId)}
          >
            <Trash2 size={12} />
            削除
          </button>
        </div>

        {isToday ? (
          <>
            <LabeledTextarea
              label="目的"
              value={origin.goal}
              onChange={(v) => updateOrigin(taskId, { ...origin, goal: v })}
              bordered
            />
            <LabeledTextarea
              label="理由"
              value={origin.reason}
              onChange={(v) => updateOrigin(taskId, { ...origin, reason: v })}
              bordered
            />
          </>
        ) : (
          <>
            <LabeledTextarea label="目的" value={origin.goal} bordered />
            <LabeledTextarea label="実行計画" value={pastBackground?.plan ?? ""} bordered />
          </>
        )}
      </div>

      {isToday && (
        <div className="px-4 py-4 border-t border-zinc-800">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">達成までの仮定</p>
          <HypothesesEditor
            hypotheses={origin.hypotheses}
            onChange={(hypotheses) => updateOrigin(taskId, { ...origin, hypotheses })}
          />
        </div>
      )}

      {isToday && (
        <div className="px-4 py-4 border-t border-zinc-800">
          <LabeledTextarea
            label="行動"
            value={origin.action}
            onChange={(v) => updateOrigin(taskId, { ...origin, action: v })}
          />
        </div>
      )}

      <div className="px-4 py-4 border-t border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">達成状況</span>
          <button
            className={cn(
              "w-11 h-6 rounded-full flex items-center transition-all duration-200",
              completedDate
                ? "bg-indigo-500 justify-end pr-0.5"
                : "bg-zinc-700 justify-start pl-0.5",
            )}
            onClick={() => toggleCompleted(taskId)}
          >
            <div className="rounded-full w-5 h-5 bg-white shadow-sm" />
          </button>
        </div>

        {completedDate ? (
          <LabeledTextarea
            label="達成できた要因"
            value={currentBackground.purpose}
            onChange={(v) =>
              updateBackground(taskId, currentBackground.createdDate, {
                ...currentBackground,
                purpose: v,
              })
            }
          />
        ) : (
          <>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">達成までの仮定（改善）</p>
            <div className="mb-4">
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
            <LabeledTextarea
              label="次回の実行計画"
              value={currentBackground.plan}
              onChange={(v) =>
                updateBackground(taskId, currentBackground.createdDate, {
                  ...currentBackground,
                  plan: v,
                })
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
