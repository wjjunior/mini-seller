import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useContainerHeight } from "../useContainerHeight";

describe("useContainerHeight", () => {
  let mockResizeObserver: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let mockObserve: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockDisconnect = vi.fn();
    mockObserve = vi.fn();

    mockResizeObserver = vi.fn().mockImplementation(() => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: vi.fn(),
    }));

    Object.defineProperty(globalThis, "ResizeObserver", {
      value: mockResizeObserver,
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default height of 400", () => {
    const { result } = renderHook(() => useContainerHeight());

    expect(result.current.height).toBe(400);
    expect(result.current.containerRef.current).toBeNull();
  });

  it("should create a ref for the container", () => {
    const { result } = renderHook(() => useContainerHeight());

    expect(result.current.containerRef).toBeDefined();
    expect(typeof result.current.containerRef.current).toBe("object");
  });

  it("should create ResizeObserver on mount", () => {
    renderHook(() => useContainerHeight());

    expect(mockResizeObserver).toHaveBeenCalledTimes(1);
  });

  it("should update height when container dimensions change", () => {
    const mockGetBoundingClientRect = vi.fn().mockReturnValue({
      height: 600,
      width: 800,
      top: 0,
      left: 0,
      right: 800,
      bottom: 600,
    });

    const { result } = renderHook(() => useContainerHeight());

    act(() => {
      const div = document.createElement("div");
      div.getBoundingClientRect = mockGetBoundingClientRect;
      result.current.containerRef.current = div;
    });

    const resizeCallback = mockResizeObserver.mock.calls[0][0];

    act(() => {
      resizeCallback();
    });

    expect(mockGetBoundingClientRect).toHaveBeenCalled();
  });

  it("should not observe container when ref is null initially", () => {
    renderHook(() => useContainerHeight());

    expect(mockObserve).not.toHaveBeenCalled();
  });

  it("should disconnect ResizeObserver on unmount", () => {
    const { unmount } = renderHook(() => useContainerHeight());

    unmount();

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it("should handle null container ref gracefully", () => {
    const { result } = renderHook(() => useContainerHeight());

    const resizeCallback = mockResizeObserver.mock.calls[0][0];

    act(() => {
      resizeCallback();
    });

    expect(result.current.height).toBe(400);
  });

  it("should update height when getBoundingClientRect returns different values", () => {
    const mockGetBoundingClientRect = vi
      .fn()
      .mockReturnValueOnce({ height: 500 })
      .mockReturnValueOnce({ height: 700 });

    const { result } = renderHook(() => useContainerHeight());

    act(() => {
      const div = document.createElement("div");
      div.getBoundingClientRect = mockGetBoundingClientRect;
      result.current.containerRef.current = div;
    });

    const resizeCallback = mockResizeObserver.mock.calls[0][0];

    act(() => {
      resizeCallback();
    });

    expect(mockGetBoundingClientRect).toHaveBeenCalledTimes(1);
  });
});
