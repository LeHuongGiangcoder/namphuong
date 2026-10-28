import { dateLabel, weddingDate } from "@/data/wedding";
import s from "./Calendar.module.css";

const DOW_VN = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
const MONTH_VN = [
  "Tháng Một", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu",
  "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai",
];

/** Số vòng lò xo trên gáy lịch */
const RINGS = 11;

type Cell = { day: string; dow: string };

/**
 * Thay vì trải cả tháng, tờ lịch chỉ phóng to đúng khoảng quanh ngày cưới:
 * ba cột là ba ngày cuối cùng trước giờ G, hàng trên là chính ba ngày đó của
 * tuần trước — vừa đủ để mắt nhận ra đây là một cuốn lịch, vừa dồn hết sự chú ý
 * vào ô cuối cùng.
 *
 * Tính bằng UTC để server và máy khách luôn ra cùng kết quả, bất kể múi giờ
 * người xem — dùng giờ địa phương thì ngày sẽ lệch và hydration lỗi.
 */
function zoom(iso: string) {
  const d = new Date(iso);
  const base = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const DAY = 86_400_000;

  const at = (offset: number): Cell => {
    const x = new Date(base + offset * DAY);
    return { day: String(x.getUTCDate()).padStart(2, "0"), dow: DOW_VN[x.getUTCDay()] };
  };

  return {
    month: MONTH_VN[new Date(base).getUTCMonth()],
    year: String(new Date(base).getUTCFullYear()),
    /** Tuần trước — chỉ để lấy ngữ cảnh, nên để mờ */
    quiet: [at(-9), at(-8), at(-7)],
    /** Hai ngày đếm ngược, rồi tới ngày cưới */
    countdown: [at(-2), at(-1)],
    wedding: at(0),
  };
}

export function Calendar() {
  const { month, year, quiet, countdown, wedding } = zoom(weddingDate);

  return (
    <figure className={s.pad}>
      {/* Gáy lò xo — nửa trên của mỗi vòng nhô lên khỏi mép giấy */}
      <div className={s.rings} aria-hidden="true">
        {Array.from({ length: RINGS }, (_, i) => (
          <i key={i} />
        ))}
      </div>

      <div className={s.page}>
        <header className={s.head}>
          <h3 className={s.month}>
            {month} <span className={s.year}>{year}</span>
          </h3>
          <p className={s.headHand}>lịch của tụi mình</p>
        </header>

        <div className={s.grid}>
          {[quiet[0], quiet[1], quiet[2]].map((c) => (
            <span key={`dow-${c.day}`} className={s.dow}>
              {c.dow}
            </span>
          ))}

          {/* ── Hàng trên: tuần trước, để trống cho ảnh và ghi chú dán lên ── */}
          <div className={`${s.cell} ${s.quiet}`}>
            <span className={s.num}>{quiet[0].day}</span>
            <figure className={s.polaroid}>
              <img src="/art/beige/tape.webp" alt="" aria-hidden="true" className={s.tape} />
              <img
                src="/art/cal-photo-1.webp"
                alt="Quốc Anh và Diệp Khanh trong bộ ảnh cưới"
                width={560}
                height={700}
              />
            </figure>
          </div>

          <div className={`${s.cell} ${s.quiet}`}>
            <span className={s.num}>{quiet[1].day}</span>
            <p className={`${s.note} ${s.noteA}`}>đếm ngược nè!</p>
            <img className={`${s.sparkle} twinkle`} src="/art/red/sparkle.webp" alt="" aria-hidden="true" />
            <span className={`${s.star} ${s.starA}`} aria-hidden="true" />
          </div>

          <div className={`${s.cell} ${s.quiet}`}>
            <span className={s.num}>{quiet[2].day}</span>
            <figure className={`${s.snap} sway`}>
              <img
                src="/art/cal-photo-2.webp"
                alt="Quốc Anh và Diệp Khanh trong bộ ảnh cưới"
                width={440}
                height={550}
              />
            </figure>
          </div>

          {/* ── Hàng dưới: hai ngày cuối rồi tới ngày cưới ── */}
          <div className={s.cell}>
            <span className={s.num}>{countdown[0].day}</span>
            <p className={s.note}>còn 2 ngày</p>
            <span className={`${s.star} ${s.starA}`} aria-hidden="true" />
            <span className={`${s.star} ${s.starB}`} aria-hidden="true" />
          </div>

          <div className={s.cell}>
            <span className={s.num}>{countdown[1].day}</span>
            <p className={s.note}>còn 1 đêm nữa thôi</p>
            <img className={`${s.bow} sway`} src="/art/red/bow.webp" alt="" aria-hidden="true" />
          </div>

          {/* Ngày cưới: vẫn nền giấy, chỉ khoanh bút và phóng to số cho nổi */}
          <div className={`${s.cell} ${s.mark}`}>
            <span className={`${s.star} ${s.bigStar} twinkle`} aria-hidden="true" />
            <span className={`${s.num} ${s.markNum}`}>{wedding.day}</span>
            <p className={s.markLabel}>{wedding.dow}</p>
            <p className={s.markTitle}>here come the bride</p>
            <svg className={s.heart} viewBox="0 0 24 22" fill="currentColor" aria-hidden="true">
              <path d="M12 21S1.8 14.3 1.8 7.6A5.6 5.6 0 0 1 12 4.4a5.6 5.6 0 0 1 10.2 3.2C22.2 14.3 12 21 12 21Z" />
            </svg>
          </div>
        </div>

        <figcaption className={s.strip}>
          <span className={s.stripLabel}>Save the date</span>
          <span className={s.stripDate}>
            {dateLabel.day}.{dateLabel.month}.{dateLabel.year}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
