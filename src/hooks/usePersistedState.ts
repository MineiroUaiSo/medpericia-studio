import { useEffect, useState } from 'react';

/** useState espelhado no localStorage; funciona em memória se o storage falhar. */
export function usePersistedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage indisponível
    }
  }, [key, value]);

  return [value, setValue] as const;
}
