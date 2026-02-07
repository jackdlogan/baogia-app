"use client";

import { InvoiceProvider } from "@/context/invoice-context";
import { Sidebar } from "@/components/invoice/Sidebar";
import { InvoiceView } from "@/components/invoice/InvoiceView";
import { ScrollArea } from "@/components/ui/scroll-area";

function InvoicePageContent() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden bg-[#DDDDDD]">
        <p className="px-4 py-2 text-center text-xs text-muted-foreground print:hidden">
          Nhấp vào từng trường để sửa. Tổng tiền tự tính.
        </p>
        <ScrollArea className="flex-1">
          <div className="flex min-h-full w-full justify-center px-4 py-6">
            <InvoiceView />
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <InvoiceProvider>
      <InvoicePageContent />
    </InvoiceProvider>
  );
}
