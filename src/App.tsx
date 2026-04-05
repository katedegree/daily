import { useTaskStore } from "./use-task-store";
import { TaskList } from "./components";
import { useEffect, useState } from "react";
import { today, buildReportText } from "./utils";

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
    const filtered = Object.fromEntries(
      Object.entries(tasks).filter(
        ([, t]) => !t.completedDate || t.completedDate >= today(),
      ),
    );
    localStorage.setItem("tasks", JSON.stringify(filtered));
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

      <div className="grid grid-rows-[1fr_auto]">
        <textarea
          className="w-full bg-board p-4 rounded-lg overflow-y-auto"
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4 pt-4">
          <button className="bg-input py-2 rounded-lg" onClick={handleSave}>
            保存する
          </button>
          <button
            className="bg-input py-2 rounded-lg"
            onClick={async () => {
              if (!synopsis.trim()) {
                alert("業務内容を入力してください");
                return;
              }
              await navigator.clipboard.writeText(
                buildReportText(synopsis, remainingTasks, newTasks),
              );
            }}
          >
            日報をコピー
          </button>
        </div>
      </div>

      <TaskList tasks={remainingTasks} />
      <TaskList tasks={newTasks} isNew />
    </div>
  );
}
