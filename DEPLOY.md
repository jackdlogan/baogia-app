# Deploy báo giá app để chia sẻ với bạn bè

Cách nhanh nhất: **Vercel** (miễn phí, hỗ trợ Next.js tốt).

## Bước 1: Đẩy code lên GitHub

Nếu chưa có repo:

```bash
cd d:\Working\Baogia
git init
git add .
git commit -m "Initial: app báo giá"
```

Tạo repo mới trên [github.com](https://github.com/new) (có thể đặt tên `baogia` hoặc `Baogia`), rồi:

```bash
git remote add origin https://github.com/TEN-BAN/GIT-REPO.git
git branch -M main
git push -u origin main
```

(Thay `TEN-BAN/GIT-REPO` bằng tên repo thật của bạn.)

## Bước 2: Deploy lên Vercel

1. Vào **[vercel.com](https://vercel.com)** → **Sign Up** (đăng ký bằng GitHub cho tiện).
2. **Add New…** → **Project** → **Import** repo GitHub vừa tạo.
3. **Root Directory:** chọn **Edit** và gõ `baogia-app` (vì app nằm trong thư mục này).
4. **Deploy** (giữ nguyên các mặc định).

Sau vài phút bạn sẽ có link dạng: `https://baogia-xxx.vercel.app` — gửi link này cho bạn bè là xong.

## Lưu ý

- **Nếu toàn bộ repo chỉ có mỗi thư mục `baogia-app`:** có thể đẩy luôn nội dung trong `baogia-app` lên GitHub và **không** cần chỉnh Root Directory (để trống).
- **Bạn bè chỉ cần mở link:** không cần cài Node hay build gì, dùng trực tiếp trên trình duyệt.

## Cập nhật sau này

Chỉ cần đẩy code mới lên GitHub:

```bash
git add .
git commit -m "Cập nhật giao diện / tính năng"
git push
```

Vercel sẽ tự build và deploy lại; link không đổi.
