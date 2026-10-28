"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Decor } from "./Decor";
import { useInvitationType } from "./GuestContext";
import { Reveal } from "./Reveal";
import { agenda, type PartyId } from "@/data/wedding";
import s from "./Agenda.module.css";

/** Cuộn đi bao nhiêu thì coi như người xem đã hiểu là kéo ngang được */
const SEEN = 24;

const MINUTES_A_DAY = 24 * 60;

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** "15:00" → "17:30" thành "2 tiếng 30 phút" */
function duration(start: string, end: string) {
  let total = toMinutes(end) - toMinutes(start);
  // Tiệc kéo qua nửa đêm thì giờ tan nhỏ hơn giờ mở
  if (total < 0) total += MINUTES_A_DAY;

  const hours = Math.floor(total / 60);
  const mins = total % 60;

  if (!hours) return `${mins} phút`;
  return mins ? `${hours} tiếng ${mins} phút` : `${hours} tiếng`;
}

export function Agenda() {
  // Chỉ khách được mời tiệc chiều mới thấy chặng intimate — và cũng chỉ họ mới
  // thấy thanh chuyển giữa hai buổi tiệc.
  const intimateGuest = useInvitationType() === "intimate";
  const parties = agenda.parties.filter((p) => p.id !== "intimate" || intimateGuest);

  const [active, setActive] = useState<PartyId>("main");
  const [moved, setMoved] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [scrollable, setScrollable] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  /*
     Kiểu thiệp về sau lượt gọi Sheet nên `parties` có thể dài ra giữa chừng.
     Không tự nhảy tab khi điều đó xảy ra — chỉ cần chắc chắn tab đang chọn vẫn
     còn tồn tại.
  */
  const current = parties.find((p) => p.id === active) ?? parties[0];
  const hasTabs = parties.length > 1;

  /*
     Màn rộng thì cả hàng thẻ hiện hết một lượt, chẳng có gì để vuốt — mời người
     ta vuốt lúc đó là nói dối. ResizeObserver bắn ngay lần observe đầu tiên nên
     không cần đo thêm một nhịp riêng.
  */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(() => {
      setScrollable(track.scrollWidth > track.clientWidth + 1);
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, [current.id]);

  function choose(id: PartyId) {
    setActive(id);
    // Hàng thẻ được remount theo tab (key), scrollLeft về 0 — nhắc lại lời mời vuốt
    setMoved(false);
  }

  /** Mũi tên trái/phải chuyển tab, đúng thói quen của một tablist */
  function handleKeys(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();

    const i = parties.findIndex((p) => p.id === current.id);
    const next = parties[(i + (e.key === "ArrowRight" ? 1 : parties.length - 1)) % parties.length];
    choose(next.id);
    tabsRef.current?.querySelector<HTMLButtonElement>(`#agenda-tab-${next.id}`)?.focus();
  }

  return (
    <section id="agenda" className="section section--red section--red-deep section--grain" aria-label="Chương trình">
      {/* Nền đỏ nên hoạ tiết dùng bộ kem */}
      <Decor src="beige/sparkle" x="4%" y="18%" w="clamp(26px, 6.5vw, 58px)" motion="twinkle" duration="4.8s" />
      <Decor src="beige/starburst" x="90%" y="74%" w="clamp(26px, 6.5vw, 58px)" motion="twinkle" duration="5.6s" delay="-2s" />
      <Decor src="beige/bouquet" x="-2%" y="82%" w="clamp(58px, 14vw, 124px)" r="8deg" motion="sway" duration="9.5s" delay="-3s" hideOnMobile />

      <div className="container container--content">
        <Reveal className={`section-head ${!current.note ? s.headNoNote : ""}`}>
          <p className="eyebrow">{agenda.eyebrow}</p>
          <h2 className="h2">{current.title}</h2>
          {current.note ? <p className="lead">{current.note}</p> : null}
        </Reveal>

        {/* Tấm thẻ bo góc, mượn dáng của bảng chia sẻ trên điện thoại */}
        <Reveal className={s.panel} delay={80}>
          <span className={s.grabber} aria-hidden="true" />

          {hasTabs ? (
            <div ref={tabsRef} className={s.tabs} role="tablist" aria-label="Chọn buổi tiệc" onKeyDown={handleKeys}>
              {parties.map((party) => {
                const on = party.id === current.id;
                return (
                  <button
                    key={party.id}
                    type="button"
                    role="tab"
                    id={`agenda-tab-${party.id}`}
                    className={s.tab}
                    aria-selected={on}
                    aria-controls={`agenda-panel-${party.id}`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => choose(party.id)}
                  >
                    {party.tab}
                  </button>
                );
              })}
            </div>
          ) : null}

          {/* Mở lúc mấy giờ, tan lúc mấy giờ, và tất cả kéo dài bao lâu */}
          <p className={s.window}>
            <span className={s.clock}>
              {current.start} <span aria-hidden="true">–</span> {current.end}
            </span>
            <span className={s.duration}>khoảng {duration(current.start, current.end)}</span>
          </p>

          <div
            id={`agenda-panel-${current.id}`}
            role={hasTabs ? "tabpanel" : undefined}
            aria-labelledby={hasTabs ? `agenda-tab-${current.id}` : undefined}
            tabIndex={hasTabs ? 0 : undefined}
          >
            <ol
              // Đổi tab thì remount để hàng thẻ trở về đầu
              key={current.id}
              ref={trackRef}
              className={s.track}
              aria-label={current.title}
              onScroll={(e) => setMoved(e.currentTarget.scrollLeft > SEEN)}
            >
              {current.items.map((item) => {
                const key = `${current.id}-${item.time}`;
                const on = Boolean(liked[key]);

                return (
                  <li key={key} className={s.card}>
                    <button
                      type="button"
                      className={s.tap}
                      aria-pressed={on}
                      aria-label={`Thả tim cho ${item.title} lúc ${item.time}`}
                      onClick={() => setLiked((prev) => ({ ...prev, [key]: !prev[key] }))}
                    >
                      <img className={s.photo} src={item.photo} alt={item.alt} width={560} height={747} />
                      <span className={s.time} aria-hidden="true">
                        {item.time}
                      </span>
                      <span className={s.heart} data-on={on || undefined} aria-hidden="true">
                        <svg viewBox="0 0 24 22">
                          <path d="M12 21S1.8 14.3 1.8 7.6A5.6 5.6 0 0 1 12 4.4a5.6 5.6 0 0 1 10.2 3.2C22.2 14.3 12 21 12 21Z" />
                        </svg>
                      </span>
                    </button>

                    <div className={s.meta}>
                      <h3 className={s.title}>{item.title}</h3>
                      {item.note ? <p className={s.note}>{item.note}</p> : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <p className={s.hints}>
            {scrollable ? (
              <span className={s.hint} data-done={moved || undefined}>
                {agenda.hint}
                <span className={s.arrow} aria-hidden="true">
                  →
                </span>
              </span>
            ) : null}
            <span className={s.likeHint}>{agenda.likeHint}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
