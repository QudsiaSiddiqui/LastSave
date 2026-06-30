import { useCallback } from 'react';
import { useLastsaveStore } from '../store/lastsaveStore';

export const useForgeStream = () => {
  const { setTask, addReasoningStep, setDraft, setError } = useLastsaveStore();

  const startForge = useCallback(
    (taskDescription: string) => {
      setTask(taskDescription);

      const eventSource = new EventSource(
        `http://localhost:8080/api/forge/stream?taskDescription=${encodeURIComponent(
          taskDescription,
        )}`,
      );

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.step && data.message) {
            addReasoningStep(data.step, data.message);
          }

          if (data.draft && typeof data.confidenceScore === 'number') {
            setDraft(data.draft, data.confidenceScore);
            eventSource.close();
          }
        } catch (error) {
          console.error('Parse error:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        setError('Connection failed. Please try again.');
        eventSource.close();
      };

      return () => eventSource.close();
    },
    [setTask, addReasoningStep, setDraft, setError],
  );

  return { startForge };
};
