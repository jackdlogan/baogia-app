"use client";

import { Button } from "@/components/ui/button";
import { useInvoice } from "@/context/invoice-context";
import { formatCurrency } from "@/lib/invoice-utils";
import { DatePickerField } from "./DatePickerField";
import { ItemField } from "./InvoiceFields";
import { InlineEditable } from "./InlineEditable";

const BORDER = "rgb(51 51 51)";

export function TemplateClassic() {
  const { data, getSubtotal, getGrandTotal, removeItem, updateField, addItem } =
    useInvoice();
  const sub = getSubtotal();
  const total = getGrandTotal();
  const currencyDisplay = data.currencyDisplay || "vnd";

  return (
    <div className="font-figma flex min-h-full flex-col bg-[rgb(245_245_245)] text-[rgb(38_38_38)]">
      {/* Header */}
      <div className="shrink-0 px-8 pt-8">
        <h1 className="text-3xl font-bold tracking-tight">BÁO GIÁ</h1>
        <div className="mt-2 h-px w-[80%] shrink-0" style={{ backgroundColor: BORDER }} />
      </div>

      {/* Payable To | Billed To | Date/Due */}
      <div className="grid shrink-0 grid-cols-[1fr_1fr_auto] gap-6 px-8 py-6 text-sm">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider opacity-90">
            Bên cung cấp dịch vụ
          </p>
          <InlineEditable
            value={data.companyName || ""}
            onChange={(v) => updateField("companyName", String(v))}
            className="mb-1 block text-sm"
            placeholder="Tên công ty"
          />
          <InlineEditable
            value={data.companyAddress || ""}
            onChange={(v) => updateField("companyAddress", String(v))}
            className="mb-1 block text-sm"
            placeholder="Địa chỉ"
          />
          <InlineEditable
            value={data.companyEmail || ""}
            onChange={(v) => updateField("companyEmail", String(v))}
            className="block text-sm"
            placeholder="Email"
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider opacity-90">
            Gửi hóa đơn đến
          </p>
          <InlineEditable
            value={data.billedToName || ""}
            onChange={(v) => updateField("billedToName", String(v))}
            className="mb-1 block text-sm"
            placeholder="Tên khách hàng"
          />
          <InlineEditable
            value={data.billedToAddress || ""}
            onChange={(v) => updateField("billedToAddress", String(v))}
            className="mb-1 block text-sm"
            placeholder="Địa chỉ"
          />
          <InlineEditable
            value={data.billedToEmail || ""}
            onChange={(v) => updateField("billedToEmail", String(v))}
            className="block text-sm"
            placeholder="Email"
          />
        </div>
        <div className="text-right">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider opacity-90">
            Ngày
          </p>
          <div className="mb-4">
            <DatePickerField
              value={data.invoiceDate || ""}
              onChange={(v) => updateField("invoiceDate", v)}
              placeholder="Chọn ngày"
              buttonClassName="text-sm"
            />
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider opacity-90">
            Hạn thanh toán
          </p>
          <DatePickerField
            value={data.dueDate || ""}
            onChange={(v) => updateField("dueDate", v)}
            placeholder="Chọn ngày"
            buttonClassName="text-sm"
          />
        </div>
      </div>

      <div className="mx-8 h-px shrink-0 bg-[rgb(51_51_51)]" />

      {/* Project Name */}
      <div className="flex shrink-0 items-baseline justify-between gap-4 px-8 py-4 text-sm">
        <span className="text-xs font-bold uppercase tracking-wider opacity-90">
          Tên dự án
        </span>
        <InlineEditable
          value={data.projectName ?? ""}
          onChange={(v) => updateField("projectName", String(v))}
          className="min-w-0 flex-1 text-right text-sm"
          placeholder="Tên dự án"
        />
      </div>
      <div className="mx-8 h-px shrink-0 bg-[rgb(51_51_51)]" />

      {/* Table: Description, Qty., Amount, Total */}
      <div className="mx-8 mt-4 flex min-h-0 flex-1 flex-col overflow-x-auto">
        <table className="w-full shrink-0 border-collapse text-sm" style={{ borderColor: BORDER }}>
          <thead>
            <tr>
              <th
                className="border px-3 py-2 text-left text-xs font-bold uppercase"
                style={{ borderColor: BORDER }}
              >
                Mô tả
              </th>
              <th
                className="border px-3 py-2 text-center text-xs font-bold uppercase"
                style={{ borderColor: BORDER }}
              >
                SL
              </th>
              <th
                className="border px-3 py-2 text-right text-xs font-bold uppercase"
                style={{ borderColor: BORDER }}
              >
                Đơn giá
              </th>
              <th
                className="border px-3 py-2 text-right text-xs font-bold uppercase"
                style={{ borderColor: BORDER }}
              >
                Thành tiền
              </th>
              <th className="export-hide w-10 border print:hidden" style={{ borderColor: BORDER }} />
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i) => (
              <tr key={i}>
                <td className="border px-3 py-2" style={{ borderColor: BORDER }}>
                  <ItemField itemIndex={i} field="description" className="min-w-[140px]" />
                </td>
                <td className="border px-3 py-2 text-center" style={{ borderColor: BORDER }}>
                  <ItemField
                    itemIndex={i}
                    field="quantity"
                    type="number"
                    className="w-14 text-center"
                  />
                </td>
                <td className="border px-3 py-2 text-right" style={{ borderColor: BORDER }}>
                  <ItemField
                    itemIndex={i}
                    field="unitPrice"
                    type="number"
                    className="w-24 text-right"
                    formatDisplay={(v) => formatCurrency(Number(v) || 0, currencyDisplay)}
                  />
                </td>
                <td className="border px-3 py-2 text-right" style={{ borderColor: BORDER }}>
                  {formatCurrency(
                    (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
                    currencyDisplay
                  )}
                </td>
                <td className="export-hide border px-3 py-2 print:hidden" style={{ borderColor: BORDER }}>
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
              <td
                colSpan={5}
                className="border border-dashed px-3 py-2"
                style={{ borderColor: BORDER }}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full border-dashed bg-white font-medium hover:bg-[rgb(247_247_247)]"
                  style={{ borderColor: BORDER }}
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

      {/* Subtotal / GST / Total (right-aligned) */}
      <div className="mx-8 mt-4 max-w-[280px] shrink-0 border border-[rgb(51_51_51)] bg-white p-4 ml-auto">
        <div className="flex justify-between py-1.5 text-sm">
          <span className="font-bold uppercase">Tạm tính</span>
          <span>{formatCurrency(sub, currencyDisplay)}</span>
        </div>
        <div className="flex justify-between py-1.5 text-sm">
          <span className="font-bold uppercase">Giảm giá</span>
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
        <div
          className="flex justify-between border-t-2 py-2 text-sm font-bold"
          style={{ borderColor: BORDER }}
        >
          <span className="uppercase">Tổng cộng</span>
          <span>{formatCurrency(total, currencyDisplay)}</span>
        </div>
      </div>

      <div className="mx-8 mt-6 h-px shrink-0 bg-[rgb(51_51_51)]" />

      {/* Payment Information */}
      <div className="shrink-0 px-8 py-4 text-sm">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider opacity-90">
          Thông tin thanh toán
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-bold">Chuyển khoản</p>
            <InlineEditable
              value={data.bankInfo || ""}
              onChange={(v) => updateField("bankInfo", String(v))}
              className="block text-sm"
              placeholder="Chủ tài khoản, số TK, ngân hàng..."
            />
          </div>
          <div>
            <p className="mb-1 text-xs font-bold">PayPal / Wise</p>
            <InlineEditable
              value={data.companyEmail || ""}
              onChange={(v) => updateField("companyEmail", String(v))}
              className="block text-sm"
              placeholder="Email"
            />
          </div>
        </div>
      </div>

      <div className="mx-8 h-px shrink-0 bg-[rgb(51_51_51)]" />

      {/* Contact + Thank You */}
      <div className="grid shrink-0 grid-cols-1 gap-6 px-8 py-6 sm:grid-cols-2">
        <div className="text-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider opacity-90">
            Liên hệ
          </p>
          <InlineEditable
            value={data.companyEmail || ""}
            onChange={(v) => updateField("companyEmail", String(v))}
            className="mb-1 block text-sm"
            placeholder="Email"
          />
          <InlineEditable
            value={data.companyWebsite ?? ""}
            onChange={(v) => updateField("companyWebsite", String(v))}
            className="mb-1 block text-sm"
            placeholder="Website"
          />
          <InlineEditable
            value={data.companyPhone || ""}
            onChange={(v) => updateField("companyPhone", String(v))}
            className="mb-1 block text-sm"
            placeholder="Số điện thoại"
          />
          <InlineEditable
            value={data.taxId ?? ""}
            onChange={(v) => updateField("taxId", String(v))}
            className="block text-sm"
            placeholder="Mã số thuế"
          />
        </div>
        <div className="flex items-center justify-center border-2 py-6 text-center" style={{ borderColor: BORDER }}>
          <span className="text-lg font-bold italic">CẢM ƠN</span>
        </div>
      </div>
    </div>
  );
}
