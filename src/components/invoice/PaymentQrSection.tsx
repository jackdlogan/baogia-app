"use client";

import { useState } from "react";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInvoice } from "@/context/invoice-context";
import { buildSePayQrUrl } from "@/lib/sepay-banks";
import { PaymentQrDialog } from "./PaymentQrDialog";

/** Khối nút tạo QR + ảnh QR VietQR nhúng (dùng trong phần thanh toán của từng template). */
export function PaymentQrSection({
  className,
  variant = "default",
}: {
  className?: string;
  /** 'default' | 'orange' (nền cam) | 'minimal' (gọn) */
  variant?: "default" | "orange" | "minimal";
}) {
  const { data, getGrandTotal, updateField } = useInvoice();
  const [dialogOpen, setDialogOpen] = useState(false);

  const hasQr = Boolean(
    data.paymentQrBankCode?.trim() && data.paymentQrAccount?.trim()
  );
  const total = getGrandTotal();
  const qrUrl = hasQr
    ? buildSePayQrUrl({
        acc: data.paymentQrAccount!,
        bank: data.paymentQrBankCode!,
        amount: total,
        des: data.paymentQrDescription || data.invoiceNumber || "BAOGIA",
      })
    : null;

  const buttonClass =
    variant === "orange"
      ? "border-white/60 bg-white/10 text-white hover:bg-white/20"
      : variant === "minimal"
        ? "border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
        : "border-border bg-background";

  return (
    <>
      <div className={className}>
        <div className="export-hide flex flex-wrap items-center gap-2 print:hidden">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={`cursor-pointer gap-2 ${buttonClass}`}
            onClick={() => setDialogOpen(true)}
          >
            <QrCode className="size-4" />
            {hasQr ? "Sửa QR thanh toán" : "Tạo QR thanh toán"}
          </Button>
          {hasQr && (
            <button
              type="button"
              onClick={() => {
                updateField("paymentQrBankCode", "");
                updateField("paymentQrAccount", "");
                updateField("paymentQrDescription", "");
              }}
              className="text-xs text-muted-foreground underline hover:text-foreground"
            >
              Xóa QR
            </button>
          )}
        </div>
        {qrUrl && (
          <div className="mt-3 flex flex-col items-start gap-1">
            <span className="text-xs font-medium opacity-90">Quét mã chuyển khoản</span>
            <img
              src={qrUrl}
              alt="QR thanh toán VietQR"
              className="h-32 w-32 border border-black/10 bg-white object-contain"
              width={128}
              height={128}
            />
            {/* Ảnh QR vẫn hiển thị khi in nhờ export/print (không dùng export-hide) */}
          </div>
        )}
      </div>
      <PaymentQrDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
