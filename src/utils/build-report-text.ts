import type { Task } from "../type";
import { today } from "./today";

function buildAfterStatus(
  completedDate: string | null,
  purpose: string,
  hypotheses: string[],
  plan: string,
): string {
  if (completedDate) {
    return `[達成できた要因]\n${purpose}`;
  }
  return `[達成までの仮定（改善）]\n${hypotheses.filter(Boolean).join("\n↓ how\n")}\n\n\n[次回の実行計画]\n${plan}`;
}

function buildRemainingTaskText(task: Task): string | null {
  const pastBackground = task.background
    .filter((b) => b.createdDate !== today())
    .sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1))[0];
  if (!pastBackground) return null;

  const currentBackground = task.background.find(
    (b) => b.createdDate === today(),
  ) ?? { purpose: "", hypotheses: [""], plan: "", createdDate: today() };

  const completedStatus = task.completedDate ? "⭕️" : "❌";
  const afterStatus = buildAfterStatus(
    task.completedDate,
    currentBackground.purpose,
    currentBackground.hypotheses,
    currentBackground.plan,
  );

  return `[info]
[Task ID]: ${task.id}
[目的]: ${task.origin.goal}
[実行計画]: ${pastBackground.plan}


[達成状況]: ${completedStatus}


${afterStatus}
[/info]`;
}

function buildNewTaskText(task: Task): string {
  const currentBackground = task.background.find(
    (b) => b.createdDate === today(),
  ) ?? { purpose: "", hypotheses: [""], plan: "", createdDate: today() };

  const originHypotheses = task.origin.hypotheses.filter(Boolean).join("\n↓ how\n");
  const completedStatus = task.completedDate ? "⭕️" : "❌";
  const afterStatus = buildAfterStatus(
    task.completedDate,
    currentBackground.purpose,
    currentBackground.hypotheses,
    currentBackground.plan,
  );

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
}

export function buildReportText(
  synopsis: string,
  remainingTasks: Task[],
  newTasks: Task[],
): string {
  const date = today();
  const remainingTasksText = remainingTasks
    .map(buildRemainingTaskText)
    .filter(Boolean)
    .join("\n");
  const newTasksText = newTasks.map(buildNewTaskText).join("\n");

  return `[info]
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
`;
}
