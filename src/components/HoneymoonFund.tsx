"use client";

import { useState } from "react";
import { Decor } from "./Decor";
import { Reveal } from "./Reveal";
import { couple, honeymoon } from "@/data/wedding";
import s from "./HoneymoonFund.module.css";

type Account = (typeof honeymoon.accounts)[number];

/**
 * Trình duyệt trong Zalo / Messenger hay chặn navigator.clipboard, nên lùi về
 * execCommand với một textarea tạm. Cả hai cùng hỏng thì khách tự bôi đen số.
 */
async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

function AccountCard({ account }: { account: Account }) {
  const [copied, setCopied] = useState(false);
  const ready = Boolean(account.number);

  async function copy() {
    const digits = account.number.replace(/\s+/g, "");
    if (!(await writeClipboard(digits))) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <article className={s.card}>
      <p className="eyebrow eyebrow--bare">{account.owner}</p>
      {account.qr ? (
        <img
          className={s.qr}
          src={account.qr}
          alt={`Mã QR chuyển khoản cho ${account.owner.toLowerCase()}`}
          width={240}
          height={240}
        />
      ) : null}
      {ready ? (
        <>
          <p className={s.bank}>{account.bank}</p>
          <p className={s.number}>{account.number}</p>
          <p className={s.holder}>{account.holder}</p>
          <button type="button" className="btn btn--outline" onClick={copy} aria-live="polite">
            {copied ? honeymoon.copied : honeymoon.copy}
          </button>
        </>
      ) : (
        <p className={s.pending}>{honeymoon.pending}</p>
      )}
    </article>
  );
}

export function HoneymoonFund() {
  return (
    <section id="honeymoon" className="section section--beige section--beige-light section--grain" aria-labelledby="honeymoon-title">
      {/*
        Nền be nên hoạ tiết dùng bộ đỏ. Hoạ tiết nằm trên nội dung (z-index 5)
        nên phải bám sát hai mép — kê vào giữa là đè lên chữ.
      */}
      <Decor src="red/lips" x="80%" y="6%" w="clamp(56px, 14vw, 118px)" r="-14deg" motion="wobble" duration="7s" />
      <Decor src="red/starburst" x="90%" y="19%" w="clamp(30px, 7vw, 66px)" motion="twinkle" duration="5.4s" delay="-1.5s" />
      <Decor src="red/sparkle" x="3%" y="58%" w="clamp(30px, 7vw, 66px)" motion="twinkle" duration="4.6s" hideOnMobile />
      <Decor src="red/starburst" x="2%" y="90%" w="clamp(24px, 5.5vw, 52px)" motion="twinkle" duration="5s" delay="-2.4s" />

      <div className={`container container--content ${s.body}`}>
        <Reveal className={`section-head ${s.head}`} delay={80}>
          <p className="eyebrow">{honeymoon.eyebrow}</p>
          <h2 id="honeymoon-title" className="h2">
            {honeymoon.title}
          </h2>
          <p className="lead">{honeymoon.note}</p>
        </Reveal>

        <Reveal className={s.accounts} delay={160}>
          {honeymoon.accounts.map((account) => (
            <AccountCard key={account.owner} account={account} />
          ))}
        </Reveal>

        <Reveal className={s.sign} delay={240}>
          <p className="script">{honeymoon.signature}</p>
          <p className={s.hashtag}>{couple.hashtag}</p>
        </Reveal>
      </div>
    </section>
  );
}
