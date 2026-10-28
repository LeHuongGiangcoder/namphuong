import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

const SWATCHES = [
  ["--c-red", "#810220"],
  ["--c-red-deep", "#5c0117"],
  ["--c-red-soft", "#a8354c"],
  ["--c-cream", "#fffbef"],
  ["--c-beige", "#f8f2e5"],
  ["--c-beige-deep", "#ece1c9"],
  ["--c-ink", "#43261d"],
  ["--c-ink-soft", "#7a5c4e"],
];

const SPACING = ["3xs", "2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"];

/** Trang nội bộ để duyệt design system. Không index, không link từ trang chính. */
export default function StyleGuide() {
  return (
    <main>
      <section className="section section--beige">
        <div className="container stack">
          <div className="section-head">
            <p className="eyebrow">Design system</p>
            <h1 className="h1">Style guide</h1>
            <p className="lead">Tất cả token và component nằm trong src/app/globals.css.</p>
          </div>

          <h2 className="h3">Màu</h2>
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(9rem, 1fr))",
              gap: "var(--sp-sm)",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {SWATCHES.map(([name, hex]) => (
              <li key={name}>
                <div
                  style={{
                    height: "3.5rem",
                    borderRadius: "var(--r-xs)",
                    background: `var(${name})`,
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,.12)",
                    marginBottom: "var(--sp-2xs)",
                  }}
                />
                <p className="caption">{name}</p>
                <p className="caption">{hex}</p>
              </li>
            ))}
          </ul>

          <hr className="rule" />

          <h2 className="h3">Typography</h2>
          <div className="stack stack--sm">
            <p className="eyebrow">Eyebrow · 0.75rem · tracking 0.22em</p>
            <p className="display">Display</p>
            <p className="h1">Heading 1 — Quốc Anh &amp; Diệp Khanh</p>
            <p className="h2">Heading 2 — Thông tin lễ cưới</p>
            <p className="h3">Heading 3 — Lễ Vu Quy</p>
            <p className="h4">Heading 4 — Trung tâm Hội nghị Hoa Sứ</p>
            <p className="lead">Lead — Hai đứa dọn về ở chung, nuôi ba con mèo, và muốn có bạn ở đó lúc bắt đầu.</p>
            <p className="body">Body — Đầy đủ dấu tiếng Việt: ạ ả ằ ắ ẳ ẵ ặ ầ ấ ẩ ẫ ậ ề ế ể ễ ệ ồ ố ổ ỗ ộ ơ ờ ớ ở ỡ ợ ư ừ ứ ử ữ ự ỵ ỷ ỹ.</p>
            <p className="script">Script — Nhớ đói bụng sẵn nha!</p>
            <p className="caption">Caption — Nhằm ngày 30 tháng 9 năm Bính Ngọ</p>
          </div>

          <hr className="rule" />

          <h2 className="h3">Buttons</h2>
          <div className="row">
            <button type="button" className="btn btn--stamp">
              <span className="btn__star" aria-hidden="true">
                ★
              </span>
              Print now
              <span className="btn__star" aria-hidden="true">
                ★
              </span>
            </button>
            <button type="button" className="btn">
              Nút thường
            </button>
            <button type="button" className="btn btn--outline">
              Nút viền <i className="btn__arrow">→</i>
            </button>
            <button type="button" className="btn btn--ghost">
              Nút chữ
            </button>
            <button type="button" className="btn" disabled>
              Vô hiệu hoá
            </button>
          </div>

          <hr className="rule" />

          <h2 className="h3">Spacing</h2>
          <ul className="stack stack--sm" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {SPACING.map((step) => (
              <li key={step} style={{ display: "flex", alignItems: "center", gap: "var(--sp-sm)" }}>
                <span className="caption" style={{ width: "5rem" }}>
                  --sp-{step}
                </span>
                <span style={{ height: "0.75rem", width: `var(--sp-${step})`, background: "var(--c-red)" }} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--stripe">
        <div className="container container--content sheet stack">
          <img className="seal" src="/art/seal.webp" alt="" aria-hidden="true" />
          <h2 className="h3">.sheet — tấm giấy hình con tem</h2>
          <p className="muted">
            Mép răng cưa cắt bằng CSS mask nên co theo mọi chiều cao. Nền kẻ sọc bắt buộc phải lót tấm này trước khi
            đặt nội dung lên. Không đổ bóng.
          </p>
          <div style={{ width: "min(260px, 60vw)" }} className="stamp">
            <img className="stamp__photo" src="/art/couple-1.webp" alt="" />
            <img className="stamp__frame" src="/art/stamp-frame.webp" alt="" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="section section--red section--red-stripe">
        <div className="container container--content stack">
          <div className="section-head">
            <p className="eyebrow">Nền đỏ kẻ sọc</p>
            <h2 className="h2">.section--red.section--red-stripe</h2>
            <p className="lead">Vải sọc gốc, lát ở tỉ lệ 1:1 nên giữ nguyên thớ dệt thô.</p>
          </div>
        </div>
      </section>

      <section className="section section--red">
        <div className="container container--content stack">
          <div className="section-head">
            <p className="eyebrow">Section đỏ</p>
            <h2 className="h2">Màu tự đảo vai trò</h2>
            <p className="lead">Không cần override gì — chỉ cần đổi class thành .section--red.</p>
          </div>
          <div className="row row--center">
            <button type="button" className="btn btn--stamp">
              <span className="btn__star" aria-hidden="true">
                ★
              </span>
              Print now
              <span className="btn__star" aria-hidden="true">
                ★
              </span>
            </button>
            <button type="button" className="btn btn--outline">
              Xem bản đồ <i className="btn__arrow">→</i>
            </button>
            <span className="chip">Chip</span>
          </div>
          <div className="choice">
            <label className="choice__item">
              <input type="radio" name="demo" defaultChecked />
              <span>Đang chọn</span>
            </label>
            <label className="choice__item">
              <input type="radio" name="demo" />
              <span>Chưa chọn</span>
            </label>
          </div>
          <div className="field">
            <label className="label" htmlFor="demo-input">
              .input
            </label>
            <input className="input" id="demo-input" placeholder="Nhập gì đó…" />
          </div>
        </div>
      </section>
    </main>
  );
}
