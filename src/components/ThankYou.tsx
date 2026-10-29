import { Decor } from "./Decor";
import { Reveal } from "./Reveal";
import { couple, thanks } from "@/data/wedding";
import s from "./ThankYou.module.css";

export function ThankYou() {
  return (
    <section id="cam-on" className="section section--beige section--beige-light section--grain" aria-labelledby="cam-on-title">
      {/*
        Nền be nên hoạ tiết dùng bộ đỏ. Hoạ tiết nằm trên nội dung (z-index 5)
        nên phải bám sát hai mép — kê vào giữa là đè lên chữ. Hai cái ở lưng
        chừng chỉ hiện từ tablet trở lên, màn hẹp còn chỗ đâu mà rải.
      */}
      <Decor src="red/lips" x="80%" y="8%" w="clamp(56px, 14vw, 118px)" r="-14deg" motion="wobble" duration="7s" />
      <Decor src="red/starburst" x="90%" y="21%" w="clamp(30px, 7vw, 66px)" motion="twinkle" duration="5.4s" delay="-1.5s" />
      <Decor src="red/sparkle" x="3%" y="58%" w="clamp(30px, 7vw, 66px)" motion="twinkle" duration="4.6s" hideOnMobile />
      <Decor src="red/sparkle" x="90%" y="86%" w="clamp(24px, 5.5vw, 52px)" motion="twinkle" duration="6.2s" delay="-3s" hideOnMobile />
      <Decor src="red/starburst" x="2%" y="88%" w="clamp(24px, 5.5vw, 52px)" motion="twinkle" duration="5s" delay="-2.4s" />

      <div className={`container container--content ${s.body}`}>
        <Reveal className={`section-head ${s.head}`} delay={80}>
          <p className="eyebrow">Thank you</p>
          <h2 id="cam-on-title" className="h2">
            {thanks.title}
          </h2>
        </Reveal>

        <Reveal className={s.words} delay={140}>
          {thanks.lines.map((line) => (
            <p key={line} className="lead">
              {line}
            </p>
          ))}
          <p className="script">{thanks.signature}</p>
        </Reveal>

        {/* Tranh vẽ hai đứa chào khách */}
        <Reveal className={s.drawing} delay={200}>
          <img
            className="wobble"
            src="/art/draw/thank-you.webp"
            alt={`Tranh vẽ ${couple.groom} và ${couple.bride}`}
            width={760}
            height={478}
          />
        </Reveal>

        <Reveal className={s.sign} delay={260}>
          <p className={s.hashtag}>{couple.hashtag}</p>
        </Reveal>
      </div>
    </section>
  );
}
