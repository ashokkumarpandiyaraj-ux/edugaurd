import { useEffect, useState } from 'react';
import { Activity, CircleAlert, ShieldCheck } from 'lucide-react';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

type ApiHealth = {
  status: string;
  model_loaded: boolean;
  model_path?: string;
  model_error?: string | null;
};

export function ApiStatus() {
  const [health, setHealth] = useState<ApiHealth | null>(null);

  useEffect(() => {
    let active = true;

    const checkHealth = async () => {
      try {
        const response = await fetch(`${API_URL}/health`, {
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Health endpoint unavailable');
        }

        const result = (await response.json()) as ApiHealth;

        if (active) {
          setHealth(result);
        }
      } catch {
        if (active) {
          setHealth(null);
        }
      }
    };

    checkHealth();

    const interval = window.setInterval(checkHealth, 10000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  if (health?.model_loaded) {
    return (
      <span className="model-status connected">
        <ShieldCheck size={14} />
        API Connected · ML Model Ready
      </span>
    );
  }

  if (health?.status === 'healthy') {
    return (
      <span className="model-status mock">
        <Activity size={14} />
        API Connected · Model unavailable
      </span>
    );
  }

  return (
    <span className="model-status offline">
      <CircleAlert size={14} />
      API Offline
    </span>
  );
}