import type { Task } from "../type";
import { today } from "../utils";
import { useTaskStore } from "../use-task-store";
import { Card } from "./card";

interface Props {
  tasks: Task[];
  isNew?: boolean;
}

export function TaskList({ tasks, isNew = false }: Props) {
  const { storeTask } = useTaskStore();

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      {isNew && (
        <button
          type="button"
          onClick={storeTask}
          className="w-full h-24 border border-dashed rounded-lg shrink-0"
        >
          新規作成
        </button>
      )}
      {tasks.map((task) => {
        const pastBackground = isNew
          ? undefined
          : task.background
              .filter((b) => b.createdDate !== today())
              .sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1))[0];

        if (!isNew && !pastBackground) return null;

        const currentBackground = task.background.find(
          (b) => b.createdDate === today(),
        ) ?? { purpose: "", hypotheses: [""], plan: "", createdDate: today() };

        return (
          <Card
            key={task.id}
            taskId={task.id}
            origin={task.origin}
            pastBackground={pastBackground}
            currentBackground={currentBackground}
            createdDate={task.createdDate}
            completedDate={task.completedDate}
          />
        );
      })}
    </div>
  );
}
