import { create } from "zustand";
import type { Background, Origin, Task } from "./type";
import { today } from "./utils";

const generateId = (existing: Record<string, Task>): string => {
  let id: string;
  do {
    id = Math.random().toString(36).slice(2, 6);
  } while (id in existing);
  return id;
};

interface TaskStore {
  tasks: Record<string, Task>;
  storeTask: () => void;
  destoryTask: (taskId: string) => void;
  toggleCompleted: (taskId: string) => void;
  updateOrigin: (taskId: string, origin: Origin) => void;
  updateBackground: (
    taskId: string,
    createdDate: string,
    background: Background,
  ) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: {
    aaaa: {
      id: "aaaa",
      origin: {
        goal: "ゴール",
        reason: "理由",
        action: "行動",
        hypotheses: [""],
      },
      background: [
        {
          purpose: "",
          hypotheses: [""],
          plan: "",
          createdDate: "20000101",
        },
        {
          purpose: "",
          hypotheses: [""],
          plan: "こうすればいい計画",
          createdDate: "20000102",
        },
      ],
      createdDate: "20000101",
      completedDate: null,
    },
  },

  storeTask: () =>
    set((prev) => {
      const id = generateId(prev.tasks);
      const newTask: Task = {
        id,
        origin: {
          goal: "",
          reason: "",
          action: "",
          hypotheses: [""],
        },
        background: [
          {
            purpose: "",
            hypotheses: [""],
            plan: "",
            createdDate: today(),
          },
        ],
        createdDate: today(),
        completedDate: null,
      };
      return { tasks: { [id]: newTask, ...prev.tasks } };
    }),

  destoryTask: (taskId) =>
    set((prev) => {
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];
      return { tasks: newTasks };
    }),

  toggleCompleted: (taskId) =>
    set((prev) => ({
      tasks: {
        ...prev.tasks,
        [taskId]: {
          ...prev.tasks[taskId],
          completedDate: prev.tasks[taskId].completedDate ? null : today(),
        },
      },
    })),

  updateOrigin: (taskId, origin) =>
    set((prev) => {
      const task = prev.tasks[taskId];
      return {
        tasks: {
          ...prev.tasks,
          [taskId]: { ...task, origin },
        },
      };
    }),

  updateBackground: (taskId, createdDate, background) =>
    set((prev) => {
      const task = prev.tasks[taskId];
      const exists = task.background.some((b) => b.createdDate === createdDate);
      const newBackground = exists
        ? task.background.map((b) =>
            b.createdDate === createdDate ? background : b,
          )
        : [...task.background, background];
      return {
        tasks: {
          ...prev.tasks,
          [taskId]: { ...task, background: newBackground },
        },
      };
    }),
}));
