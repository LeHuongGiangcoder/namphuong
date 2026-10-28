Bỏ file nhạc nền (mp3/m4a) vào thư mục này, rồi khai báo trong
`src/data/wedding.ts`:

```ts
export const music = {
  src: "/audio/ten-file.mp3",
  title: "Tên bài hát",
};
```

Để `src` rỗng thì nút bật/tắt nhạc tự ẩn. Nhạc bắt đầu ngay sau khi khách bấm
"Print now" — đó là cú chạm đầu tiên nên trình duyệt cho phép phát.
