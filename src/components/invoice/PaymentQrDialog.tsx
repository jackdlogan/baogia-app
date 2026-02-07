"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
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
import { SEPAY_BANKS, getBankLogoUrl } from "@/lib/sepay-banks";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PaymentQrDialog({ open, onOpenChange }: Props) {
  const { data, updateField } = useInvoice();
  const [bank, setBank] = useState(data.paymentQrBankCode || "");
  const [account, setAccount] = useState(data.paymentQrAccount || "");
  const [des, setDes] = useState(data.paymentQrDescription ?? data.invoiceNumber ?? "");
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false);
  const bankDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bankDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (bankDropdownRef.current && !bankDropdownRef.current.contains(e.target as Node)) {
        setBankDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [bankDropdownOpen]);

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
          <div className="grid gap-2" ref={bankDropdownRef}>
            <Label htmlFor="sepay-bank">Ngân hàng thụ hưởng</Label>
            <div className="relative">
              <Button
                id="sepay-bank"
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={bankDropdownOpen}
                aria-haspopup="listbox"
                className="h-10 w-full justify-between font-normal"
                onClick={() => setBankDropdownOpen((v) => !v)}
              >
                {bank ? (
                  <span className="flex items-center gap-2 truncate">
                    <img
                      src={getBankLogoUrl(SEPAY_BANKS.find((b) => b.short_name === bank)?.code ?? "")}
                      alt=""
                      className="size-6 shrink-0 rounded object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    {SEPAY_BANKS.find((b) => b.short_name === bank)?.name ?? bank}
                  </span>
                ) : (
                  "-- Chọn ngân hàng --"
                )}
                <ChevronDown className={cn("ml-2 size-4 shrink-0 opacity-50 transition-transform", bankDropdownOpen && "rotate-180")} />
              </Button>
              {bankDropdownOpen && (
                <div
                  className="absolute top-full left-0 z-50 mt-1 w-full min-w-0 rounded-md border bg-popover text-popover-foreground shadow-md"
                  role="listbox"
                >
                  <div
                    className="max-h-64 overflow-y-auto overscroll-contain p-1"
                    style={{ touchAction: "pan-y" }}
                  >
                    {SEPAY_BANKS.map((b) => (
                      <button
                        key={b.code}
                        type="button"
                        role="option"
                        aria-selected={bank === b.short_name}
                        onClick={() => {
                          setBank(b.short_name);
                          setBankDropdownOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                          bank === b.short_name && "bg-accent"
                        )}
                      >
                        <img
                          src={getBankLogoUrl(b.code)}
                          alt=""
                          className="size-8 shrink-0 rounded object-contain bg-white"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <span className="truncate">{b.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
