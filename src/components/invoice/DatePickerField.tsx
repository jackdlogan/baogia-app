"use client";

import { useCallback, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/lib/invoice-utils";
import { cn } from "@/lib/utils";

/** Value is ISO date string (YYYY-MM-DD). Chỉ hiện chữ (ngày hoặc placeholder), bấm vào mới mở calendar. */
export function DatePickerField({
  value,
  onChange,
  placeholder = "Chọn ngày",
  className,
  buttonClassName,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
}) {
  const [open, setOpen] = useState(false);

  const date = value ? new Date(value + "T12:00:00") : undefined;
  const display = value ? formatDate(value) : "";

  const handleSelect = useCallback(
    (d: Date | undefined) => {
      if (!d) return;
      const iso = d.toISOString().slice(0, 10);
      onChange(iso);
      setOpen(false);
    },
    [onChange]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen(true);
            }
          }}
          className={cn(
            "cursor-pointer rounded px-1 py-0.5 min-h-[1.5rem] inline-block min-w-[2rem]",
            "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-ring",
            !display && "text-muted-foreground",
            className,
            buttonClassName
          )}
        >
          {display || placeholder}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          className="rounded-md border-0"
        />
      </PopoverContent>
    </Popover>
  );
}
