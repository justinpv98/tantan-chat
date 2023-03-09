import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import useDebouncedValue from "./useDebouncedValue";

describe("useDebouncedValue", () => {
  it("should return the initial value", () => {
    const { result } = renderHook(() => useDebouncedValue("initialValue"));

    expect(result.current).toBe("initialValue");
  });

  it("should update the debounced value after the specified delay", async () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: "initialValue", delay: 500 },
      }
    );

    expect(result.current).toBe("initialValue");

    act(() => vi.advanceTimersByTime(600));

    await act(() => {
      rerender({ value: "updatedValue", delay: 500 });
    });

    expect(result.current).toBe("initialValue");

    act(() => vi.advanceTimersByTime(250));
    expect(result.current).toBe("initialValue");

    act(() => vi.advanceTimersByTime(250));

    expect(result.current).toBe("updatedValue");

    vi.useRealTimers();
  });
});
