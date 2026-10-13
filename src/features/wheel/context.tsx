import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { initialStore, validateStore, writeStore, STORAGE_KEY, type Store } from './storage';
type State = { store: Store; ready: boolean; error: string; commit: (next: Store) => boolean; clearError: () => void };
const Context = createContext<State | null>(null);
export function WheelProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState(initialStore);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) setStore(validateStore(JSON.parse(saved))); }
    catch { setError('Dina sparade hjul kunde inte läsas. De har inte skrivits över.'); }
    setReady(true);
  }, []);
  function commit(next: Store) {
    try { writeStore(next); setStore(next); setError(''); return true; }
    catch { setError('Det gick inte att spara på enheten. Kontrollera att webbläsarlagring är tillåten och försök igen.'); return false; }
  }
  return <Context.Provider value={{ store, ready, error, commit, clearError: () => setError('') }}>{children}</Context.Provider>;
}
export function useWheels() {
  const state = useContext(Context);
  if (!state) throw new Error('WheelProvider missing');
  return state;
}
