import { useState } from 'react';
import { useLastsaveStore } from '../store/lastsaveStore';
import { Plus, Trash2, Play } from 'lucide-react';

export function TaskManager() {
  const tasks = useLastsaveStore((s) => s.tasks);
  const addTask = useLastsaveStore((s) => s.addTask);
  const deleteTask = useLastsaveStore((s) => s.deleteTask);
  const startRescueFromTask = useLastsaveStore((s) => s.startRescueFromTask);
  const markTaskDone = useLastsaveStore((s) => s.markTaskDone);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [due, setDue] = useState('');

  const handleAdd = () => {
    if (!title.trim() || !description.trim()) return;
    addTask(title.trim(), description.trim(), due || null);
    setTitle('');
    setDescription('');
    setDue('');
  };

  return (
    <div className="relative min-h-screen px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">My Tasks</h2>
          <p className="text-sm text-neutral-400">Create tasks and kick off rescues from here.</p>
        </div>

        <div className="mb-6 rounded-lg border border-neutral-800 p-4 bg-neutral-900">
          <div className="flex gap-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" className="flex-1 rounded-md bg-neutral-800 px-3 py-2" />
            <input value={due} onChange={(e) => setDue(e.target.value)} placeholder="Due (optional)" className="w-40 rounded-md bg-neutral-800 px-3 py-2" />
          </div>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Task description" className="mt-3 w-full rounded-md bg-neutral-800 px-3 py-2" rows={3} />
          <div className="mt-3 flex justify-end">
            <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-md bg-lastsave-blue px-4 py-2 text-black">
              <Plus className="h-4 w-4" /> Add Task
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 && <p className="text-neutral-400">No tasks yet — add one above.</p>}
          {tasks.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-lg border border-neutral-800 p-3 bg-neutral-900">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-medium">{t.title}</h3>
                  <span className="text-xs text-neutral-400">{t.due}</span>
                  <span className="ml-2 rounded-full bg-neutral-800 px-2 py-0.5 text-xs">{t.status}</span>
                </div>
                <p className="mt-1 text-sm text-neutral-400">{t.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button title="Start rescue" onClick={() => startRescueFromTask(t.id)} className="rounded-md bg-lastsave-blue p-2 text-black">
                  <Play className="h-4 w-4" />
                </button>
                {t.status !== 'DONE' && (
                  <button title="Mark done" onClick={() => markTaskDone(t.id)} className="rounded-md bg-green-600 p-2">
                    ✓
                  </button>
                )}
                <button title="Delete" onClick={() => deleteTask(t.id)} className="rounded-md bg-red-600 p-2">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
