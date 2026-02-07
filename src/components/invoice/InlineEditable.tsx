"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type BaseProps = {
  className?: string;
  placeholder?: string;
};

/** Hiển thị text, click vào mới hiện input. Blur hoặc Enter để lưu. */
export function InlineEditable({
  value,
  onChange,
  type = "text",
  className,
  placeholder = "...",
  formatDisplay,
}: BaseProps & {
  value: string | number;
  onChange: (value: string | number) => void;
  type?: "text" | "number" | "date";
  formatDisplay?: (v: string | number) => string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value ?? ""));
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue =
    value !== undefined && value !== null && value !== ""
      ? formatDisplay
        ? formatDisplay(value)
        : String(value)
      : "";

  useEffect(() => {
    if (isEditing) {
      setEditValue(value !== undefined && value !== null ? String(value) : "");
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing, value]);

  const save = () => {
    if (type === "number") {
      const n = editValue === "" ? 0 : parseFloat(editValue) || 0;
      onChange(n);
    } else {
      onChange(editValue.trim());
    }
    setIsEditing(false);
  };

  const cancel = () => {
    setEditValue(value !== undefined && value !== null ? String(value) : "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            save();
          }
          if (e.key === "Escape") cancel();
        }}
        className={cn("h-8 text-sm", className)}
      />
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => setIsEditing(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setIsEditing(true);
      }}
      className={cn(
        "cursor-text rounded px-1 py-0.5 min-h-[1.5rem] inline-block min-w-[2rem]",
        "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-ring",
        !displayValue && "text-muted-foreground",
        className
      )}
    >
      {displayValue || placeholder}
    </span>
  );
}

/** Phiên bản textarea: click hiện Textarea, blur lưu. */
export function InlineEditableTextarea({
  value,
  onChange,
  className,
  placeholder = "...",
  rows = 2,
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value ?? "");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      setEditValue(value ?? "");
      inputRef.current?.focus();
    }
  }, [isEditing, value]);

  const save = () => {
    onChange(editValue.trim());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Textarea
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setEditValue(value ?? "");
            setIsEditing(false);
          }
        }}
        rows={rows}
        className={cn("min-h-0 resize-none text-sm", className)}
      />
    );
  }

  const displayValue = value?.trim() || "";

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => setIsEditing(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setIsEditing(true);
      }}
      className={cn(
        "cursor-text rounded px-1 py-0.5 block min-h-[2rem] whitespace-pre-wrap",
        "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-ring",
        !displayValue && "text-muted-foreground",
        className
      )}
    >
      {displayValue || placeholder}
    </span>
  );
}
