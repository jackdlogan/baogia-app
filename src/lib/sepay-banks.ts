/**
 * Danh sách ngân hàng cho SePay VietQR (qr.sepay.vn).
 * Dùng short_name làm tham số bank trong URL.
 */
export const SEPAY_BANKS: { code: string; short_name: string; name: string }[] = [
  { code: "ICB", short_name: "VietinBank", name: "VietinBank - Ngân hàng TMCP Công thương Việt Nam" },
  { code: "VCB", short_name: "Vietcombank", name: "Vietcombank - Ngân hàng TMCP Ngoại Thương Việt Nam" },
  { code: "MB", short_name: "MBBank", name: "MBBank - Ngân hàng TMCP Quân đội" },
  { code: "ACB", short_name: "ACB", name: "ACB - Ngân hàng TMCP Á Châu" },
  { code: "VPB", short_name: "VPBank", name: "VPBank - Ngân hàng TMCP Việt Nam Thịnh Vượng" },
  { code: "TPB", short_name: "TPBank", name: "TPBank - Ngân hàng TMCP Tiên Phong" },
  { code: "MSB", short_name: "MSB", name: "MSB - Ngân hàng TMCP Hàng Hải" },
  { code: "NAB", short_name: "NamABank", name: "NamABank - Ngân hàng TMCP Nam Á" },
  { code: "LPB", short_name: "LienVietPostBank", name: "LienVietPostBank - Ngân hàng TMCP Bưu Điện Liên Việt" },
  { code: "VCCB", short_name: "VietCapitalBank", name: "VietCapitalBank - Ngân hàng TMCP Bản Việt" },
  { code: "BIDV", short_name: "BIDV", name: "BIDV - Ngân hàng TMCP Đầu tư và Phát triển Việt Nam" },
  { code: "STB", short_name: "Sacombank", name: "Sacombank - Ngân hàng TMCP Sài Gòn Thương Tín" },
  { code: "VIB", short_name: "VIB", name: "VIB - Ngân hàng TMCP Quốc tế Việt Nam" },
  { code: "HDB", short_name: "HDBank", name: "HDBank - Ngân hàng TMCP Phát triển TP.HCM" },
  { code: "SEAB", short_name: "SeABank", name: "SeABank - Ngân hàng TMCP Đông Nam Á" },
  { code: "GPB", short_name: "GPBank", name: "GPBank - Ngân hàng TMCP Dầu Khí" },
  { code: "NCB", short_name: "NCB", name: "NCB - Ngân hàng TMCP Quốc Dân" },
  { code: "SHBVN", short_name: "ShinhanBank", name: "Shinhan Bank - Ngân hàng TNHH MTV Shinhan Việt Nam" },
  { code: "SCB", short_name: "SCB", name: "SCB - Ngân hàng TMCP Sài Gòn" },
  { code: "PGB", short_name: "PGBank", name: "PGBank - Ngân hàng TMCP Xăng dầu Petrolimex" },
  { code: "VBA", short_name: "Agribank", name: "Agribank - Ngân hàng Nông nghiệp và PTNT Việt Nam" },
  { code: "TCB", short_name: "Techcombank", name: "Techcombank - Ngân hàng TMCP Kỹ thương Việt Nam" },
  { code: "SGICB", short_name: "SaigonBank", name: "SaigonBank - Ngân hàng TMCP Sài Gòn Công Thương" },
  { code: "DOB", short_name: "DongABank", name: "DongABank - Ngân hàng TMCP Đông Á" },
  { code: "BAB", short_name: "BacABank", name: "BacABank - Ngân hàng TMCP Bắc Á" },
  { code: "ABB", short_name: "ABBANK", name: "ABBANK - Ngân hàng TMCP An Bình" },
  { code: "EIB", short_name: "Eximbank", name: "Eximbank - Ngân hàng TMCP Xuất Nhập khẩu Việt Nam" },
  { code: "PBVN", short_name: "PublicBank", name: "Public Bank - Ngân hàng TNHH MTV Public Việt Nam" },
  { code: "OCB", short_name: "OCB", name: "OCB - Ngân hàng TMCP Phương Đông" },
  { code: "KLB", short_name: "KienLongBank", name: "KienLongBank - Ngân hàng TMCP Kiên Long" },
  { code: "COOPBANK", short_name: "COOPBANK", name: "COOPBANK - Ngân hàng Hợp tác xã Việt Nam" },
];

export const SEPAY_QR_BASE = "https://qr.sepay.vn/img";

/** Tạo URL ảnh QR VietQR (số tiền theo VND). */
export function buildSePayQrUrl(params: {
  acc: string;
  bank: string;
  amount: number;
  des?: string;
  template?: "" | "compact" | "qronly";
}): string {
  const search = new URLSearchParams();
  search.set("acc", params.acc);
  search.set("bank", params.bank);
  search.set("amount", String(Math.round(params.amount)));
  if (params.des) search.set("des", params.des);
  if (params.template) search.set("template", params.template);
  return `${SEPAY_QR_BASE}?${search.toString()}`;
}
