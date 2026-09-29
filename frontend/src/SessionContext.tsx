import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

const SESSION_KEY = 'eduguard-demo-session';

interface DemoSessionValue {
  signedIn: boolean;
  enterDemo: () => void;
  signOut: () => void;
}

const DemoSessionContext = createContext<DemoSessionValue | null>(null);

export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'active');
  const value = useMemo<DemoSessionValue>(() => ({
    signedIn,
    enterDemo: () => { sessionStorage.setItem(SESSION_KEY, 'active'); setSignedIn(true); },
    signOut: () => { sessionStorage.removeItem(SESSION_KEY); setSignedIn(false); },
  }), [signedIn]);
  return <DemoSessionContext.Provider value={value}>{children}</DemoSessionContext.Provider>;
}

export function useDemoSession(): DemoSessionValue {
  const value = useContext(DemoSessionContext);
  if (!value) throw new Error('useDemoSession must be used within DemoSessionProvider');
  return value;
}
