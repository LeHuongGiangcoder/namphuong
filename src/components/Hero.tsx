"use client";

import { useEffect, useRef, useState } from "react";
import { Decor } from "./Decor";
import { useGuest } from "./GuestContext";
import { couple, dateLabel, hero, music } from "@/data/wedding";
import s from "./Hero.module.css";

type Phase = "idle" | "printing" | "done";

/**
 * Mốc an toàn, phòng khi trình duyệt không bắn transitionend (tab chạy nền,
 * người dùng tắt animation…). Dài hơn transition thật trong Hero.module.css.
 */
const PRINT_FALLBACK_MS = 3200;

export function Hero() {
  const { guest } = useGuest();
  const [phase, setPhase] = useState<Phase>("idle");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (phase !== "printing") return;
    const id = window.setTimeout(() => setPhase("done"), PRINT_FALLBACK_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  async function play() {
    const el = audioRef.current;
    if (!el) return;
    try {
      await el.play();
      setPlaying(true);
    } catch {
      // Trình duyệt chặn autoplay, hoặc chưa có file nhạc — bỏ qua, người dùng
      // vẫn bật được bằng nút góc phải.
      setPlaying(false);
    }
  }

  function handlePrint() {
    if (phase !== "idle") return;
    setPhase("printing");
    if (music.src) void play();
  }

  function toggleMusic() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) void play();
    else {
      el.pause();
      setPlaying(false);
    }
  }

  function scrollToNext() {
    document.getElementById("album")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      className={`section section--red section--red-stripe ${s.hero} ${s[phase] ?? ""}`}
      aria-label="Trang bìa"
    >
      {/*
        Nền đỏ nên hoạ tiết dùng bộ kem. Trên điện thoại chỉ giữ lại vài món ở
        bốn góc, phần còn lại chờ màn hình rộng mới xuất hiện.
      */}
      <Decor src="beige/letters" x="-6%" y="7%" w="clamp(80px, 20vw, 180px)" r="-9deg" motion="sway" duration="9s" opacity={0.85} />
      <Decor src="beige/bouquet" x="80%" y="3%" w="clamp(70px, 17vw, 145px)" r="8deg" motion="float" duration="8s" delay="-2s" opacity={0.85} />
      <Decor src="beige/champagne" x="0%" y="80%" w="clamp(56px, 13vw, 112px)" r="-5deg" motion="sway" duration="8.5s" delay="-4s" opacity={0.85} />
      <Decor src="beige/cupcake" x="82%" y="82%" w="clamp(56px, 13vw, 114px)" r="7deg" motion="float" duration="9s" delay="-2.5s" opacity={0.85} />
      <Decor src="beige/sparkle" x="14%" y="26%" w="clamp(26px, 6vw, 62px)" motion="twinkle" duration="4.5s" opacity={0.7} />
      <Decor src="beige/starburst" x="84%" y="52%" w="clamp(28px, 6.5vw, 68px)" r="12deg" motion="twinkle" duration="5.5s" delay="-2s" opacity={0.7} />
      <Decor src="beige/cherry" x="86%" y="28%" w="clamp(70px, 9vw, 130px)" r="-12deg" motion="sway" duration="9.5s" delay="-1.5s" opacity={0.85} hideOnMobile />
      <Decor src="beige/bow" x="-1%" y="38%" w="clamp(88px, 12vw, 170px)" r="10deg" motion="sway" duration="10s" delay="-3s" opacity={0.85} hideOnMobile />
      <Decor src="beige/dove" x="62%" y="90%" w="clamp(64px, 8vw, 116px)" r="-6deg" motion="float" duration="7s" delay="-1s" opacity={0.85} hideOnMobile />
      <Decor src="beige/ribbon" x="20%" y="88%" w="clamp(70px, 9vw, 130px)" r="6deg" motion="sway" duration="11s" delay="-5s" opacity={0.8} hideOnMobile />

      <div className={s.top}>
        <p className="eyebrow">Save the date</p>
        <p className={s.monogram}>
          {couple.groom.at(0)} &amp; {couple.bride.at(0)}
          <img className={`${s.monogramBow} wobble`} src="/art/beige/bow.webp" alt="" aria-hidden="true" />
        </p>
      </div>

      <div className={s.stage}>
        <img className={s.printer} src="/art/printer.webp" alt="" aria-hidden="true" />

        <div className={s.slot} aria-live="polite">
          <div
            className={`${s.photo} stamp`}
            /* Ảnh trượt xong thì mới hiện tên — bám theo transition thật, không đoán giờ */
            onTransitionEnd={(e) => {
              if (e.propertyName === "transform") setPhase((p) => (p === "printing" ? "done" : p));
            }}
          >
            <img
              className="stamp__photo"
              src="/art/hero-1.webp"
              alt={`${couple.groomFull} và ${couple.brideFull}`}
              width={708}
              height={1008}
            />
            <img className="stamp__frame" src="/art/stamp-frame.webp" alt="" aria-hidden="true" />
          </div>
        </div>

        <div className={s.cta}>
          <button type="button" className="btn btn--stamp" onClick={handlePrint}>
            <span className="btn__star" aria-hidden="true">
              ★
            </span>
            Print now
            <span className="btn__star" aria-hidden="true">
              ★
            </span>
          </button>
          <p className={s.hint}>Bấm để in tấm hình của tụi mình</p>
        </div>
      </div>

      {/*
        Khối tên + gợi ý cuộn: lúc chưa in thì thu về 0 chiều cao để hero không
        bị hụt một mảng trống, in xong mới nở ra.
      */}
      <div className={s.after}>
        <div className={s.afterInner}>
          {/* Có link mời riêng thì gọi thẳng tên khách; không có thì bỏ dòng này */}
          {guest ? (
            <p className={s.dear}>
              Dear {guest.name},
              <span className={s.invite}>{hero.invite}</span>
            </p>
          ) : null}

          <div className={s.names}>
            <h1 className={s.name}>{couple.groom}</h1>
            <span className={s.amp}>
              <img className={`${s.ampSparkle} twinkle`} src="/art/beige/sparkle.webp" alt="" aria-hidden="true" />
              &amp;
              <img className={`${s.ampSparkle} twinkle`} src="/art/beige/sparkle.webp" alt="" aria-hidden="true" />
            </span>
            <p className={s.name}>{couple.bride}</p>
            <p className={s.dateline}>
              <i />
              {dateLabel.day}.{dateLabel.month}.{dateLabel.year}
              <i />
            </p>
          </div>

          <button type="button" className={s.scrollCue} onClick={scrollToNext}>
            Cuộn xuống nha
          </button>
        </div>
      </div>

      {music.src ? (
        <>
          <audio ref={audioRef} src={music.src} loop preload="none" />
          <button
            type="button"
            className={`${s.music} ${playing ? s.playing : ""}`}
            onClick={toggleMusic}
            aria-pressed={playing}
            aria-label={playing ? "Tắt nhạc nền" : "Bật nhạc nền"}
          >
            <span className={s.musicBars} aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
          </button>
        </>
      ) : null}
    </section>
  );
}
