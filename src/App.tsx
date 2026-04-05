import { useTaskStore } from "./use-task-store";
import { Card } from "./components";
import { useEffect, useState } from "react";
import { today } from "./utils";

function App() {
  const [synopsis, setSynopsis] = useState("");
  const { tasks, storeTask } = useTaskStore();
  const remainingTasks = Object.values(tasks).filter(
    (t) =>
      (t.completedDate === today() || !t.completedDate) &&
      t.createdDate !== today(),
  );
  const newTasks = Object.values(tasks).filter(
    (t) => t.createdDate === today(),
  );

  // 今のタスクの状態をlocalStorageのtasksに保存する。
  const handleSave = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  // 初期ロード時にlocalStorageのtasksを参照する。
  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (!stored) return;
    useTaskStore.setState({ tasks: JSON.parse(stored) });
  }, []);

  return (
    <div className="h-screen grid grid-cols-[2fr_3fr_3fr] grid-rows-[auto_1fr] gap-x-4 p-8">
      <p className="pl-2 pb-2 text-sm">業務内容</p>
      <p className="pl-2 pb-2 text-sm">過去のTODO</p>
      <p className="pl-2 pb-2 text-sm">新規のTODO</p>

      <div className="grid grid-rows-[1fr_auto] gap-4">
        <textarea
          className="w-full bg-board p-4 rounded-lg overflow-y-auto"
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-input py-2 rounded-lg" onClick={handleSave}>
            保存する
          </button>
          <button className="bg-input py-2 rounded-lg">日報をコピー</button>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto">
        {remainingTasks.map((task) => {
          const pastBackground = task.background
            .filter((b) => b.createdDate !== today())
            .sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1))[0];
          if (!pastBackground) return null;

          const currentBackground = task.background.find(
            (b) => b.createdDate === today(),
          ) || {
            purpose: "",
            hypotheses: [""],
            plan: "",
            createdDate: today(),
          };

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

      <div className="flex flex-col gap-4 overflow-y-auto">
        <button
          type="button"
          onClick={() => {
            storeTask();
          }}
          className="w-full h-24 border border-dashed rounded-lg shrink-0"
        >
          新規作成
        </button>
        {newTasks.map((task) => {
          const currentBackground = task.background.find(
            (b) => b.createdDate === today(),
          ) || {
            purpose: "",
            hypotheses: [""],
            plan: "",
            createdDate: today(),
          };

          return (
            <Card
              key={task.id}
              taskId={task.id}
              origin={task.origin}
              currentBackground={currentBackground}
              createdDate={task.createdDate}
              completedDate={task.completedDate}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
