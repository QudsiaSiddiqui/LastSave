import { motion } from 'framer-motion';
import { useLastsaveStore } from '../store/lastsaveStore';

export function CrunchScreen() {
  const reasoningSteps = useLastsaveStore((state) => state.reasoningSteps);

  const latestStep = reasoningSteps.length
    ? reasoningSteps[reasoningSteps.length - 1]
    : { step: 'Preparing Forge', message: 'Connecting to the reasoning engine...' };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6">
      <motion.div
        className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-neutral-800/90 bg-black/90 px-8 py-12 shadow-[0_0_80px_rgba(0,0,0,0.7)]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-lastsave-blue">CRUNCH MODE</p>
            <h2 className="mt-3 text-4xl font-semibold">Analyzing your task</h2>
          </div>
          <div className="flex items-center gap-2 text-xs uppercase text-neutral-500">
            <span className="inline-flex h-3 w-3 animate-pulse rounded-full bg-lastsave-blue" />
            Live
          </div>
        </div>

        <div className="space-y-4">
          <motion.div
            key={latestStep.step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-lastsave-blue/20 bg-neutral-950/80 p-6"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-lastsave-blue">{latestStep.step}</p>
            <p className="mt-4 text-lg leading-8 text-neutral-100">{latestStep.message}</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-3">
            {['CLASSIFY', 'ANALYZE', 'SYNTHESIZE', 'FINALIZE'].map((label, index) => (
              <div
                key={label}
                className="rounded-3xl border border-neutral-800/90 bg-neutral-900/80 px-4 py-5 text-center"
              >
                <span className="block text-xs uppercase tracking-[0.25em] text-neutral-500">
                  {label}
                </span>
                <span className="mt-2 block text-2xl font-semibold text-white">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
