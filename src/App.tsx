import { useTaskStore } from "./use-task-store";
import { Card } from "./components";
import { useEffect, useState } from "react";
import { today } from "./utils";

export default function App() {
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
              const date = today();
              const remainingTasksText = remainingTasks
                .map((task) => {
                  const pastBackground = task.background
                    .filter((b) => b.createdDate !== today())
                    .sort((a, b) =>
                      a.createdDate < b.createdDate ? 1 : -1,
                    )[0];
                  if (!pastBackground) return null;
                  const currentBackground = task.background.find(
                    (b) => b.createdDate === today(),
                  ) ?? {
                    purpose: "",
                    hypotheses: [""],
                    plan: "",
                    createdDate: today(),
                  };
                  const completedStatus = task.completedDate ? "⭕️" : "❌";
                  const afterStatus = task.completedDate
                    ? `[達成できた要因]\n${currentBackground.purpose}`
                    : `[達成までの仮定（改善）]\n${currentBackground.hypotheses.filter(Boolean).join("\n↓ how\n")}\n\n\n[次回の実行計画]\n${currentBackground.plan}`;
                  return `[info]
[Task ID]: ${task.id}
[目的]: ${task.origin.goal}
[実行計画]: ${pastBackground.plan}


[達成状況]: ${completedStatus}


${afterStatus}
[/info]`;
                })
                .filter(Boolean)
                .join("\n");
              const newTasksText = newTasks
                .map((task) => {
                  const currentBackground = task.background.find(
                    (b) => b.createdDate === today(),
                  ) ?? {
                    purpose: "",
                    hypotheses: [""],
                    plan: "",
                    createdDate: today(),
                  };
                  const originHypotheses = task.origin.hypotheses
                    .filter(Boolean)
                    .join("\n↓ how\n");
                  const completedStatus = task.completedDate ? "⭕️" : "❌";
                  const afterStatus = task.completedDate
                    ? `[達成できた要因]\n${currentBackground.purpose}`
                    : `[達成までの仮定（改善）]\n${currentBackground.hypotheses.filter(Boolean).join("\n↓ how\n")}\n\n\n[次回の実行計画]\n${currentBackground.plan}`;
                  return `[info]
[Task ID]: ${task.id}
[目的]: ${task.origin.goal}
[理由]: ${task.origin.reason}


[達成までの仮定]
${originHypotheses}


[行動]
${task.origin.action}


[達成状況]: ${completedStatus}


${afterStatus}
[/info]`;
                })
                .join("\n");
              await navigator.clipboard.writeText(`[info]
[title]${date.slice(0, 4)}年${date.slice(4, 6)}月${date.slice(6, 8)}日[/title]

備考
[info]必ずチャットの概要を確認してほしいです。[/info]

業務内容
[info]${synopsis}[/info]

過去のTODO
${remainingTasksText}

新規のTODO
${newTasksText}
[/info]
`);
            }}
          >
            日報をコピー
          </button>
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
