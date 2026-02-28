import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DEFAULT_PAGE_SIZE = 25;
const SEARCH_DEBOUNCE_MS = 300;

export interface AsyncSearchSelectFetchResult<T> {
  items: T[];
  total?: number;
  hasMore?: boolean;
}

export interface AsyncSearchSelectProps<T> {
  /** Currently selected value (getOptionValue(item)) */
  value: string | number | null;
  /** Callback when selection changes */
  onChange: (value: string | number | null, item: T | null) => void;
  /** Fetch options: search term, skip, limit. Return items and optional total/hasMore */
  fetchOptions: (
    params: { search: string; skip: number; limit: number }
  ) => Promise<AsyncSearchSelectFetchResult<T>>;
  /** Label for each option (display text) */
  getOptionLabel: (item: T) => string;
  /** Value for each option (e.g. id) */
  getOptionValue: (item: T) => string | number;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  /** Page size for initial load and load-more */
  pageSize?: number;
  disabled?: boolean;
  className?: string;
  /** Optional: trigger width */
  triggerClassName?: string;
}

export function AsyncSearchSelect<T>({
  value,
  onChange,
  fetchOptions,
  getOptionLabel,
  getOptionValue,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results.",
  pageSize = DEFAULT_PAGE_SIZE,
  disabled = false,
  className,
  triggerClassName,
}: AsyncSearchSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  /** Persist label when selected item is not in current list (e.g. after search) */
  const [lastSelectedItem, setLastSelectedItem] = useState<T | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedItem = useMemo(
    () => items.find((i) => String(getOptionValue(i)) === String(value)) ?? null,
    [items, value, getOptionValue]
  );
  const displayLabel =
    (lastSelectedItem && String(getOptionValue(lastSelectedItem)) === String(value)
      ? getOptionLabel(lastSelectedItem)
      : selectedItem
        ? getOptionLabel(selectedItem)
        : null) ?? placeholder;

  const loadPage = useCallback(
    async (searchTerm: string, skip: number, append: boolean) => {
      const isLoadMore = append;
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);
      try {
        const result = await fetchOptions({
          search: searchTerm,
          skip,
          limit: pageSize,
        });
        const newItems = result.items ?? [];
        const nextHasMore =
          result.hasMore ??
          (result.total != null ? skip + newItems.length < result.total : true);
        setHasMore(nextHasMore);
        if (append) {
          setItems((prev) => {
            const seen = new Set(prev.map((i) => getOptionValue(i)));
            const added = newItems.filter((i) => !seen.has(getOptionValue(i)));
            return prev.concat(added);
          });
        } else {
          setItems(newItems);
        }
      } catch {
        if (!append) setItems([]);
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [fetchOptions, pageSize, getOptionValue]
  );

  // Debounced search: when searchInput changes, update search after delay and refetch from 0
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(searchInput);
      debounceRef.current = null;
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  // When open or search changes, fetch first page
  useEffect(() => {
    if (!open) return;
    setHasMore(true);
    loadPage(search, 0, false);
  }, [open, search]); // eslint-disable-line react-hooks/exhaustive-deps -- loadPage identity intentionally not in deps to avoid refetch on every render

  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el || loadingMore || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const nearBottom = scrollHeight - scrollTop - clientHeight < 80;
    if (nearBottom && items.length > 0) {
      loadPage(search, items.length, true);
    }
  }, [loadingMore, hasMore, items.length, search, loadPage]);

  const handleSelect = useCallback(
    (item: T) => {
      const val = getOptionValue(item);
      setLastSelectedItem(item);
      onChange(val, item);
      setOpen(false);
      setSearchInput("");
      setSearch("");
    },
    [getOptionValue, onChange]
  );

  // Clear persisted label when value is cleared from outside
  useEffect(() => {
    if (value == null || value === "") setLastSelectedItem(null);
  }, [value]);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      setSearchInput("");
      setSearch("");
    }
  }, []);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("justify-between font-normal", triggerClassName, className)}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[200px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchInput}
            onValueChange={setSearchInput}
          />
          <CommandList
            ref={listRef}
            className="max-h-[280px] overflow-y-auto"
            onScroll={handleScroll}
          >
            {loading && items.length === 0 ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => {
                    const itemValue = getOptionValue(item);
                    const isSelected = String(itemValue) === String(value);
                    return (
                      <CommandItem
                        key={String(itemValue)}
                        value={String(itemValue)}
                        onSelect={() => handleSelect(item)}
                      >
                        {getOptionLabel(item)}
                        {isSelected ? " ✓" : ""}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {loadingMore && (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
