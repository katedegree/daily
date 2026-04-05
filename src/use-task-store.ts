import { create } from "zustand";
import type { Background, Origin, Task } from "./type";
import { today } from "./utils";

const generateId = (existing: Task[]): string => {
  const chars = "0123456789";
  let id: string;
  do {
    id = Array.from(
      { length: 4 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
  } while (existing.some((t) => t.id === id));
  return id;
};

const createTask = (id: string): Task => ({
  id,
  origin: { goal: "", reason: "", action: "", hypotheses: [""] },
  background: [
    { purpose: "", hypotheses: [""], plan: "", createdDate: today() },
  ],
  createdDate: today(),
  completedDate: null,
});

interface TaskStore {
  tasks: Task[];
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
  tasks: [],

  storeTask: () =>
    set((prev) => {
      const id = generateId(prev.tasks);
      return { tasks: [createTask(id), ...prev.tasks] };
    }),

  destoryTask: (taskId) =>
    set((prev) => ({
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    })),

  toggleCompleted: (taskId) =>
    set((prev) => ({
      tasks: prev.tasks.map((t) =>
        t.id === taskId
          ? { ...t, completedDate: t.completedDate ? null : today() }
          : t,
      ),
    })),

  updateOrigin: (taskId, origin) =>
    set((prev) => ({
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, origin } : t,
      ),
    })),

  updateBackground: (taskId, createdDate, background) =>
    set((prev) => ({
      tasks: prev.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const exists = t.background.some((b) => b.createdDate === createdDate);
        const newBackground = exists
          ? t.background.map((b) => (b.createdDate === createdDate ? background : b))
          : [...t.background, background];
        return { ...t, background: newBackground };
      }),
    })),
}));
