import { useState, useEffect, useRef } from "react";

const DEFAULT_DEBOUNCE_MS = 300;

/**
 * Returns a debounced version of the given value.
 * Useful for search inputs: keep instant UI updates, trigger API/effects after user stops typing.
 *
 * @param value - The value to debounce (e.g. search input value)
 * @param delayMs - Delay in milliseconds (default: 300)
 * @returns The debounced value
 *
 * @example
 * // In a search page
 * const [search, setSearch] = useState("");
 * const debouncedSearch = useDebouncedValue(search, 300);
 * // Use `search` for the input value, `debouncedSearch` for API params
 */
export function useDebouncedValue<T>(value: T, delayMs: number = DEFAULT_DEBOUNCE_MS): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      timeoutRef.current = null;
    }, delayMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delayMs]);

  return debouncedValue;
}
