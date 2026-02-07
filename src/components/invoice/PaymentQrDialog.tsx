"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInvoice } from "@/context/invoice-context";
import { SEPAY_BANKS } from "@/lib/sepay-banks";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PaymentQrDialog({ open, onOpenChange }: Props) {
  const { data, updateField } = useInvoice();
  const [bank, setBank] = useState(data.paymentQrBankCode || "");
  const [account, setAccount] = useState(data.paymentQrAccount || "");
  const [des, setDes] = useState(data.paymentQrDescription ?? data.invoiceNumber ?? "");

  const handleOpenChange = (next: boolean) => {
    if (!next) onOpenChange(false);
    else {
      setBank(data.paymentQrBankCode || "");
      setAccount(data.paymentQrAccount || "");
      setDes(data.paymentQrDescription ?? data.invoiceNumber ?? "");
    }
    onOpenChange(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const acc = account.replace(/\s/g, "");
    const desc = des.replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
    updateField("paymentQrBankCode", bank);
    updateField("paymentQrAccount", acc);
    updateField("paymentQrDescription", desc);
    onOpenChange(false);
  };

  const valid = bank.trim() !== "" && account.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR thanh toán VietQR</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="sepay-bank">Ngân hàng thụ hưởng</Label>
            <select
              id="sepay-bank"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">-- Chọn ngân hàng --</option>
              {SEPAY_BANKS.map((b) => (
                <option key={b.code} value={b.short_name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sepay-acc">Số tài khoản</Label>
            <Input
              id="sepay-acc"
              type="text"
              placeholder="Chỉ nhập chữ, số, không dấu"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sepay-des">Nội dung chuyển khoản (tùy chọn)</Label>
            <Input
              id="sepay-des"
              type="text"
              placeholder="Chữ, số, không dấu. Mặc định: số báo giá"
              value={des}
              onChange={(e) => setDes(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={!valid}>
              Tạo QR
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
