import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface MultiSelectOption {
  value: string | number;
  label: string;
  description?: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  /** Max height of the options list */
  maxHeight?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  emptyMessage = "No options",
  disabled = false,
  className,
  triggerClassName,
  maxHeight = "240px",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const valueSet = React.useMemo(() => new Set(value.map(String)), [value]);

  const toggle = (optValue: string | number) => {
    const str = String(optValue);
    if (valueSet.has(str)) {
      onChange(value.filter((v) => String(v) !== str));
    } else {
      onChange([...value, optValue]);
    }
  };

  const displayLabel =
    value.length === 0
      ? placeholder
      : value.length === 1
        ? options.find((o) => String(o.value) === String(value[0]))?.label ?? String(value[0])
        : `${value.length} selected`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "justify-between font-normal min-h-10 h-auto py-2",
            triggerClassName,
            className
          )}
        >
          <span className="truncate text-left flex-1">{displayLabel}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <ScrollArea style={{ maxHeight }}>
          <div className="p-1">
            {options.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              options.map((option) => {
                const isChecked = valueSet.has(String(option.value));
                return (
                  <div
                    key={String(option.value)}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggle(option.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggle(option.value);
                      }
                    }}
                    className={cn(
                      "flex items-start gap-2 rounded-sm px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground select-none"
                    )}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggle(option.value)}
                      className="mt-0.5"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 overflow-hidden">
                      <div className="font-medium">{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
