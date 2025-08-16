import { useState, useEffect, useCallback } from "react";

interface UseLocalStorageOptions {
  serializer?: {
    stringify: (value: unknown) => string;
    parse: (value: string) => unknown;
  };
  onError?: (error: Error) => void;
}

const defaultSerializer = {
  stringify: JSON.stringify,
  parse: JSON.parse,
};

const defaultOnError = (error: Error) => {
  console.warn("useLocalStorage error:", error);
};

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const { serializer = defaultSerializer, onError = defaultOnError } = options;

  const [storedValue, setStoredValue] = useState<T>(initialValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        if (typeof window === "undefined") {
          return;
        }

        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, serializer.stringify(valueToStore));
      } catch (error) {
        onError(error as Error);
      }
    },
    [key, storedValue, serializer, onError]
  );

  const removeValue = useCallback(() => {
    try {
      if (typeof window === "undefined") {
        return;
      }

      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      onError(error as Error);
    }
  }, [key, initialValue, onError]);

  useEffect(() => {
    try {
      if (typeof window === "undefined") {
        return;
      }

      const item = window.localStorage.getItem(key);
      if (item !== null) {
        const parsedValue = serializer.parse(item);
        setStoredValue(parsedValue);
      }
    } catch (error) {
      onError(error as Error);
    }
  }, [key, serializer, onError]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
