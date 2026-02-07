"use client";

import { useInvoice } from "@/context/invoice-context";
import type { TemplateId } from "@/lib/invoice-types";
import { TemplateOrange } from "./TemplateOrange";
import { TemplateGrey } from "./TemplateGrey";
import { TemplateClassic } from "./TemplateClassic";

export function InvoiceView() {
  const { template } = useInvoice();

  return (
    <div
      id="invoice-print-area"
      className="flex min-h-[297mm] w-full max-w-[210mm] shrink-0 flex-col rounded-xl bg-white shadow-md print:max-w-none print:shadow-none"
    >
      {template === "professional" && <TemplateOrange />}
      {template === "minimal" && <TemplateGrey />}
      {template === "classic" && <TemplateClassic />}
    </div>
  );
}
