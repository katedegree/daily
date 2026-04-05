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
    <div className="flex flex-col gap-24 bg-board p-4 rounded-lg">
      <div className="bg-input py-4 rounded-lg relative">
        <button
          className="absolute top-2 right-2 flex items-center gap-2 p-1 rounded-lg bg-red-500"
          onClick={() => destoryTask(taskId)}
        >
          <p className="text-sm">このTODOを削除する</p>
          <Trash2 size={20} />
        </button>

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
        <div>
          <p className="pb-2 text-sm">達成までの仮定</p>
          <HypothesesEditor
            hypotheses={origin.hypotheses}
            onChange={(hypotheses) => updateOrigin(taskId, { ...origin, hypotheses })}
          />
        </div>
      )}

      {isToday && (
        <LabeledTextarea
          label="行動"
          value={origin.action}
          onChange={(v) => updateOrigin(taskId, { ...origin, action: v })}
        />
      )}

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
