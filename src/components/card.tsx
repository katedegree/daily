import { Trash2 } from "lucide-react";
import type { Background, Origin } from "../type";
import { cn, today } from "../utils";
import { useTaskStore } from "../use-task-store";
import { HypothesesEditor } from "./hypotheses-editor";

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
          onClick={() => {
            destoryTask(taskId);
          }}
        >
          <p className="text-sm">このTODOを削除する</p>
          <Trash2 size={20} />
        </button>

        {isToday || !pastBackground ? (
          <>
            <p className="pl-2 pb-2 text-sm border-b">目的</p>
            <textarea
              className="min-h-16 field-sizing-content w-full p-2"
              value={origin.goal}
              onChange={(e) => {
                updateOrigin(taskId, {
                  ...origin,
                  goal: e.target.value,
                });
              }}
            />
            <p className="pl-2 pb-2 text-sm border-b">理由</p>
            <textarea
              className="min-h-16 field-sizing-content w-full p-2"
              value={origin.reason}
              onChange={(e) => {
                updateOrigin(taskId, {
                  ...origin,
                  reason: e.target.value,
                });
              }}
            />
          </>
        ) : (
          <>
            <p className="pl-2 pb-2 text-sm border-b">目的</p>
            <textarea
              className="min-h-16 field-sizing-content w-full p-2"
              value={origin.goal}
              onChange={(e) => {
                updateOrigin(taskId, {
                  ...origin,
                  goal: e.target.value,
                });
              }}
              readOnly
            />
            <p className="pl-2 pb-2 text-sm border-b">実行計画</p>
            <textarea
              className="min-h-16 field-sizing-content w-full p-2"
              value={pastBackground.plan}
              onChange={(e) => {
                updateBackground(taskId, pastBackground.createdDate ?? "", {
                  ...pastBackground,
                  plan: e.target.value,
                });
              }}
              readOnly
            />
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
        <div>
          <p className="pl-2 pb-2 text-sm">行動</p>
          <textarea
            className="min-h-16 field-sizing-content w-full p-2 bg-input rounded-lg"
            value={origin.action}
            onChange={(e) => {
              updateOrigin(taskId, {
                ...origin,
                action: e.target.value,
              });
            }}
          />
        </div>
      )}

      <div>
        <div className="flex gap-8 items-center pb-8">
          <p className="text-sm">達成状況</p>
          <button
            className={cn(
              "w-16 p-1 rounded-full flex",
              completedDate
                ? "bg-blue-400 justify-end"
                : "bg-white justify-start",
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
              onChange={(e) => {
                updateBackground(taskId, currentBackground.createdDate, {
                  ...currentBackground,
                  purpose: e.target.value,
                });
              }}
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
                onChange={(e) => {
                  updateBackground(taskId, currentBackground.createdDate, {
                    ...currentBackground,
                    plan: e.target.value,
                  });
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
