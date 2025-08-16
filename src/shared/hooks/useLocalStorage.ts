import { useState, useEffect, useCallback, useRef } from "react";

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
  const lastSavedValueRef = useRef<string>("");
  const isInitializedRef = useRef(false);
  const shouldSkipNextUpdateRef = useRef(false);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => (value instanceof Function ? value(prev) : value));
  }, []);

  const removeValue = useCallback(() => {
    try {
      if (typeof window === "undefined") return;

      shouldSkipNextUpdateRef.current = true;
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      lastSavedValueRef.current = "";
    } catch (error) {
      onError(error as Error);
    }
  }, [key, initialValue, onError]);

  useEffect(() => {
    if (isInitializedRef.current) return;

    try {
      if (typeof window === "undefined") return;

      const item = window.localStorage.getItem(key);
      if (item !== null) {
        const parsedValue = serializer.parse(item) as T;
        setStoredValue(parsedValue);
        lastSavedValueRef.current = item;
      } else {
        const serializedInitialValue = serializer.stringify(initialValue);
        window.localStorage.setItem(key, serializedInitialValue);
        lastSavedValueRef.current = serializedInitialValue;
      }
      isInitializedRef.current = true;
    } catch (error) {
      onError(error as Error);
      isInitializedRef.current = true;
    }
  }, [key, serializer, onError, initialValue]);

  useEffect(() => {
    if (!isInitializedRef.current) return;

    if (shouldSkipNextUpdateRef.current) {
      shouldSkipNextUpdateRef.current = false;
      return;
    }

    try {
      if (typeof window === "undefined") return;

      const serializedValue = serializer.stringify(storedValue);

      if (serializedValue !== lastSavedValueRef.current) {
        window.localStorage.setItem(key, serializedValue);
        lastSavedValueRef.current = serializedValue;
      }
    } catch (error) {
      onError(error as Error);
    }
  }, [key, serializer, onError, storedValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
