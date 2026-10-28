# Quản lý khách mời bằng Google Sheets

Mỗi khách có một link mời riêng dạng `…/?to=nguyen-van-a`. Mở link đó thì trang
cưới gọi tên khách ("Dear Nguyễn Văn A,"), và khách được mời tiệc chiều sẽ thấy
thêm phần timeline intimate. Khách trả lời xong, câu trả lời chạy ngược về đúng
dòng của họ trong Sheet.

```
Cô dâu chú rể điền Name + Invitation type
        ↓  menu 💌 Wedding → Tạo slug + link
Sheet tự sinh Slug và Link
        ↓  gửi link cho khách
Khách mở link → trang hỏi Sheet "slug này là ai?" → hiện tên + đúng loại thiệp
        ↓  khách bấm Xác nhận
Sheet nhận Attending · Number · Other name · Note ở ĐÚNG dòng khách đó
```

Chưa nối Sheet thì trang vẫn chạy bình thường: không có tên khách, mọi người
thấy như khách `general`, và câu trả lời lưu tạm trong `localStorage`.

## 1. Chuẩn bị Sheet

Tab đầu tiên đặt tên **`Guests Management`**, hàng 1 là tiêu đề, đúng 9 cột:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| No | Name | Invitation type | Slug | Link | Attending | Number | Other name | Note |

Bạn **chỉ điền cột B và C**. Cột C nhận `intimate` hoặc `general` — nên đặt Data
validation cho cột này (Data → Data validation → Dropdown) để khỏi gõ sai.

Bốn cột F–I do khách điền, đừng gõ tay vào (trừ khi muốn sửa hộ ai đó):

- **Attending** — `Có` / `Không`
- **Number** — số người đi cùng, **không tính bản thân khách**. Đi một mình là `0`.
- **Other name** — tên những người đi cùng
- **Note** — lời nhắn khách gửi cô dâu chú rể

## 2. Dán Apps Script

Trong Sheet: **Extensions → Apps Script**, xoá code mẫu, dán toàn bộ nội dung
[`apps-script/GuestManagement.gs`](../apps-script/GuestManagement.gs).

Sửa dòng đầu cho đúng domain thật, **không có dấu `/` ở cuối**:

```javascript
const SITE_URL = 'https://ten-mien-that.vercel.app';
```

Lưu, rồi tải lại tab Google Sheet — menu **💌 Wedding** sẽ hiện ra cạnh menu Help.

## 3. Deploy web app

**Deploy → New deployment → Web app**

- Execute as: **Me**
- Who has access: **Anyone**

Bấm Deploy, cấp quyền, copy **Web app URL** (dạng
`https://script.google.com/macros/s/AKfy.../exec`).

> "Anyone" là bắt buộc: trình duyệt của khách gọi thẳng vào URL này, không đăng
> nhập Google. Web app chỉ trả về tên và loại thiệp ứng với một slug, không đọc
> được gì khác trong Sheet.

## 4. Khai báo URL cho trang cưới

Ở máy, tạo `.env.local`:

```
NEXT_PUBLIC_RSVP_ENDPOINT=https://script.google.com/macros/s/AKfy.../exec
```

Trên Vercel: **Settings → Environment Variables**, thêm đúng biến đó cho cả
Production lẫn Preview, rồi redeploy.

## 5. Tạo link cho khách

1. Điền Name và Invitation type cho các khách mới.
2. Menu **💌 Wedding → Tạo slug + link cho khách mới**.
3. Cột Slug và Link tự điền. Gửi cột Link cho khách.

Menu còn hai mục nữa:

- **Tạo lại slug + link cho dòng đang chọn** — dùng khi sửa tên khách. ⚠️ Link cũ
  sẽ chết, nhớ gửi lại link mới.
- **Xoá câu trả lời của dòng đang chọn** — xoá F–I để mời lại từ đầu.

Slug sinh từ tên khách, bỏ dấu tiếng Việt: `Đàm Thận Tiệp` → `dam-than-tiep`.
Hai khách trùng tên thì người sau được thêm hậu tố: `nguyen-van-a-2`.

## 6. Thử

Mở `…/?to=<slug-nào-đó>`:

- Bấm **Print now** ở hero → phải hiện `Dear <tên khách>,` phía trên tên cô dâu chú rể.
- Nếu khách là `intimate` → section Agenda có thêm khối "Tiệc intimate" ở trên.
- Gửi form RSVP → cột F–I của đúng dòng khách đó phải đổi trong vài giây.

## Vài điểm cần biết

- Mỗi lần **sửa code** Apps Script phải **Deploy → Manage deployments → Edit →
  New version**, không thì URL cũ vẫn chạy code cũ.
- Khách gửi lại lần hai sẽ **ghi đè** câu trả lời cũ trên cùng một dòng, không
  tạo dòng mới. Muốn xem lịch sử thì dùng File → Version history của Sheet.
- Ai vào thẳng trang chủ (không có `?to=`) mà vẫn gửi form thì được **thêm một
  dòng mới** ở cuối sheet, loại `general`, tên do họ tự điền.
- Slug không phải mật khẩu — ai đoán đúng slug thì xem được tên khách đó. Đừng
  đặt tên khách chứa thông tin nhạy cảm.
- Request POST gửi bằng `Content-Type: text/plain` để trình duyệt khỏi hỏi
  preflight CORS. Apps Script vẫn đọc nguyên vẹn chuỗi JSON.
- Mọi lượt gửi đều được ghi thêm vào `localStorage` của khách (khoá
  `rsvp-submissions`) như bản sao dự phòng.
- Muốn nhận email mỗi lần có người trả lời: trong Sheet vào **Tools →
  Notification settings**.
