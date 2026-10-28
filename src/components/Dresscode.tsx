import { Decor } from "./Decor";
import { Reveal } from "./Reveal";
import { couple, dresscode } from "@/data/wedding";
import s from "./Dresscode.module.css";

export function Dresscode() {
  return (
    <section id="dresscode" className="section section--stripe" aria-labelledby="dresscode-title">
      {/* Nền be nên hoạ tiết dùng bộ đỏ */}
      <Decor src="red/cherry" x="-3%" y="8%" w="clamp(70px, 17vw, 150px)" r="-10deg" motion="sway" duration="9s" />
      <Decor src="red/cherry" x="84%" y="76%" w="clamp(62px, 15vw, 132px)" r="12deg" motion="sway" duration="10.5s" delay="-3s" />

      {/* Nền kẻ sọc nên phải lót một tấm giấy trước khi đặt nội dung lên */}
      <div className="container container--content sheet">
        <img className="seal" src="/art/seal.webp" alt="" aria-hidden="true" />

        <Reveal className="section-head">
          <p className="eyebrow">{dresscode.title}</p>
          <h2 id="dresscode-title" className="h2">
            {dresscode.headline}
          </h2>
          <p className="lead">{dresscode.note}</p>
        </Reveal>

        <Reveal className={s.drawing} delay={80}>
          <img
            src="/art/draw/dresscode.webp"
            alt={`Tranh vẽ ${couple.groom} và ${couple.bride}`}
            width={760}
            height={760}
          />
        </Reveal>

      </div>
    </section>
  );
}
