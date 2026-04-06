import { useEffect, useState } from "react";

export function useStoredState<T>(
  key: string,
  defaultValue: T,
  validate: (value: T) => T,
) {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        return validate(JSON.parse(stored));
      }
    } catch {
      // ignore parse/storage errors
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      const validValue = validate(state);

      if (validValue !== state) {
        setState(validValue);
        return;
      }

      localStorage.setItem(key, JSON.stringify(validValue));
    } catch {
      // ignore storage errors
    }
  }, [state, key, validate]);

  return [state, setState] as const;
}
