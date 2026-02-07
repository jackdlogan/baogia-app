"use client";

import { Label } from "@/components/ui/label";
import { useInvoice } from "@/context/invoice-context";
import { formatDate } from "@/lib/invoice-utils";
import { cn } from "@/lib/utils";
import { InlineEditable, InlineEditableTextarea } from "./InlineEditable";

export function Field({
  label,
  valueKey,
  type = "text",
  className,
}: {
  label?: string;
  valueKey: keyof import("@/lib/invoice-types").InvoiceData;
  type?: "text" | "number" | "date";
  className?: string;
}) {
  const { data, updateField } = useInvoice();
  const value = data[valueKey];
  const str = value != null ? String(value) : "";

  return (
    <div className={cn("space-y-1", className)}>
      {label && <Label className="text-xs">{label}</Label>}
      <InlineEditable
        value={type === "number" ? (Number(value) || 0) : str}
        onChange={(v) =>
          updateField(
            valueKey,
            type === "number" ? (typeof v === "number" ? v : parseFloat(String(v)) || 0) : String(v)
          )
        }
        type={type}
        formatDisplay={type === "date" && str ? () => formatDate(str) : undefined}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  valueKey,
  className,
  rows = 2,
}: {
  label?: string;
  valueKey: keyof import("@/lib/invoice-types").InvoiceData;
  className?: string;
  rows?: number;
}) {
  const { data, updateField } = useInvoice();
  const value = data[valueKey];
  const str = value != null ? String(value) : "";

  return (
    <div className={cn("space-y-1", className)}>
      {label && <Label className="text-xs">{label}</Label>}
      <InlineEditableTextarea
        value={str}
        onChange={(v) => updateField(valueKey, v)}
        rows={rows}
      />
    </div>
  );
}

export function ItemField({
  itemIndex,
  field,
  type = "text",
  className,
  formatDisplay,
}: {
  itemIndex: number;
  field: keyof import("@/lib/invoice-types").InvoiceItem;
  type?: "text" | "number";
  className?: string;
  /** Format value for display (e.g. currency). When editing, raw value is shown. */
  formatDisplay?: (v: string | number) => string;
}) {
  const { data, updateItem } = useInvoice();
  const item = data.items[itemIndex];
  if (!item) return null;
  const value = item[field];
  const isNum = type === "number";
  const raw = isNum ? (Number(value) ?? 0) : (value != null ? String(value) : "");

  return (
    <InlineEditable
      value={raw}
      onChange={(v) =>
        updateItem(
          itemIndex,
          field,
          isNum ? (typeof v === "number" ? v : parseFloat(String(v)) || 0) : String(v)
        )
      }
      type={type}
      className={className}
      formatDisplay={formatDisplay}
    />
  );
}
