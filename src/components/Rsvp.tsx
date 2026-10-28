"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { useGuest } from "./GuestContext";
import { Reveal } from "./Reveal";
import { rsvp, rsvpClient, sheetEndpoint } from "@/data/wedding";
import s from "./Rsvp.module.css";

type Status = "idle" | "sending" | "sent" | "error";

type Payload = {
  /** Có slug thì Apps Script ghi đè đúng dòng của khách, không thì thêm dòng mới */
  slug: string;
  name: string;
  attending: "yes" | "no";
  /** Số người đi cùng, KHÔNG tính bản thân khách — khớp cột "Number" trong Sheet */
  companions: number;
  companionNames: string;
  note: string;
  submittedAt: string;
};

const STORE_KEY = "rsvp-submissions";

/** Lưu lại ở máy khách để không mất dữ liệu khi Sheet chưa nối hoặc mạng rớt. */
function keepLocally(payload: Payload) {
  try {
    const prev = JSON.parse(localStorage.getItem(STORE_KEY) ?? "[]") as Payload[];
    localStorage.setItem(STORE_KEY, JSON.stringify([...prev, payload]));
  } catch {
    // Trình duyệt chặn localStorage (chế độ ẩn danh) — không sao.
  }
}

export function Rsvp() {
  const { guest } = useGuest();
  const [status, setStatus] = useState<Status>("idle");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [companions, setCompanions] = useState(0);

  const question = rsvp.attending[guest?.type ?? "general"];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const going = attending === "yes";

    const payload: Payload = {
      slug: guest?.slug ?? "",
      name: guest?.name ?? String(data.get("name") ?? "").trim(),
      attending,
      companions: going ? companions : 0,
      companionNames: going && companions > 0 ? String(data.get("companionNames") ?? "").trim() : "",
      note: String(data.get("note") ?? "").trim(),
      submittedAt: new Date().toISOString(),
    };

    setStatus("sending");
    keepLocally(payload);

    if (!sheetEndpoint) {
      // Chưa nối Sheet: coi như gửi xong, dữ liệu nằm ở localStorage.
      setStatus("sent");
      return;
    }

    // submittedAt chỉ để lưu local — hub tự ghi thời gian
    const { slug, name, attending: answer, companions: extra, companionNames, note } = payload;

    try {
      // text/plain để Apps Script không bị chặn bởi CORS preflight.
      await fetch(sheetEndpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ client: rsvpClient, slug, name, attending: answer, companions: extra, companionNames, note }),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="rsvp" className="section section--red section--red-stripe" aria-labelledby="rsvp-title">
      {/* Không rải hoạ tiết ở đây — chỉ có hai chấm lấp lánh cạnh nút gửi */}
      <div className="container container--narrow sheet">
        <img className="seal" src="/art/seal.webp" alt="" aria-hidden="true" />
        <Reveal className="section-head">
          <p className="eyebrow">RSVP</p>
          <h2 id="rsvp-title" className="h2">
            {guest ? `${guest.name} ơi, ${rsvp.title.toLowerCase()}` : rsvp.title}
          </h2>
          <p className="lead">{rsvp.note}</p>
        </Reveal>

        <Reveal delay={100}>
          {status === "sent" ? (
            <div className={s.done}>
              <img className={s.seal} src="/art/seal.webp" alt="" aria-hidden="true" />
              <h3 className="h3">{rsvp.successTitle}</h3>
              <p className="script">{rsvp.successNote}</p>
              <button type="button" className="btn btn--outline" onClick={() => setStatus("idle")}>
                Sửa lại câu trả lời
              </button>
            </div>
          ) : (
            <form className={s.form} onSubmit={handleSubmit}>
              {/*
                Khách vào bằng link mời riêng thì tên đã có sẵn trong Sheet, khỏi
                hỏi lại. Chỉ ai vào thẳng trang chủ mới phải tự điền.
              */}
              {guest ? null : (
                <div className="field">
                  <label className="label" htmlFor="rsvp-name">
                    Tên của bạn
                  </label>
                  <input className="input" id="rsvp-name" name="name" required autoComplete="name" placeholder="Nguyễn Văn A" />
                </div>
              )}

              <fieldset className={s.fieldset}>
                <legend className="label">{question}</legend>
                <div className="choice">
                  <label className="choice__item">
                    <input
                      type="radio"
                      name="attending"
                      value="yes"
                      checked={attending === "yes"}
                      onChange={() => setAttending("yes")}
                    />
                    <span>{rsvp.attending.yes}</span>
                  </label>
                  <label className="choice__item">
                    <input
                      type="radio"
                      name="attending"
                      value="no"
                      checked={attending === "no"}
                      onChange={() => setAttending("no")}
                    />
                    <span>{rsvp.attending.no}</span>
                  </label>
                </div>
              </fieldset>

              {attending === "yes" ? (
                <>
                  <fieldset className={s.fieldset}>
                    <legend className="label">{rsvp.companions.question}</legend>
                    <div className={s.counter}>
                      <label className="choice__item">
                        <input
                          type="radio"
                          name="companions"
                          value="0"
                          checked={companions === 0}
                          onChange={() => setCompanions(0)}
                        />
                        <span>{rsvp.companions.none}</span>
                      </label>
                      {Array.from({ length: rsvp.companions.max }, (_, i) => i + 1).map((n) => (
                        <label key={n} className="choice__item">
                          <input
                            type="radio"
                            name="companions"
                            value={n}
                            checked={companions === n}
                            onChange={() => setCompanions(n)}
                          />
                          <span>{n} người</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {companions > 0 ? (
                    <div className="field">
                      <label className="label" htmlFor="rsvp-companions">
                        {rsvp.companions.namesLabel}
                      </label>
                      <input
                        className="input"
                        id="rsvp-companions"
                        name="companionNames"
                        placeholder={rsvp.companions.namesPlaceholder}
                      />
                    </div>
                  ) : null}
                </>
              ) : null}

              <div className="field">
                <label className="label" htmlFor="rsvp-note">
                  {rsvp.message.label}
                </label>
                <textarea className="textarea" id="rsvp-note" name="note" placeholder={rsvp.message.placeholder} />
              </div>

              <p className={`script ${s.closing}`}>{rsvp.closing}</p>

              {status === "error" ? (
                <p className="error">Gửi chưa được, bạn thử lại giúp tụi mình một lần nữa nha.</p>
              ) : null}

              <div className={s.submit}>
                <img className={`${s.blink} twinkle`} src="/art/red/sparkle.webp" alt="" aria-hidden="true" />
                <button type="submit" className="btn btn--stamp" disabled={status === "sending"}>
                  <span className="btn__star" aria-hidden="true">
                    ★
                  </span>
                  {status === "sending" ? "Đang gửi…" : "Xác nhận"}
                  <span className="btn__star" aria-hidden="true">
                    ★
                  </span>
                </button>
                <img
                  className={`${s.blink} twinkle`}
                  style={{ "--delay": "-2.4s" } as CSSProperties}
                  src="/art/red/starburst.webp"
                  alt=""
                  aria-hidden="true"
                />
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
