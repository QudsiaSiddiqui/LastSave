import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLastsaveStore } from '../store/lastsaveStore';

interface ResolveResponse {
  status: 'SUCCESS' | 'FAILED';
  receipt: string | null;
  message: string;
}

interface PhoenixResponse {
  paths: Array<{
    title: string;
    description: string;
    action: string;
  }>;
}

export function SendScreen() {
  const {
    draft,
    confidenceScore,
    taskDescription,
    setPivotPaths,
    setState,
    setError,
  } = useLastsaveStore();
  const [submitting, setSubmitting] = useState(false);
  const [resolveMessage, setResolveMessage] = useState<string | null>(null);

  const handleResolve = async (forceFail = false) => {
    setSubmitting(true);
    setResolveMessage(null);

    try {
      const response = await fetch('http://localhost:8080/api/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskDescription,
          forceFail,
        }),
      });

      const data = (await response.json()) as ResolveResponse;

      if (response.ok && data.status === 'SUCCESS') {
        setResolveMessage(`Success! Receipt: ${data.receipt}`);
        return;
      }

      throw new Error(data.message || 'Resolve failed');
    } catch (error) {
      setError('Resolve failed. Redirecting to SAFE mode.');
      try {
        const phoenixResponse = await fetch('http://localhost:8080/api/phoenix/recover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskType: 'UNKNOWN' }),
        });

        const data = (await phoenixResponse.json()) as PhoenixResponse;
        setPivotPaths(data.paths);
        setState('SAFE');
      } catch {
        setError('Recovery failed. Please refresh and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-[2rem] border border-neutral-800/90 bg-neutral-900/80 p-8 shadow-[0_0_70px_rgba(0,0,0,0.5)]"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-lastsave-blue">SEND</p>
              <h2 className="mt-2 text-3xl font-semibold">Draft Preview</h2>
            </div>
            <div className="rounded-full bg-lastsave-blue/10 px-4 py-2 text-sm font-semibold text-lastsave-blue">
              Confidence {confidenceScore ?? 0}%
            </div>
          </div>

          <div className="min-h-[420px] rounded-[1.8rem] border border-neutral-800/90 bg-neutral-950/90 p-6">
            <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-neutral-200">
              {draft ?? 'Draft is loading...'}
            </pre>
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 rounded-[2rem] border border-neutral-800/90 bg-neutral-900/80 p-8 shadow-[0_0_70px_rgba(0,0,0,0.5)]"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-lastsave-blue">Actions</p>
            <h3 className="mt-3 text-2xl font-semibold">Finalize the rescue</h3>
          </div>

          <button
            onClick={() => handleResolve(false)}
            disabled={submitting}
            className="w-full rounded-3xl bg-lastsave-blue px-6 py-4 text-sm font-semibold text-neutral-950 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Resolving...' : 'RESOLVE'}
          </button>

          <button
            onClick={() => handleResolve(true)}
            disabled={submitting}
            className="w-full rounded-3xl border border-neutral-700/90 bg-neutral-950 px-6 py-4 text-sm font-semibold text-neutral-200 transition hover:border-lastsave-blue/80 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Simulate Failure
          </button>

          {resolveMessage ? (
            <div className="rounded-3xl border border-lastsave-blue/30 bg-lastsave-blue/10 p-4 text-sm text-lastsave-blue">
              {resolveMessage}
            </div>
          ) : null}

          <div className="rounded-3xl bg-neutral-950/80 p-5 text-sm text-neutral-300">
            <p className="font-semibold text-white">Task</p>
            <p className="mt-2">{taskDescription}</p>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
