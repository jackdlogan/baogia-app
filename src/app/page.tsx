"use client";

import { InvoiceProvider } from "@/context/invoice-context";
import { Sidebar } from "@/components/invoice/Sidebar";
import { InvoiceView } from "@/components/invoice/InvoiceView";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Topography } from "@/components/ui/topography";

function InvoicePageContent() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="relative flex flex-1 flex-col overflow-hidden bg-[#DDDDDD]/60 print:bg-[#DDDDDD]">
        <Topography
          className="absolute inset-0 z-0"
          lineColor="rgba(115, 115, 115, 0.3)"
          lineCount={20}
          speed={1}
          strokeWidth={1}
        />
        <p className="relative z-10 px-4 py-2 text-center text-xs text-muted-foreground print:hidden">
          Nhấp vào từng trường để sửa. Tổng tiền tự tính.
        </p>
        <ScrollArea className="relative z-10 flex-1">
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
