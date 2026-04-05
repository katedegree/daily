import { Trash2 } from "lucide-react";
import type { Background, Origin } from "../type";
import { useTaskStore } from "../use-task-store";

interface Props {
  taskId: string;
  origin: Origin;
  pastBackground?: Background;
}

export function OriginHeader({ taskId, origin, pastBackground }: Props) {
  const { updateOrigin, updateBackground, destoryTask } = useTaskStore();

  return (
    <div className="bg-input py-4 rounded-lg relative">
      <button
        className="absolute top-2 right-2 flex items-center gap-2 p-1 rounded-lg bg-red-500"
        onClick={() => destoryTask(taskId)}
      >
        <p className="text-sm">このTODOを削除する</p>
        <Trash2 size={20} />
      </button>

      {!pastBackground ? (
        <>
          <p className="pl-2 pb-2 text-sm border-b">目的</p>
          <textarea
            className="min-h-16 field-sizing-content w-full p-2"
            value={origin.goal}
            onChange={(e) => updateOrigin(taskId, { ...origin, goal: e.target.value })}
          />
          <p className="pl-2 pb-2 text-sm border-b">理由</p>
          <textarea
            className="min-h-16 field-sizing-content w-full p-2"
            value={origin.reason}
            onChange={(e) => updateOrigin(taskId, { ...origin, reason: e.target.value })}
          />
        </>
      ) : (
        <>
          <p className="pl-2 pb-2 text-sm border-b">目的</p>
          <textarea
            className="min-h-16 field-sizing-content w-full p-2"
            value={origin.goal}
            readOnly
          />
          <p className="pl-2 pb-2 text-sm border-b">実行計画</p>
          <textarea
            className="min-h-16 field-sizing-content w-full p-2"
            value={pastBackground.plan}
            onChange={(e) =>
              updateBackground(taskId, pastBackground.createdDate ?? "", {
                ...pastBackground,
                plan: e.target.value,
              })
            }
            readOnly
          />
        </>
      )}
    </div>
  );
}
