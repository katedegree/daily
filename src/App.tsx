import { useTaskStore } from "./use-task-store";
import { TaskList, FeedbackButton } from "./components";
import { useEffect, useState } from "react";
import { today, buildReportText } from "./utils";

export default function App() {
  const [synopsis, setSynopsis] = useState("");
  const { tasks } = useTaskStore();
  const remainingTasks = tasks.filter(
    (t) =>
      (t.completedDate === today() || !t.completedDate) &&
      t.createdDate !== today(),
  );
  const newTasks = tasks.filter((t) => t.createdDate === today());

  const handleSave = () => {
    const filtered = tasks.filter(
      (t) => !t.completedDate || t.completedDate >= today(),
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
    <div className="h-screen overflow-y-auto md:overflow-hidden md:grid md:grid-cols-[2fr_3fr_3fr] md:grid-rows-[auto_1fr] md:gap-x-3 px-6 py-5">

      {/* 業務内容 */}
      <div className="flex items-center gap-2 pb-3 border-b border-zinc-800 md:col-start-1 md:row-start-1">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">業務内容</span>
      </div>
      <div className="flex flex-col gap-3 pt-4 mb-8 md:mb-0 md:col-start-1 md:row-start-2 md:grid md:grid-rows-[1fr_auto] md:min-h-0">
        <textarea
          className="w-full h-40 md:h-auto bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl overflow-y-auto text-sm leading-relaxed focus:border-zinc-600 transition-colors placeholder:text-zinc-600"
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
          placeholder="今日の業務内容を入力..."
        />
        <div className="grid grid-cols-2 gap-2">
          <FeedbackButton
            label="保存"
            doneLabel="保存しました"
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2.5 rounded-xl text-sm font-medium transition-colors"
            onClick={handleSave}
          />
          <FeedbackButton
            label="日報をコピー"
            doneLabel="コピーしました"
            className="bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
            onClick={async () => {
              if (!synopsis.trim()) {
                alert("業務内容を入力してください");
                return;
              }
              await navigator.clipboard.writeText(
                buildReportText(synopsis, remainingTasks, newTasks),
              );
            }}
          />
        </div>
      </div>

      {/* 過去のTODO */}
      <div className="hidden md:flex items-center gap-2 pb-3 border-b border-zinc-800 md:col-start-2 md:row-start-1">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">過去のTODO</span>
        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full tabular-nums">{remainingTasks.length}</span>
      </div>
      <TaskList
        tasks={remainingTasks}
        label="過去のTODO"
        count={remainingTasks.length}
        className="md:col-start-2 md:row-start-2"
      />

      {/* 新規のTODO */}
      <div className="hidden md:flex items-center gap-2 pb-3 border-b border-zinc-800 md:col-start-3 md:row-start-1">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">新規のTODO</span>
        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full tabular-nums">{newTasks.length}</span>
      </div>
      <TaskList
        tasks={newTasks}
        isNew
        label="新規のTODO"
        count={newTasks.length}
        className="md:col-start-3 md:row-start-2"
      />

    </div>
  );
}
