"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { InvoiceData, InvoiceItem, TemplateId } from "@/lib/invoice-types";
import { defaultInvoiceData } from "@/lib/invoice-types";
import { formatCurrency } from "@/lib/invoice-utils";

const STORAGE_KEY = "invoice_baogia_data";
const STORAGE_TEMPLATE = "invoice_baogia_template";

interface InvoiceContextValue {
  data: InvoiceData;
  template: TemplateId;
  setTemplate: (t: TemplateId) => void;
  updateField: <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => void;
  updateItem: (index: number, field: keyof InvoiceItem, value: string | number) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getGrandTotal: () => number;
}

const InvoiceContext = createContext<InvoiceContextValue | null>(null);

function loadStored(): InvoiceData {
  if (typeof window === "undefined") return defaultInvoiceData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // No stored data: use today's date on client so UI shows current dates (SSR used static dates for hydration)
      const today = new Date().toISOString().slice(0, 10);
      const due = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
      return { ...defaultInvoiceData, invoiceDate: today, dueDate: due };
    }
    const parsed = JSON.parse(raw) as Partial<InvoiceData>;
    if (parsed?.items?.length) {
      return { ...defaultInvoiceData, ...parsed, items: parsed.items } as InvoiceData;
    }
    return { ...defaultInvoiceData, ...parsed } as InvoiceData;
  } catch {
    return defaultInvoiceData;
  }
}

function loadTemplate(): TemplateId {
  if (typeof window === "undefined") return "professional";
  const t = localStorage.getItem(STORAGE_TEMPLATE);
  if (t === "professional" || t === "minimal" || t === "classic") return t;
  return "professional";
}

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<InvoiceData>(defaultInvoiceData);
  const [template, setTemplateState] = useState<TemplateId>("professional");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(loadStored());
    setTemplateState(loadTemplate());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_TEMPLATE, template);
    } catch {}
  }, [template, hydrated]);

  const updateField = useCallback(<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateItem = useCallback(
    (index: number, field: keyof InvoiceItem, value: string | number) => {
      setData((prev) => {
        const items = [...prev.items];
        if (!items[index]) return prev;
        items[index] = { ...items[index], [field]: value };
        return { ...prev, items };
      });
    },
    []
  );

  const addItem = useCallback(() => {
    setData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, unit: "Cái", unitPrice: 0 }],
    }));
  }, []);

  const removeItem = useCallback((index: number) => {
    setData((prev) => {
      if (prev.items.length <= 1) return prev;
      const items = prev.items.filter((_, i) => i !== index);
      return { ...prev, items };
    });
  }, []);

  const setTemplate = useCallback((t: TemplateId) => {
    setTemplateState(t);
  }, []);

  const getSubtotal = useCallback(() => {
    return data.items.reduce(
      (sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0),
      0
    );
  }, [data.items]);

  const getDiscount = useCallback(() => Number(data.discountAmount) || 0, [data.discountAmount]);

  const getGrandTotal = useCallback(() => {
    const sub = data.items.reduce(
      (sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0),
      0
    );
    const discount = Number(data.discountAmount) || 0;
    return Math.max(0, sub - discount);
  }, [data.items, data.discountAmount]);

  const value = useMemo<InvoiceContextValue>(
    () => ({
      data,
      template,
      setTemplate,
      updateField,
      updateItem,
      addItem,
      removeItem,
      getSubtotal,
      getDiscount,
      getGrandTotal,
    }),
    [
      data,
      template,
      updateField,
      updateItem,
      addItem,
      removeItem,
      getSubtotal,
      getDiscount,
      getGrandTotal,
    ]
  );

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error("useInvoice must be used within InvoiceProvider");
  return ctx;
}
