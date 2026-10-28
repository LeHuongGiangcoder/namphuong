# Quốc Anh & Diệp Khanh — thiệp cưới online

Next.js 16 (App Router) · không thêm thư viện UI nào · hoạt ảnh thuần CSS.

```bash
npm run dev     # http://localhost:3000
npm run build
```

## Sửa nội dung

Toàn bộ chữ nghĩa nằm trong **`src/data/wedding.ts`** — tên, ngày giờ, địa điểm,
agenda, lời cảm ơn, nhạc nền. Không cần đụng tới code của section.

> ⚠️ Dữ liệu hiện tại là **placeholder** để dựng giao diện.

## Design system

`src/app/globals.css` giữ toàn bộ token và component dùng chung. Quy tắc: không
viết màu hay khoảng cách thô trong component, luôn dùng token hoặc class ở đây.

Xem trực quan tại **`/styleguide`** (không index, không link từ trang chính).

Sáu section, nền đỏ và be xen kẽ: Hero (đỏ sọc) → Thông tin (be) → Agenda (đỏ) →
Dresscode (be sọc) → RSVP (đỏ sọc) → Cảm ơn (be).

| Nhóm | Có gì |
|---|---|
| Layout | `.section` + biến thể `--beige` / `--beige-light` / `--stripe` / `--red` / `--red-stripe` / `--red-deep` / `--grain`, `.container`, `.stack`, `.section-head` |
| Chữ | `.display` `.h1`–`.h4` `.eyebrow` `.lead` `.script` `.caption` `.numeral` |
| Nút | `.btn` + `.btn--stamp` `.btn--outline` `.btn--ghost` |
| Bề mặt | `.sheet` (giấy hình con tem) `.seal` `.stamp` `.calendar` `.chip` |
| Form | `.field` `.input` `.textarea` `.select` `.choice` |
| Chuyển động | `.decor` `.sway` `.float` `.wobble` `.twinkle` `.reveal` |

Hai quy ước quan trọng:

- **Hoạ tiết dùng ngược màu nền.** Section đỏ → hoạ tiết bộ `beige/*`; section be
  → hoạ tiết bộ `red/*`.
- **Nền kẻ sọc phải lót `.sheet`** trước khi đặt nội dung lên, nếu không chữ bị rối.

`.section--red`, `.sheet`, `.paper` và `.medallion` đều tự đặt lại các biến vai
trò màu (`--fg`, `--fg-head`, `--surface`…), nên mọi thứ đặt bên trong tự ăn đúng
màu mà không cần override.

## Nền

Sọc vẽ bằng `repeating-linear-gradient`, không lát ảnh: ảnh vải gốc chỉ có 28px
cho một cặp sọc nên phóng to lên là nhoè. Bề rộng cột chỉnh bằng một biến duy
nhất, `--stripe-w`.

## Ảnh

`public/art/` là ảnh đã tối ưu, **sinh ra tự động** — đừng sửa tay. File gốc nằm ở
`public/components`, `public/couple`, `public/drawing`, `public/decorative *`.
Thêm hoặc thay ảnh gốc xong thì chạy lại:

```bash
python3 scripts/prepare-assets.py
```

Script cắt viền trong suốt, thu nhỏ, xuất WebP và dựng ô lát nền liền mạch.

## Font

Tiêu đề dùng **Fraunces**, thân bài dùng **Inter** (cả hai đều self-host qua
`next/font`). PP Editorial New trong `public/font/` **không dùng được** vì thiếu
gần hết dấu tiếng Việt (`ạ ằ ắ ầ ấ ề ế ồ ố ơ ư ự …`) — kể cả chữ "Quốc" cũng vỡ.

## RSVP

Xem `docs/rsvp-google-sheets.md`. Khai báo `NEXT_PUBLIC_RSVP_ENDPOINT`
(mẫu ở `.env.example`). Chưa khai báo thì form vẫn chạy, dữ liệu lưu tạm ở
`localStorage`.

## Deploy

Vercel, preset Next.js, không cần chỉnh gì. Nhớ thêm biến môi trường
`NEXT_PUBLIC_RSVP_ENDPOINT` trong Settings trước khi deploy production.
