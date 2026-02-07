export type TemplateId = "professional" | "minimal" | "classic";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  billedToName: string;
  billedToAddress: string;
  billedToEmail: string;
  paymentTerms: string;
  bankInfo: string;
  currencyCode: string;
  /** 'vnd' = "số đ", 'usd' = "$ số" */
  currencyDisplay: "vnd" | "usd";
  discountAmount: number;
  additionalInfo: string;
  signatoryName: string;
  signatoryTitle: string;
  /** Optional: project/deliverable name (e.g. for minimal-figma template) */
  projectName?: string;
  /** Optional: company website (e.g. for Contact section) */
  companyWebsite?: string;
  /** Optional: tax / GST ID */
  taxId?: string;
  /** SePay VietQR: mã ngân hàng (short_name từ qr.sepay.vn) */
  paymentQrBankCode?: string;
  /** SePay VietQR: số tài khoản */
  paymentQrAccount?: string;
  /** SePay VietQR: nội dung chuyển khoản (chữ, số, không dấu) */
  paymentQrDescription?: string;
  items: InvoiceItem[];
}

/** Static dates for SSR/hydration; real dates applied on client in loadStored(). */
const STATIC_DATE = "2025-01-01";
const STATIC_DUE_DATE = "2025-01-15";

export const defaultInvoiceData: InvoiceData = {
  invoiceNumber: "BG-001",
  invoiceDate: STATIC_DATE,
  dueDate: STATIC_DUE_DATE,
  companyName: "Công ty ABC",
  companyAddress: "123 Đường XYZ, Quận 1, TP.HCM",
  companyPhone: "028 1234 5678",
  companyEmail: "contact@abc.com",
  billedToName: "Khách hàng",
  billedToAddress: "Địa chỉ khách hàng",
  billedToEmail: "email@khach.com",
  paymentTerms: "Chuyển khoản 100% trước khi giao hàng",
  bankInfo: "Ngân hàng Vietcombank - TK: 1234567890 - Chủ TK: Công ty ABC",
  currencyCode: "VND",
  currencyDisplay: "vnd",
  discountAmount: 0,
  additionalInfo: "Báo giá có hiệu lực 07 ngày. Liên hệ để xác nhận đơn hàng.",
  signatoryName: "Nguyễn Văn A",
  signatoryTitle: "Giám đốc",
  projectName: "",
  companyWebsite: "",
  taxId: "",
  paymentQrBankCode: "",
  paymentQrAccount: "",
  paymentQrDescription: "",
  items: [
    { description: "Sản phẩm / Dịch vụ mẫu", quantity: 1, unit: "Cái", unitPrice: 1000000 },
    { description: "Hạng mục thứ hai", quantity: 2, unit: "Cái", unitPrice: 500000 },
  ],
};
