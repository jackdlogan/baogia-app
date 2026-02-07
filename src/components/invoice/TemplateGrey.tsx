"use client";

import { Button } from "@/components/ui/button";
import { useInvoice } from "@/context/invoice-context";
import { formatCurrency } from "@/lib/invoice-utils";
import { DatePickerField } from "./DatePickerField";
import { ItemField } from "./InvoiceFields";
import { InlineEditable } from "./InlineEditable";

export function TemplateGrey() {
  const { data, getSubtotal, getGrandTotal, removeItem, updateField, addItem } =
    useInvoice();
  const sub = getSubtotal();
  const total = getGrandTotal();
  const currencyDisplay = data.currencyDisplay || "vnd";

  return (
    <div className="flex min-h-full flex-col bg-white">
      <div className="mx-8 mt-8 shrink-0 rounded-xl bg-[rgb(247_247_247/0.8)] p-6">
        <div className="flex flex-wrap justify-between gap-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Báo giá</h1>
            <p className="mt-2 text-xs text-muted-foreground">Gửi hóa đơn đến:</p>
            <InlineEditable
              value={data.billedToName || ""}
              onChange={(v) => updateField("billedToName", String(v))}
              className="mt-1 font-semibold"
              placeholder="Tên khách hàng"
            />
            <InlineEditable
              value={data.billedToAddress || ""}
              onChange={(v) => updateField("billedToAddress", String(v))}
              className="mt-1 block text-xs text-muted-foreground"
              placeholder="Địa chỉ"
            />
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Số báo giá</p>
            <InlineEditable
              value={data.invoiceNumber || ""}
              onChange={(v) => updateField("invoiceNumber", String(v))}
              className="mt-1 inline-block w-28 font-semibold text-foreground"
            />
            <p className="mt-2">Ngày lập</p>
            <div className="mt-1 inline-block w-36">
              <DatePickerField
                value={data.invoiceDate || ""}
                onChange={(v) => updateField("invoiceDate", v)}
                placeholder="Chọn ngày"
                buttonClassName="font-semibold text-foreground"
              />
            </div>
            <p className="mt-2">Hạn thanh toán</p>
            <div className="mt-1 inline-block w-36">
              <DatePickerField
                value={data.dueDate || ""}
                onChange={(v) => updateField("dueDate", v)}
                placeholder="Chọn ngày"
                buttonClassName="font-semibold text-foreground"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-8 h-px shrink-0 bg-border" />
      <div className="mx-8 mt-5 flex min-h-0 flex-1 flex-col overflow-x-auto">
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
                  <ItemField itemIndex={i} field="description" className="min-w-[160px]" />
                </td>
                <td className="py-2 text-right">
                  <ItemField
                    itemIndex={i}
                    field="quantity"
                    type="number"
                    className="w-16 text-right"
                  />
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
                      className="text-destructive"
                      onClick={() => removeItem(i)}
                    >
                      ×
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            <tr className="export-hide print:hidden">
              <td colSpan={5} className="border-t border-border py-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-full rounded-lg border border-dashed border-[rgb(142_142_142/0.3)] bg-[rgb(247_247_247/0.5)] text-muted-foreground hover:bg-muted hover:text-foreground"
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
      <div className="mx-8 mb-6 mt-4 max-w-[260px] shrink-0 rounded-lg bg-[rgb(247_247_247/0.8)] p-4 ml-auto">
        <div className="flex justify-between py-1 text-sm">
          <span>Tạm tính</span>
          <span>{formatCurrency(sub, currencyDisplay)}</span>
        </div>
        <div className="flex justify-between py-1 text-sm">
          <span>Giảm giá</span>
          <span>
            <InlineEditable
              value={Number(data.discountAmount) || 0}
              onChange={(v) =>
                updateField(
                  "discountAmount",
                  typeof v === "number" ? v : parseFloat(String(v)) || 0
                )
              }
              type="number"
              className="w-24 text-right"
              formatDisplay={(v) => formatCurrency(Number(v) || 0, currencyDisplay)}
            />
          </span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 text-sm font-bold">
          <span>Tổng cộng ({currencyDisplay === "usd" ? "USD" : "VND"})</span>
          <span>{formatCurrency(total, currencyDisplay)}</span>
        </div>
      </div>
      <div className="grid shrink-0 grid-cols-2 gap-6 border-t border-border px-8 py-6 text-sm text-muted-foreground">
        <div>
          <p className="mb-2 font-semibold text-foreground">Hướng dẫn thanh toán</p>
          <InlineEditable
            value={data.bankInfo || ""}
            onChange={(v) => updateField("bankInfo", String(v))}
            className="mb-1 block text-xs"
            placeholder="Thông tin ngân hàng"
          />
          <InlineEditable
            value={data.paymentTerms || ""}
            onChange={(v) => updateField("paymentTerms", String(v))}
            className="block text-xs"
            placeholder="Điều kiện thanh toán"
          />
        </div>
        <div>
          <p className="mb-2 font-semibold text-foreground">Ghi chú thêm</p>
          <InlineEditable
            value={data.additionalInfo || ""}
            onChange={(v) => updateField("additionalInfo", String(v))}
            className="block text-xs"
            placeholder="Ghi chú"
          />
        </div>
      </div>
    </div>
  );
}
