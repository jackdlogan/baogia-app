"use client";

import Image from "next/image";
import { FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInvoice } from "@/context/invoice-context";
import type { TemplateId } from "@/lib/invoice-types";
import { cn } from "@/lib/utils";

const TEMPLATES: { id: TemplateId; label: string; thumb: string }[] = [
  { id: "professional", label: "Mới mẻ", thumb: "/assets/template-orange.png" },
  { id: "minimal", label: "Hiện đại", thumb: "/assets/template-grey.png" },
  { id: "classic", label: "Cổ điển", thumb: "/assets/template-classic.png" },
];

export function Sidebar() {
  const { template, setTemplate, data, updateField } = useInvoice();

  const hideExportElements = () => {
    document.querySelectorAll("#invoice-print-area .export-hide").forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });
  };
  const showExportElements = () => {
    document.querySelectorAll("#invoice-print-area .export-hide").forEach((el) => {
      (el as HTMLElement).style.display = "";
    });
  };

  const handleExportPNG = async () => {
    const el = document.getElementById("invoice-print-area");
    if (!el) return;
    hideExportElements();
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `baogia-${data.invoiceNumber || "bg"}.png`;
      a.click();
    } finally {
      showExportElements();
    }
  };

  const handlePrint = () => window.print();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card p-4 print:hidden">
      <h2 className="text-lg font-semibold">Mẫu báo giá</h2>
      <p className="text-muted-foreground text-xs">Chọn giao diện</p>
      <div className="mt-3 flex flex-1 flex-col gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTemplate(t.id)}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border-2 p-0 overflow-hidden text-left transition-all",
              template === t.id
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            <div className="relative h-14 w-20 shrink-0 bg-muted">
              <Image
                src={t.thumb}
                alt={t.label}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <span
              className={cn(
                "text-sm font-medium pr-2",
                template === t.id && "text-primary"
              )}
            >
              {t.label}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <p className="text-muted-foreground text-xs font-medium">Đơn vị tiền</p>
        <div className="flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
          <button
            type="button"
            onClick={() => updateField("currencyDisplay", "vnd")}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center rounded-md py-1.5 text-sm font-medium transition-colors",
              data.currencyDisplay === "vnd"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            đ
          </button>
          <button
            type="button"
            onClick={() => updateField("currencyDisplay", "usd")}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center rounded-md py-1.5 text-sm font-medium transition-colors",
              data.currencyDisplay === "usd"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            $
          </button>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-2">
        <Button variant="default" size="sm" onClick={handleExportPNG} className="cursor-pointer gap-2">
          <FileImage className="size-4 shrink-0" />
          Lưu thành PNG
        </Button>
        <Button variant="secondary" size="sm" onClick={handlePrint} className="cursor-pointer hover:bg-muted">
          In báo giá
        </Button>
      </div>
    </aside>
  );
}
