/**
 * Toàn bộ nội dung của website nằm ở file này.
 * Sửa ở đây là xong — không cần đụng vào code của các section.
 *
 * ⚠️ Các giá trị hiện tại là DỮ LIỆU GIẢ (placeholder) để dựng giao diện.
 */

export type Attendance = "yes" | "no";

export const couple = {
  /** Tên hiển thị lớn ở hero */
  groom: "Kỳ Nam",
  bride: "Minh Phương",
  groomFull: "Kỳ Nam",
  brideFull: "Minh Phương",
  hashtag: "#KyNamCuoiMinhPhuong",
};

/** Chữ ở trang bìa — chỉ hiện khi khách vào bằng link mời riêng */
export const hero = {
  invite: "mời bạn đến với đám cưới của",
};

/** Bố mẹ hai bên — hiện trong section "Thông tin lễ cưới" */
export const families = [
  {
    side: "Nhà trai",
    people: [
      { role: "Bố iu", name: "Hoàng Xuân Bảo" },
      { role: "Mẹ iu", name: "Nguyễn Trung Thị Hà" },
    ],
  },
  {
    side: "Nhà gái",
    people: [
      { role: "Bố iu", name: "Phạm Thanh Long" },
      { role: "Mẹ iu", name: "Đồng Thị Hồng Gấm" },
    ],
  },
];

/** Giờ khai tiệc chính (giờ Việt Nam, UTC+7) — tờ lịch và đồng hồ đếm ngược đều tính từ đây */
export const weddingDate = "2026-11-14T11:30:00+07:00";

export const dateLabel = {
  weekday: "Thứ Bảy",
  day: "14",
  month: "11",
  year: "2026",
  lunar: "Nhằm ngày 06 tháng 10 năm Bính Ngọ",
};

/** Album ảnh cưới — mỗi tấm là một ô trên cuộn phim ở section "Album" */
export const gallery = {
  eyebrow: "Album",
  title: "Cuộn phim của tụi mình",
  note: "36 kiểu, tụi mình chọn ra mấy tấm ưng nhất.",
  /** Gợi ý cho người xem biết dải phim kéo ngang được */
  hint: "vuốt sang phải để xem tiếp",
  shots: [
    { src: "/gallery/01.webp", alt: "Kỳ Nam khoanh tay, Minh Phương chống hông trước phông trái tim đỏ" },
    { src: "/gallery/02.webp", alt: "Hai đứa đứng cạnh nhau, Minh Phương cười tít mắt" },
    { src: "/gallery/03.webp", alt: "Minh Phương tựa cằm lên tay, Kỳ Nam đứng thẳng bên cạnh" },
    { src: "/gallery/04.webp", alt: "Hai đứa đứng sát vai trước phông trái tim" },
    { src: "/gallery/05.webp", alt: "Kỳ Nam và Minh Phương dưới vầng sáng ấm" },
    { src: "/gallery/06.webp", alt: "Minh Phương trao nụ hôn gió, Kỳ Nam đứng cạnh" },
    { src: "/gallery/07.webp", alt: "Hai đứa khoanh tay dưới ánh đèn spotlight" },
    { src: "/gallery/08.webp", alt: "Minh Phương tựa vào vai Kỳ Nam" },
    { src: "/gallery/09.webp", alt: "Hai đứa tay trong tay dưới vầng sáng" },
    { src: "/gallery/10.webp", alt: "Minh Phương hôn nhẹ lên má Kỳ Nam" },
  ],
};

/**
 * Trò ghép hình chặn trước phần thông tin lễ cưới: ghép xong hai mảnh thì
 * section bên dưới mới mở.
 */
export const puzzle = {
  title: "Bạn kéo chú rể lại gần cô dâu được không nè?",
  prompt: "Kéo chú rể lại gần cô dâu cho khớp nha",
  done: "Khớp rồi! Thông tin lễ cưới mở ngay bên dưới nha.",
  locked: "Ghép hai mảnh ảnh phía trên để mở phần này nha",
  pieces: [
    { src: "/art/puzzle-10-bride.webp", alt: "Cô dâu Minh Phương hôn nhẹ lên má chú rể" },
    { src: "/art/puzzle-10-groom.webp", alt: "Chú rể Kỳ Nam nhìn thẳng ra phía trước" },
  ],
};

export const venue = {
  name: "Cầu Am Place",
  hall: "",
  address: "Số 9 Chu Văn An, Yết Kiêu, Hà Đông, Hà Nội",
  mapUrl: "https://maps.app.goo.gl/TdmKMyEVSjN9xV7e6?g_st=ic",
  note: "Tới sớm một chút để còn kịp chụp hình với tụi mình nha.",
};

export type AgendaItem = {
  time: string;
  title: string;
  note?: string;
  photo: string;
  alt: string;
};

export type PartyId = "intimate" | "main";

export type Party = {
  id: PartyId;
  tab: string;
  title: string;
  note?: string;
  /** Giờ mở và giờ tan, dạng "HH:MM" — thời lượng do <Agenda /> tự tính */
  start: string;
  end: string;
  items: AgendaItem[];
};

/**
 * Hai chặng của ngày cưới. Chặng `intimate` chỉ hiện với khách được mời dự tiệc
 * chiều — xem `invitationType` trong <GuestProvider />.
 */
export const agenda: {
  eyebrow: string;
  hint: string;
  likeHint: string;
  parties: Party[];
} = {
  eyebrow: "Agenda",
  /** Gợi ý cho người xem biết hàng thẻ kéo ngang được */
  hint: "vuốt sang phải để xem tiếp",
  likeHint: "chạm vào ảnh để thả tim",
  parties: [
    {
      id: "intimate",
      tab: "Lễ vow",
      title: "Buổi sáng của những người thân nhất",
      start: "09:30",
      end: "11:30",
      items: [
        {
          time: "09:30",
          title: "Đón khách",
          photo: "/gallery/03.webp",
          alt: "Minh Phương tựa cằm lên tay, Kỳ Nam đứng thẳng bên cạnh",
        },
        {
          time: "10:00",
          title: "Lễ vow",
          note: "Lễ thề nguyện của hai đứa",
          photo: "/gallery/08.webp",
          alt: "Minh Phương tựa vào vai Kỳ Nam",
        },
      ],
    },
    {
      id: "main",
      tab: "Tiệc chính",
      title: "Buổi trưa hôm đó sẽ diễn ra như vầy",
      start: "11:00",
      end: "14:00",
      items: [
        {
          time: "11:00",
          title: "Đón khách",
          photo: "/gallery/11.jpg",
          alt: "Hai đứa cạnh nhau trong buổi tiệc",
        },
        {
          time: "11:30",
          title: "Lễ Thành Hôn",
          photo: "/gallery/06.webp",
          alt: "Minh Phương trao nụ hôn gió, Kỳ Nam đứng cạnh",
        },
      ],
    },
  ],
};

export const dresscode = {
  title: "Dresscode",
  headline: "Đừng quan trọng màu sắc hay phong cách",
  note: "Hãy cùng nhau lên ảnh thật đẹp 🩲👙",
};

/**
 * URL của Google Apps Script Web App — dùng chung cho cả hai chiều:
 * GET  ?slug=… để tra tên khách từ Sheet
 * POST để ghi câu trả lời ngược lại đúng dòng của khách đó
 *
 * Xem docs/guest-management-google-sheets.md. Để trống thì trang vẫn chạy:
 * không tra được tên, và câu trả lời chỉ lưu tạm ở localStorage.
 */
export const sheetEndpoint = process.env.NEXT_PUBLIC_RSVP_ENDPOINT ?? "https://script.google.com/macros/s/AKfycbxTROKLSnmUe0hd4fdAcdD9dx_ULmMLJB30G0vXXMjLGokTdRpYG1kTu0U47O1uw9L4KQ/exec";

/** Slug trên Glow RSVP Hub. Script riêng của dự án bỏ qua trường này; giữ lại phòng khi quay về Hub */
export const rsvpClient = "namphuong";

/** Hai kiểu thiệp — khớp với cột "Invitation type" trong Sheet */
export type InvitationType = "intimate" | "general";

export const rsvp = {
  title: "Bạn tới với tụi mình nha?",
  note: "Nhắn giùm tụi mình một tiếng để còn chuẩn bị chỗ ngồi thật đẹp cho bạn.",
  /** Câu 1 đổi chữ theo kiểu thiệp: khách intimate được mời từ lễ vow buổi sáng */
  attending: {
    intimate: "Bạn sẽ có mặt cùng chúng mình từ lễ vow buổi sáng chứ?",
    general: "Bạn sẽ có mặt cùng chúng mình chứ?",
    yes: "Có chứ, tui tới!",
    no: "Tiếc quá, tui bận mất rồi",
  },
  companions: {
    question:
      "Bạn có đi cùng người thương không? Nếu có, hãy cho bọn mình biết để người thương cũng sẽ được đón chào chu đáo nhé 🎀",
    none: "Tui đi một mình",
    /** Số người đi cùng khách, không tính khách */
    max: 4,
    namesLabel: "Tên người đi cùng",
    namesPlaceholder: "Ví dụ: Ngọc Anh, Minh Thư",
  },
  message: {
    label: "Nhắn cho tụi mình một câu nha",
    placeholder: "Chúc hai đứa cưới xong vẫn còn thương nhau nhiều như vậy…",
  },
  closing: "Nếu có câu hỏi hoặc cần trợ giúp, đừng ngại nhắn cho cô dâu chú rể nhé 🎀 Luôn có mặt 💓",
  successTitle: "Nhận được rồi nè!",
  successNote: "Cảm ơn bạn thiệt nhiều. Tụi mình sẽ giữ sẵn một chỗ ngồi xinh xinh cho bạn.",
  /** Số bàn lấy từ cột "Table" trong Sheet — chỉ hiện với khách có link mời riêng */
  table: {
    label: "Bàn của bạn",
    pending: "To be updated",
  },
};

/**
 * Quỹ trăng mật — section cuối trang. Mỗi tài khoản là một thẻ: có `qr` thì
 * hiện mã QR, có `number` thì hiện nút sao chép; để trống thì thẻ ghi
 * "Đang cập nhật" thay vì hiện số giả.
 */
export const honeymoon = {
  eyebrow: "Honeymoon fund",
  title: "Góp quỹ trăng mật",
  note: "Bạn đến chung vui đã là món quà lớn nhất của tụi mình rồi. Nếu muốn gửi thêm chút thương cho chuyến trăng mật, bạn ghé vào đây nha.",
  pending: "Đang cập nhật",
  copy: "Sao chép",
  copied: "Đã chép!",
  accounts: [
    { owner: "Chú rể", bank: "", holder: "", number: "", qr: "" },
    { owner: "Cô dâu", bank: "", holder: "", number: "", qr: "" },
  ],
  signature: "Thương nhiều, Kỳ Nam & Minh Phương",
};

export const thanks = {
  title: "Cảm ơn bạn",
  lines: [
    "Hẹn gặp bạn ở đám cưới, nhớ đói bụng sẵn nha!",
  ],
  signature: "Thương nhiều, Kỳ Nam & Minh Phương",
  /** Ba bé mèo trong tranh — để trống mảng này nếu không muốn hiện tên */
  cats: [],
};

/**
 * Nhạc nền — bật sau khi bấm "Print now".
 * Bỏ file mp3 vào /public/audio/ rồi điền tên file vào đây.
 * Để trống thì nút nhạc tự ẩn.
 */
export const music = {
  src: "/audio/music.mp4",
  title: "Nhạc nền",
};
