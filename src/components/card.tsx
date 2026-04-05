import type { Background, Origin } from "../type";
import { today } from "../utils";
import { useTaskStore } from "../use-task-store";
import { HypothesesEditor } from "./hypotheses-editor";
import { OriginHeader } from "./origin-header";
import { CompletionSection } from "./completion-section";

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
  const { updateOrigin } = useTaskStore();
  const isToday = createdDate === today();

  return (
    <div className="flex flex-col gap-24 bg-board p-4 rounded-lg">
      <OriginHeader
        taskId={taskId}
        origin={origin}
        pastBackground={isToday ? undefined : pastBackground}
      />

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

      <CompletionSection
        taskId={taskId}
        currentBackground={currentBackground}
        completedDate={completedDate}
      />
    </div>
  );
}
