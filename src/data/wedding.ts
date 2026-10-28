/**
 * Toàn bộ nội dung của website nằm ở file này.
 * Sửa ở đây là xong — không cần đụng vào code của các section.
 *
 * ⚠️ Các giá trị hiện tại là DỮ LIỆU GIẢ (placeholder) để dựng giao diện.
 */

export type Attendance = "yes" | "no";

export const couple = {
  /** Tên hiển thị lớn ở hero */
  groom: "Quốc Anh",
  bride: "Diệp Khanh",
  groomFull: "Nguyễn Quốc Anh",
  brideFull: "Phạm Diệp Khanh",
  hashtag: "#QuocAnhCuoiDiepKhanh",
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
      { role: "Bố iu", name: "Trịnh Thanh Hải" },
      { role: "Mẹ iu", name: "Lê Thị Hoà" },
    ],
  },
  {
    side: "Nhà gái",
    people: [
      { role: "Bố iu", name: "Đàm Thận Tiệp" },
      { role: "Mẹ iu", name: "Nguyễn Thị Quỳnh Trang" },
    ],
  },
];

/** Giờ khai tiệc chính (giờ Việt Nam, UTC+7) — tờ lịch và đồng hồ đếm ngược đều tính từ đây */
export const weddingDate = "2026-09-25T17:30:00+07:00";

export const dateLabel = {
  weekday: "Thứ Sáu",
  day: "25",
  month: "09",
  year: "2026",
  lunar: "Nhằm ngày 15 tháng 8 âm lịch",
};

/** Album ảnh cưới — mỗi tấm là một ô trên cuộn phim ở section "Album" */
export const gallery = {
  eyebrow: "Album",
  title: "Cuộn phim của tụi mình",
  note: "36 kiểu, tụi mình chọn ra mấy tấm ưng nhất.",
  /** Gợi ý cho người xem biết dải phim kéo ngang được */
  hint: "vuốt sang phải để xem tiếp",
  shots: [
    { src: "/gallery/01.webp", alt: "Quốc Anh khoanh tay, Diệp Khanh chống hông trước phông trái tim đỏ" },
    { src: "/gallery/02.webp", alt: "Hai đứa đứng cạnh nhau, Diệp Khanh cười tít mắt" },
    { src: "/gallery/03.webp", alt: "Diệp Khanh tựa cằm lên tay, Quốc Anh đứng thẳng bên cạnh" },
    { src: "/gallery/04.webp", alt: "Hai đứa đứng sát vai trước phông trái tim" },
    { src: "/gallery/05.webp", alt: "Quốc Anh và Diệp Khanh dưới vầng sáng ấm" },
    { src: "/gallery/06.webp", alt: "Diệp Khanh trao nụ hôn gió, Quốc Anh đứng cạnh" },
    { src: "/gallery/07.webp", alt: "Hai đứa khoanh tay dưới ánh đèn spotlight" },
    { src: "/gallery/08.webp", alt: "Diệp Khanh tựa vào vai Quốc Anh" },
    { src: "/gallery/09.webp", alt: "Hai đứa tay trong tay dưới vầng sáng" },
    { src: "/gallery/10.webp", alt: "Diệp Khanh hôn nhẹ lên má Quốc Anh" },
  ],
};

/**
 * Trò ghép hình chặn trước phần thông tin lễ cưới: ghép xong hai mảnh thì
 * section bên dưới mới mở.
 */
export const puzzle = {
  title: "Ghép hai đứa lại nha",
  prompt: "Kéo mảnh bên phải cho khớp vào mảnh bên trái",
  done: "Khớp rồi! Thông tin lễ cưới mở ngay bên dưới nha.",
  locked: "Ghép hai mảnh ảnh phía trên để mở phần này nha",
  pieces: [
    { src: "/art/puzzle-2.webp", alt: "Diệp Khanh dưới ánh đèn spotlight" },
    { src: "/art/puzzle-1.webp", alt: "Quốc Anh dưới ánh đèn spotlight" },
  ],
};

export const venue = {
  name: "Forevermark Tây Hồ",
  hall: "Tầng 2",
  address: "614 đường Lạc Long Quân, Tây Hồ, Hà Nội",
  mapUrl: "https://maps.google.com/?q=Forevermark+614+Lac+Long+Quan+Tay+Ho+Ha+Noi",
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
      tab: "Tiệc intimate",
      title: "Buổi chiều của những người thân nhất",
      start: "15:00",
      end: "17:30",
      items: [
        {
          time: "15:00",
          title: "Welcoming",
          note: "Photobooth, tiệc sún răng",
          photo: "/agenda/01-welcoming.webp",
          alt: "Hai đứa trước phông trái tim đỏ",
        },
        {
          time: "16:00",
          title: "Vows ceremony",
          photo: "/agenda/02-vows.webp",
          alt: "Diệp Khanh cười, Quốc Anh khoanh tay",
        },
        {
          time: "16:45",
          title: "Gap time",
          note: "Nghỉ ngơi, chờ tiệc chính",
          photo: "/agenda/03-gap.webp",
          alt: "Hai đứa đứng sát bên nhau",
        },
      ],
    },
    {
      id: "main",
      tab: "Tiệc chính",
      title: "Buổi tối hôm đó sẽ diễn ra như vầy",
      start: "17:30",
      end: "21:00",
      items: [
        {
          time: "17:30",
          title: "Đón khách",
          photo: "/agenda/04-welcome.webp",
          alt: "Hai đứa dưới vầng sáng spotlight",
        },
        {
          time: "18:00",
          title: "Làm lễ",
          photo: "/agenda/05-ceremony.webp",
          alt: "Hai đứa khoanh tay trước vầng sáng",
        },
        {
          time: "18:30",
          title: "Khai tiệc",
          photo: "/agenda/06-party.webp",
          alt: "Diệp Khanh ôm Quốc Anh, hôn nhẹ lên má",
        },
        {
          time: "19:30",
          title: "Games & quẩy",
          photo: "/agenda/07-games.webp",
          alt: "Hai đứa tay trong tay dưới ánh đèn",
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
export const sheetEndpoint = process.env.NEXT_PUBLIC_RSVP_ENDPOINT ?? "https://script.google.com/macros/s/AKfycbxB9Oc65toi-UmEfTB_J6d3l8LQoNQvhpyY1IaIIKR2h8I59K1NxvCGTZckTqLaT5y_/exec";

/** Slug của khách trên Glow RSVP Hub — hub dùng nó để tìm đúng Sheet */
export const rsvpClient = "namphuong";

/** Hai kiểu thiệp — khớp với cột "Invitation type" trong Sheet */
export type InvitationType = "intimate" | "general";

export const rsvp = {
  title: "Bạn tới với tụi mình nha?",
  note: "Nhắn giùm tụi mình một tiếng để còn chuẩn bị chỗ ngồi thật đẹp cho bạn.",
  /** Câu 1 đổi chữ theo kiểu thiệp: khách intimate được mời từ chiều */
  attending: {
    intimate: "Bạn sẽ có mặt cùng chúng mình từ chiều chứ?",
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
};

export const thanks = {
  title: "Cảm ơn bạn",
  lines: [
    "Hẹn gặp bạn ở đám cưới, nhớ đói bụng sẵn nha!",
  ],
  signature: "Thương nhiều, Quốc Anh & Diệp Khanh",
  /** Ba bé mèo trong tranh — để trống mảng này nếu không muốn hiện tên */
  cats: ["Lim", "Bư", "Muỗi"],
};

/**
 * Nhạc nền — bật sau khi bấm "Print now".
 * Bỏ file mp3 vào /public/audio/ rồi điền tên file vào đây.
 * Để trống thì nút nhạc tự ẩn.
 */
export const music = {
  src: "",
  title: "",
};
