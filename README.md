# Ứng dụng Báo giá (Next.js + Shadcn)

Phiên bản Next.js của công cụ tạo báo giá, dùng Shadcn UI.

## Chạy

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Tính năng

- **3 mẫu:** Orange Footer, Grey Panel, Classic (có thumbnail trong sidebar)
- **Chỉnh sửa:** Tất cả trường dùng Input/Textarea Shadcn
- **Xuất:** PDF, PNG, In (nút trong sidebar)
- **Lưu tự động:** Dữ liệu lưu vào localStorage

## Công nghệ

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI (Button, Input, Card, Label, Separator, ScrollArea, Textarea)
- html2pdf.js, html2canvas (export PDF/PNG)

## Cấu trúc

- `src/app/` – layout, page
- `src/components/invoice/` – Sidebar, InvoiceView, TemplateOrange, TemplateGrey, TemplateClassic, InvoiceFields
- `src/context/invoice-context.tsx` – state + localStorage
- `src/lib/` – invoice-types, invoice-utils
