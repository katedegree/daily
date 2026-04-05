import { useTaskStore } from "./use-task-store";
import { SynopsisPanel, TaskList } from "./components";
import { useEffect, useState } from "react";
import { today } from "./utils";

export default function App() {
  const [synopsis, setSynopsis] = useState("");
  const { tasks } = useTaskStore();
  const remainingTasks = Object.values(tasks).filter(
    (t) =>
      (t.completedDate === today() || !t.completedDate) &&
      t.createdDate !== today(),
  );
  const newTasks = Object.values(tasks).filter(
    (t) => t.createdDate === today(),
  );

  const handleSave = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (!stored) return;
    useTaskStore.setState({ tasks: JSON.parse(stored) });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <div className="h-screen grid grid-cols-[2fr_3fr_3fr] grid-rows-[auto_1fr] gap-x-4 p-8">
      <p className="pl-2 pb-2 text-sm">業務内容</p>
      <p className="pl-2 pb-2 text-sm">過去のTODO</p>
      <p className="pl-2 pb-2 text-sm">新規のTODO</p>

      <SynopsisPanel
        synopsis={synopsis}
        onSynopsisChange={setSynopsis}
        onSave={handleSave}
        remainingTasks={remainingTasks}
        newTasks={newTasks}
      />

      <TaskList tasks={remainingTasks} />
      <TaskList tasks={newTasks} isNew />
    </div>
  );
}
