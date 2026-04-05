import type { Task } from "../type";
import { today } from "../utils";
import { useTaskStore } from "../use-task-store";
import { Card } from "./card";
import { Plus } from "lucide-react";

interface Props {
  tasks: Task[];
  isNew?: boolean;
}

export function TaskList({ tasks, isNew = false }: Props) {
  const { storeTask } = useTaskStore();

  return (
    <div className="flex flex-col gap-3 overflow-y-auto pt-4">
      {isNew && (
        <button
          type="button"
          onClick={storeTask}
          className="flex items-center justify-center gap-2 w-full h-14 border border-dashed border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 rounded-xl text-sm font-medium shrink-0"
        >
          <Plus size={15} />
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
