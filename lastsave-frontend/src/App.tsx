import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useLastsaveStore } from './store/lastsaveStore';
import { HomeScreen } from './screens/HomeScreen';
import { CrunchScreen } from './screens/CrunchScreen';
import { SendScreen } from './screens/SendScreen';
import { SafeScreen } from './screens/SafeScreen';
import { TaskManager } from './screens/TaskManager';

const order = ['HOME','CRUNCH','SEND','SAFE'] as const;

function App() {
  const currentState = useLastsaveStore((state) => state.currentState);
  const setState = useLastsaveStore((state) => state.setState);
  const [homeTab, setHomeTab] = useState<'TASKS' | 'QUICK'>('TASKS');
  const prevRef = useRef<string | null>(null);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const prev = prevRef.current;
    if (prev) {
      const prevIdx = order.indexOf(prev as any);
      const nextIdx = order.indexOf(currentState as any);
      setDirection(nextIdx >= prevIdx ? 1 : -1);
    }
    prevRef.current = currentState;
  }, [currentState]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir * 320, opacity: 0, scale: 0.995 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: -dir * 320, opacity: 0, scale: 0.995 }),
  };

  const onDragEnd = (_: any, info: { offset: { x: number }}) => {
    const offsetX = info.offset.x;
    // Right-swipe (positive) -> go back to HOME for easy navigation
    if (offsetX > 100) {
      setState('HOME');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-inter app-fullscreen">
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={currentState + '-' + homeTab}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={onDragEnd}
          style={{ touchAction: 'pan-y' }}
        >
          {currentState === 'HOME' && (
            <div>
              <div className="px-6 py-4">
                <div className="mx-auto max-w-4xl flex gap-4">
                  <button onClick={() => setHomeTab('TASKS')} className={`px-4 py-2 rounded-lg ${homeTab==='TASKS'? 'bg-lastsave-blue text-black': 'bg-neutral-800'} touch-target`}>
                    My Tasks
                  </button>
                  <button onClick={() => setHomeTab('QUICK')} className={`px-4 py-2 rounded-lg ${homeTab==='QUICK'? 'bg-lastsave-blue text-black': 'bg-neutral-800'} touch-target`}>
                    Quick Rescue
                  </button>
                </div>
              </div>
              {homeTab === 'TASKS' ? <TaskManager /> : <HomeScreen />}
            </div>
          )}
          {currentState === 'CRUNCH' && <CrunchScreen />}
          {currentState === 'SEND' && <SendScreen />}
          {currentState === 'SAFE' && <SafeScreen />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
