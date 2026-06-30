import { create } from 'zustand';

type State = 'HOME' | 'CRUNCH' | 'SEND' | 'SAFE';

export interface PivotPath {
  title: string;
  description: string;
  action: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  due?: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  createdAt: string;
}

interface LastsaveStore {
  currentState: State;
  taskDescription: string;
  reasoningSteps: Array<{ step: string; message: string }>;
  draft: string | null;
  confidenceScore: number | null;
  pivotPaths: Array<PivotPath> | null;
  error: string | null;

  tasks: TaskItem[];
  addTask: (title: string, description: string, due?: string | null) => void;
  deleteTask: (id: string) => void;
  startRescueFromTask: (id: string) => void;
  markTaskDone: (id: string) => void;

  setTask: (description: string) => void;
  addReasoningStep: (step: string, message: string) => void;
  setDraft: (draft: string, confidence: number) => void;
  setState: (state: State) => void;
  setPivotPaths: (paths: Array<PivotPath>) => void;
  setError: (error: string) => void;
  reset: () => void;
}

const makeId = () => Math.random().toString(36).slice(2, 9);

export const useLastsaveStore = create<LastsaveStore>((set, get) => ({
  currentState: 'HOME',
  taskDescription: '',
  reasoningSteps: [],
  draft: null,
  confidenceScore: null,
  pivotPaths: null,
  error: null,

  tasks: [],

  addTask: (title, description, due = null) => {
    const item: TaskItem = {
      id: makeId(),
      title,
      description,
      due,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ tasks: [item, ...state.tasks] }));
  },

  deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

  startRescueFromTask: (id) => {
    const t = get().tasks.find((x) => x.id === id);
    if (!t) return;
    set({ taskDescription: t.description, currentState: 'CRUNCH', reasoningSteps: [], draft: null, confidenceScore: null, pivotPaths: null, error: null });
    // mark in-progress
    set((state) => ({ tasks: state.tasks.map((tt) => (tt.id === id ? { ...tt, status: 'IN_PROGRESS' } : tt)) }));
  },

  markTaskDone: (id) => set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: 'DONE' } : t)) })),

  setTask: (description) =>
    set({
      taskDescription: description,
      currentState: 'CRUNCH',
      reasoningSteps: [],
      draft: null,
      confidenceScore: null,
      pivotPaths: null,
      error: null,
    }),

  addReasoningStep: (step, message) =>
    set((state) => ({
      reasoningSteps: [...state.reasoningSteps, { step, message }],
    })),

  setDraft: (draft, confidence) =>
    set({
      draft,
      confidenceScore: confidence,
      currentState: 'SEND',
    }),

  setState: (currentState) => set({ currentState }),

  setPivotPaths: (pivotPaths) =>
    set({
      pivotPaths,
      currentState: 'SAFE',
    }),

  setError: (error) =>
    set({
      error,
      currentState: 'SAFE',
    }),

  reset: () =>
    set({
      currentState: 'HOME',
      taskDescription: '',
      reasoningSteps: [],
      draft: null,
      confidenceScore: null,
      pivotPaths: null,
      error: null,
      tasks: [],
    }),
}));
