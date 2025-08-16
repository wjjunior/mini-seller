import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import useLocalStorage from "../useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should return initial value when localStorage is empty", () => {
    const { result } = renderHook(() =>
      useLocalStorage("test-key", "initial-value")
    );

    expect(result.current[0]).toBe("initial-value");
  });

  it("should return stored value from localStorage", () => {
    localStorage.setItem("test-key", JSON.stringify("stored-value"));

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "initial-value")
    );

    expect(result.current[0]).toBe("stored-value");
  });

  it("should update value and localStorage when setValue is called", () => {
    const { result } = renderHook(() =>
      useLocalStorage("test-key", "initial-value")
    );

    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
    expect(localStorage.getItem("test-key")).toBe(JSON.stringify("new-value"));
  });

  it("should update value using function updater", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(localStorage.getItem("test-key")).toBe("1");
  });

  it("should remove value from localStorage when removeValue is called", () => {
    localStorage.setItem("test-key", JSON.stringify("stored-value"));

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "initial-value")
    );

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe("initial-value");
    expect(localStorage.getItem("test-key")).toBeNull();
  });

  it("should handle complex objects", () => {
    const initialObject = { name: "John", age: 30 };
    const newObject = { name: "Jane", age: 25 };

    const { result } = renderHook(() => useLocalStorage("user", initialObject));

    act(() => {
      result.current[1](newObject);
    });

    expect(result.current[0]).toEqual(newObject);
    expect(localStorage.getItem("user")).toBe(JSON.stringify(newObject));
  });

  it("should handle arrays", () => {
    const initialArray = [1, 2, 3];
    const newArray = [4, 5, 6];

    const { result } = renderHook(() =>
      useLocalStorage("numbers", initialArray)
    );

    act(() => {
      result.current[1](newArray);
    });

    expect(result.current[0]).toEqual(newArray);
    expect(localStorage.getItem("numbers")).toBe(JSON.stringify(newArray));
  });

  it("should call onError when localStorage throws an error", () => {
    const onError = vi.fn();
    const mockError = new Error("Storage error");

    const originalLocalStorage = window.localStorage;
    const mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn().mockImplementation(() => {
        throw mockError;
      }),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
    });

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "initial-value", { onError })
    );

    act(() => {
      result.current[1]("new-value");
    });

    expect(onError).toHaveBeenCalledWith(mockError);

    Object.defineProperty(window, "localStorage", {
      value: originalLocalStorage,
      writable: true,
    });
  });

  it("should use custom serializer when provided", () => {
    const customSerializer = {
      stringify: (value: unknown) => `custom-${JSON.stringify(value)}`,
      parse: (value: string) => JSON.parse(value.replace("custom-", "")),
    };

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "initial-value", {
        serializer: customSerializer,
      })
    );

    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
    expect(localStorage.getItem("test-key")).toBe('custom-"new-value"');
  });

  it("should handle multiple instances with different keys", () => {
    const { result: result1 } = renderHook(() =>
      useLocalStorage("key1", "value1")
    );
    const { result: result2 } = renderHook(() =>
      useLocalStorage("key2", "value2")
    );

    act(() => {
      result1.current[1]("new-value1");
      result2.current[1]("new-value2");
    });

    expect(result1.current[0]).toBe("new-value1");
    expect(result2.current[0]).toBe("new-value2");
    expect(localStorage.getItem("key1")).toBe(JSON.stringify("new-value1"));
    expect(localStorage.getItem("key2")).toBe(JSON.stringify("new-value2"));
  });

  it("should handle empty strings correctly", () => {
    const { result } = renderHook(() =>
      useLocalStorage("test-key", "initial-value")
    );

    act(() => {
      result.current[1]("");
    });

    expect(result.current[0]).toBe("");
    expect(localStorage.getItem("test-key")).toBe('""');

    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
    expect(localStorage.getItem("test-key")).toBe(JSON.stringify("new-value"));

    act(() => {
      result.current[1]("");
    });

    expect(result.current[0]).toBe("");
    expect(localStorage.getItem("test-key")).toBe('""');
  });
});
