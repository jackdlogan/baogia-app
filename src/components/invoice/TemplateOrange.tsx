"use client";

import { Button } from "@/components/ui/button";
import { useInvoice } from "@/context/invoice-context";
import { formatCurrency } from "@/lib/invoice-utils";
import { DatePickerField } from "./DatePickerField";
import { ItemField } from "./InvoiceFields";
import { InlineEditable } from "./InlineEditable";

export function TemplateOrange() {
  const { data, getGrandTotal, removeItem, updateField, addItem } = useInvoice();
  const total = getGrandTotal();
  const currencyDisplay = data.currencyDisplay || "vnd";

  return (
    <div className="flex min-h-full flex-col bg-white text-black">
      <div className="flex flex-wrap justify-between gap-6 px-8 pt-8 pb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold">BÁO GIÁ</h1>
          <p className="mt-1 text-sm font-semibold">
            Client – {data.billedToName || "..."}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-1 text-sm">
            <span>Thời gian:</span>
            <DatePickerField
              value={data.invoiceDate || ""}
              onChange={(v) => updateField("invoiceDate", v)}
              placeholder="Từ ngày"
              buttonClassName="h-7 w-36 text-sm"
            />
            <span>–</span>
            <DatePickerField
              value={data.dueDate || ""}
              onChange={(v) => updateField("dueDate", v)}
              placeholder="Đến ngày"
              buttonClassName="h-7 w-36 text-sm"
            />
          </p>
          <p className="mt-1 flex items-center gap-1 text-sm">
            <span>Số hóa đơn:</span>
            <InlineEditable
              value={data.invoiceNumber || ""}
              onChange={(v) => updateField("invoiceNumber", String(v))}
              className="h-7 w-28 text-sm"
            />
          </p>
        </div>
        <div className="flex flex-col gap-1 text-right text-sm">
          <InlineEditable
            value={data.billedToName || ""}
            onChange={(v) => updateField("billedToName", String(v))}
            placeholder="Tên khách hàng"
            className="text-sm"
          />
          <InlineEditable
            value={data.billedToAddress || ""}
            onChange={(v) => updateField("billedToAddress", String(v))}
            placeholder="Địa chỉ"
            className="text-sm"
          />
          <InlineEditable
            value={data.billedToEmail || ""}
            onChange={(v) => updateField("billedToEmail", String(v))}
            placeholder="Email"
            className="text-sm"
          />
        </div>
      </div>
      <div className="mx-8 h-px shrink-0 bg-black" />
      <div className="mx-8 mt-6 flex min-h-0 flex-1 flex-col overflow-x-auto">
        <table className="w-full shrink-0 text-sm">
          <thead>
            <tr>
              <th className="pb-2 text-left font-bold">Mô tả</th>
              <th className="pb-2 text-right font-bold">SL</th>
              <th className="pb-2 text-right font-bold">Đơn giá</th>
              <th className="pb-2 text-right font-bold">Thành tiền</th>
              <th className="export-hide w-10 print:hidden" />
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i) => (
              <tr key={i}>
                <td className="py-2">
                  <ItemField itemIndex={i} field="description" className="min-w-[180px]" />
                </td>
                <td className="py-2 text-right">
                  <ItemField itemIndex={i} field="quantity" type="number" className="w-16 text-right" />
                </td>
                <td className="py-2 text-right">
                  <ItemField
                    itemIndex={i}
                    field="unitPrice"
                    type="number"
                    className="w-24 text-right"
                    formatDisplay={(v) => formatCurrency(Number(v) || 0, currencyDisplay)}
                  />
                </td>
                <td className="py-2 text-right">
                  {formatCurrency(
                    (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
                    currencyDisplay
                  )}
                </td>
                <td className="export-hide py-2 print:hidden">
                  {data.items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(i)}
                    >
                      ×
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            <tr className="export-hide print:hidden">
              <td colSpan={5} className="border-t border-black/10 py-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full border-dashed border-black/25 bg-white/80 text-sm font-medium text-black/70 hover:bg-black/5 hover:border-black/40 hover:text-black"
                  onClick={addItem}
                >
                  ＋ Thêm dòng
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex-1 min-h-0" aria-hidden />
      </div>
      <div className="mt-8 shrink-0 bg-[#d45b0b] px-8 py-6 text-white">
        <div className="mb-5">
          <div className="border-b border-white/60 pb-1 text-sm font-bold">
            Thông tin bổ sung
          </div>
          <div className="mt-2">
            <InlineEditable
              value={data.bankInfo || ""}
              onChange={(v) => updateField("bankInfo", String(v))}
              placeholder="Thông tin ngân hàng"
              className="text-sm text-white hover:bg-white/20"
            />
          </div>
        </div>
        <div className="mb-5">
          <div className="border-b border-white/60 pb-1 text-sm font-bold">Tổng thanh toán</div>
          <div className="text-3xl font-bold">{formatCurrency(total, currencyDisplay)}</div>
          <div className="mt-1 text-sm opacity-95">
            <InlineEditable
              value={data.paymentTerms || ""}
              onChange={(v) => updateField("paymentTerms", String(v))}
              placeholder="Điều kiện thanh toán"
              className="text-white hover:bg-white/20"
            />
          </div>
        </div>
        <div className="flex justify-between border-t border-white/40 pt-4 text-sm">
          <span>
            Cảm ơn! —{" "}
            <InlineEditable
              value={data.companyEmail || ""}
              onChange={(v) => updateField("companyEmail", String(v))}
              placeholder="Email"
              className="inline-block text-white hover:bg-white/20"
            />
          </span>
          <span className="font-bold">
            <InlineEditable
              value={data.currencyCode || ""}
              onChange={(v) => updateField("currencyCode", String(v))}
              placeholder="VND"
              className="inline-block text-center text-white hover:bg-white/20"
            />
          </span>
        </div>
      </div>
    </div>
  );
}
