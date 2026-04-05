import { ChevronDown, Trash2, X } from "lucide-react";
import type { Background, Origin } from "../type";
import { cn, today } from "../utils";
import { useTaskStore } from "../use-task-store";

interface Props {
  taskId: string;
  origin: Origin;
  pastBackground?: Background;
  currentBackground: Background;
  createdDate: string;
  completedDate: string | null;
  // isNew: boolean;
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
      {isToday && (
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
        </div>
      )}

      {!isToday && pastBackground && (
        <div>
          <p className="pl-2 pb-2 text-sm">実行計画</p>
          <textarea
            className="min-h-16 field-sizing-content w-full p-2 bg-input rounded-lg"
            value={pastBackground.plan}
            onChange={(e) => {
              updateBackground(taskId, pastBackground.createdDate ?? "", {
                ...pastBackground,
                plan: e.target.value,
              });
            }}
            readOnly
          />
        </div>
      )}

      {isToday && (
        <div>
          <p className="pb-2 text-sm">達成までの仮定</p>
          <div className="flex flex-col gap-2">
            {origin.hypotheses.map((hypothesis, index) => (
              <div key={index} className="relative">
                {index !== 0 && (
                  <button
                    className="absolute top-1 right-2"
                    onClick={() => {
                      updateOrigin(taskId, {
                        ...origin,
                        hypotheses: origin.hypotheses.filter(
                          (_, i) => i !== index,
                        ),
                      });
                    }}
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
                  onChange={(e) => {
                    updateOrigin(taskId, {
                      ...origin,
                      hypotheses: origin.hypotheses.map((h, i) =>
                        i === index ? e.target.value : h,
                      ),
                    });
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                updateOrigin(taskId, {
                  ...origin,
                  hypotheses: [...origin.hypotheses, ""],
                });
              }}
              className="w-full h-12 border border-dashed rounded-lg"
            >
              追加
            </button>
          </div>
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
            <p className="pl-2 pb-2 text-sm">達成できた理由</p>
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
            <p className="pb-2 text-sm">達成までの仮定</p>
            <div className="flex flex-col gap-2 pb-8">
              {currentBackground.hypotheses.map((hypothesis, index) => (
                <div key={index} className="relative">
                  {index !== 0 && (
                    <button
                      className="absolute top-1 right-2"
                      onClick={() => {
                        updateBackground(
                          taskId,
                          currentBackground.createdDate,
                          {
                            ...currentBackground,
                            hypotheses: currentBackground.hypotheses.filter(
                              (_, i) => i !== index,
                            ),
                          },
                        );
                      }}
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
                    onChange={(e) => {
                      updateBackground(taskId, currentBackground.createdDate, {
                        ...currentBackground,
                        hypotheses: currentBackground.hypotheses.map((h, i) =>
                          i === index ? e.target.value : h,
                        ),
                      });
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  updateBackground(taskId, currentBackground.createdDate, {
                    ...currentBackground,
                    hypotheses: [...currentBackground.hypotheses, ""],
                  });
                }}
                className="w-full h-12 border border-dashed rounded-lg"
              >
                追加
              </button>
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
