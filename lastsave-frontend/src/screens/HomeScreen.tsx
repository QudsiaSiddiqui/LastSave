import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Mic2 } from 'lucide-react';
import { useForgeStream } from '../hooks/useForgeStream';
import { useLastsaveStore } from '../store/lastsaveStore';

const examples = [
  'apply to stripe job',
  'write research paper on climate change',
  'create presentation for investor meeting',
  'email professor about extension',
];

const calendarEvents = [
  {
    title: 'Investor presentation prep',
    due: 'Today · 4:00 PM',
    description: 'Draft slide outline for Monday pitch',
  },
  {
    title: 'Research paper outline',
    due: 'Tomorrow · 10:00 AM',
    description: 'Finalize proposal and bibliography',
  },
  {
    title: 'Follow-up email to professor',
    due: 'Thursday · 2:00 PM',
    description: 'Send project status and extension request',
  },
];

export function HomeScreen() {
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const { error } = useLastsaveStore();
  const { startForge } = useForgeStream();

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    startForge(trimmed);
  };

  const handleVoiceInput = () => {
    setVoiceError('');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('Voice input is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        setInput(transcript);
      }
    };
    recognition.onerror = () => {
      setListening(false);
      setVoiceError('Voice capture failed. Please try again or type your task.');
    };
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 px-6 py-12">
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <motion.span
          className="absolute left-10 top-24 h-28 w-28 rounded-full bg-lastsave-blue/20 blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.span
          className="absolute right-14 top-36 h-36 w-36 rounded-full bg-lastsave-twilight/30 blur-3xl"
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.span
          className="absolute left-1/2 top-1/4 h-24 w-24 -translate-x-1/2 rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
      </motion.div>

      <div className="relative mx-auto flex max-w-4xl flex-col gap-10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-lastsave-blue">LASTSAVE</p>
          <h1 className="text-5xl font-semibold leading-tight">
            Last-minute help, forged fast.
          </h1>
          <p className="max-w-2xl text-neutral-400">
            Tell the app what you need done, then watch the backend think it through and deliver a ready-to-send result.
          </p>
        </div>

        <div className="rounded-3xl border border-neutral-800/80 bg-neutral-900/80 p-8 shadow-[0_0_60px_rgba(15,23,42,0.35)]">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="text-sm font-medium text-neutral-300">What do you need done?</label>
            <div className="flex items-center gap-3 text-sm text-neutral-400">
              <CalendarDays className="h-4 w-4" />
              Mock calendar deadlines included below.
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="e.g. apply to stripe job"
              className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-5 py-4 text-white outline-none transition focus:border-lastsave-blue"
            />
            <button
              onClick={handleVoiceInput}
              type="button"
              className="inline-flex items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-950 px-5 py-4 text-sm text-white transition hover:border-lastsave-blue/80"
            >
              <Mic2 className="mr-2 h-5 w-5" />
              {listening ? 'Listening...' : 'Voice'}
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-2xl bg-lastsave-blue px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-neutral-950 transition hover:bg-blue-400"
            >
              LASTSAVE
            </button>
          </div>

          {voiceError ? <p className="mt-4 text-sm text-red-400">{voiceError}</p> : null}
          {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="rounded-3xl border border-neutral-800/90 bg-neutral-900/90 p-6">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-lastsave-blue">Examples</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setInput(example)}
                  className="rounded-3xl border border-neutral-800/90 bg-neutral-950/90 px-5 py-4 text-left text-sm text-neutral-300 transition hover:border-lastsave-blue/80 hover:text-white"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-800/90 bg-neutral-900/90 p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-lastsave-blue">Calendar</p>
                <h2 className="mt-2 text-2xl font-semibold">Upcoming deadlines</h2>
              </div>
            </div>

            <div className="space-y-4">
              {calendarEvents.map((event) => (
                <div key={event.title} className="rounded-3xl border border-neutral-800/90 bg-neutral-950/80 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-white">{event.title}</p>
                    <span className="rounded-full bg-lastsave-blue/10 px-3 py-1 text-xs text-lastsave-blue">{event.due}</span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-400">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
