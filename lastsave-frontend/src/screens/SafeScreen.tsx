import { motion } from 'framer-motion';
import { useLastsaveStore } from '../store/lastsaveStore';

export function SafeScreen() {
  const { pivotPaths, error, reset } = useLastsaveStore();

  const paths = pivotPaths ?? [
    {
      title: 'Alternative Method',
      description: 'Try alternative submission method in a safer workflow.',
      action: '#',
    },
    {
      title: 'Save Locally',
      description: 'Download and save your work before retrying.',
      action: '#download',
    },
    {
      title: 'Contact Support',
      description: 'Reach out to support for help with the next step.',
      action: 'mailto:support@example.com',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-lastsave-twilight via-neutral-950 to-black px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-white/10 bg-neutral-950/80 p-10 shadow-[0_0_80px_rgba(59,130,246,0.25)]"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-lastsave-blue">SAFE MODE</p>
          <h2 className="mt-4 text-4xl font-semibold text-white">
            When the first path closes, we open the next one.
          </h2>
          <p className="mt-4 max-w-2xl text-neutral-300">
            {error ?? 'We found a safer pivot and built your next move. Choose one and keep going.'}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {paths.map((path) => (
            <motion.div
              key={path.title}
              whileHover={{ y: -6 }}
              className="rounded-[2rem] border border-white/10 bg-black/80 p-6 shadow-[0_0_40px_rgba(59,130,246,0.2)]"
            >
              <h3 className="text-xl font-semibold text-white">{path.title}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-300">{path.description}</p>
              <a
                href={path.action}
                className="mt-6 inline-flex rounded-full bg-lastsave-blue px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-blue-400"
              >
                Take action
              </a>
            </motion.div>
          ))}
        </div>

        <button
          onClick={reset}
          className="w-full rounded-3xl bg-white px-6 py-4 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 md:w-auto"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
