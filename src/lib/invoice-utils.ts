export function formatDate(str: string): string {
  if (!str) return "";
  const d = new Date(str);
  return isNaN(d.getTime())
    ? str
    : d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
}

export type CurrencyDisplay = "vnd" | "usd";

export function formatCurrency(num: number, display: CurrencyDisplay): string {
  const n = Number(num) || 0;
  if (display === "vnd") {
    return (
      new Intl.NumberFormat("vi-VN", {
        style: "decimal",
        maximumFractionDigits: 0,
      }).format(n) + " đ"
    );
  }
  return (
    "$ " +
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n)
  );
}

const ones = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
const teens = [
  "mười",
  "mười một",
  "mười hai",
  "mười ba",
  "mười bốn",
  "mười lăm",
  "mười sáu",
  "mười bảy",
  "mười tám",
  "mười chín",
];
const tens = [
  "",
  "",
  "hai mươi",
  "ba mươi",
  "bốn mươi",
  "năm mươi",
  "sáu mươi",
  "bảy mươi",
  "tám mươi",
  "chín mươi",
];

function numberToWordsVND(n: number): string {
  if (n === 0) return "Không đồng";
  const s = Math.floor(n).toString();
  function readGroup(g: string): string {
    const len = g.length;
    if (len === 1) return ones[+g];
    if (len === 2)
      return g[0] === "1"
        ? teens[+g[1]]
        : (tens[+g[0]] + " " + (g[1] === "1" ? "mốt" : ones[+g[1]])).trim();
    const h = +g[0];
    return (
      (h ? ones[h] + " trăm " : "") +
      (g[1] === "0"
        ? g[2] === "0"
          ? ""
          : "lẻ " + ones[+g[2]]
        : readGroup(g.slice(1)))
    );
  }
  const groups: string[] = [];
  for (let i = s.length; i > 0; i -= 3)
    groups.unshift(s.slice(Math.max(0, i - 3), i));
  const units = ["", "nghìn", "triệu", "tỷ"];
  return (
    groups
      .map((g, i) =>
        readGroup(g).trim()
          ? readGroup(g).trim() + " " + units[groups.length - 1 - i]
          : ""
      )
      .filter(Boolean)
      .join(" ")
      .trim() + " đồng chẵn"
  );
}

const onesEn = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];
const teensEn = [
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const tensEn = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

function numberToWordsUSD(n: number, code: string): string {
  if (n === 0) return "Zero";
  const intPart = Math.floor(n);
  const decPart = Math.round((n - intPart) * 100);
  function toHundreds(num: number): string {
    if (num === 0) return "";
    if (num < 10) return onesEn[num];
    if (num < 20) return teensEn[num - 10];
    if (num < 100)
      return (tensEn[Math.floor(num / 10)] + " " + onesEn[num % 10]).trim();
    return (
      onesEn[Math.floor(num / 100)] + " hundred " + toHundreds(num % 100)
    ).trim();
  }
  let result = "";
  let x = intPart;
  if (x >= 1000000) {
    result += toHundreds(Math.floor(x / 1000000)) + " million ";
    x %= 1000000;
  }
  if (x >= 1000) {
    result += toHundreds(Math.floor(x / 1000)) + " thousand ";
    x %= 1000;
  }
  if (x > 0) result += toHundreds(x);
  result = result.trim() + " " + code;
  if (decPart > 0) result += " and " + decPart + "/100";
  return result.trim() + " only";
}

export function numberToWords(num: number, code: string): string {
  const n = Number(num) || 0;
  return code === "VND" ? numberToWordsVND(n) : numberToWordsUSD(n, code);
}
