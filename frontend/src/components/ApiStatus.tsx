import { useEffect, useState } from 'react';
import { Activity, CircleAlert, ShieldCheck } from 'lucide-react';
import type { ApiHealth } from '../types';

export function ApiStatus() {
  const [health, setHealth] = useState<ApiHealth | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/health', { headers: { Accept: 'application/json' } })
      .then(async (response) => {
        if (!response.ok) throw new Error('Health endpoint unavailable');
        return await response.json() as ApiHealth;
      })
      .then((result) => { if (active) setHealth(result); })
      .catch(() => { if (active) setHealth(null); });
    return () => { active = false; };
  }, []);

  if (health?.model_available) {
    return <span className="model-status connected"><ShieldCheck size={14} /> Model connected</span>;
  }
  if (health?.status === 'ok') {
    return <span className="model-status mock"><Activity size={14} /> Mock data · model not connected</span>;
  }
  return <span className="model-status offline"><CircleAlert size={14} /> Demo data · API offline</span>;
}
