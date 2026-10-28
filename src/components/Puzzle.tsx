"use client";

import { useCallback, useId, useState, type CSSProperties } from "react";
import { useLock } from "./LockContext";
import { puzzle } from "@/data/wedding";
import s from "./Puzzle.module.css";

/**
 * Bề rộng của cái mấu, tính theo bề rộng một mảnh. Mảnh trái thò mấu ra ở cạnh
 * phải, mảnh phải khoét đúng một lỗ như vậy ở cạnh trái — nên khi ghép đúng,
 * hộp của mảnh phải nằm chồng lên hộp mảnh trái đúng bằng TAB.
 */
const TAB = 0.18;

/*
   Vị trí mảnh rời đo bằng BỀ RỘNG MẢNH chứ không phải pixel: mảnh vuông nên
   `translate` phần trăm quy đúng về bề rộng đó, khỏi cần đo đạc gì thêm và đổi
   cỡ màn hình giữa chừng cũng không lệch.
*/
const START = { x: 0.52, y: 0.2 };
/** Vào gần hơn ngần này thì tự hít vào */
const SNAP = 0.17;
/** Mỗi lần bấm phím mũi tên thì nhích đi bao nhiêu */
const STEP = 0.07;

export function Puzzle() {
  const { unlock } = useLock();
  const clipId = useId();

  const [pos, setPos] = useState(START);
  const [dragging, setDragging] = useState(false);
  const [solved, setSolved] = useState(false);

  /** Nhích mảnh tới chỗ mới; đủ gần chỗ đúng thì tự khớp luôn */
  const moveTo = useCallback(
    (x: number, y: number) => {
      if (Math.hypot(x, y) <= SNAP) {
        setPos({ x: 0, y: 0 });
        setSolved(true);
        setDragging(false);
        unlock();
        return;
      }
      setPos({ x, y });
    },
    [unlock],
  );

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (solved) return;
    const box = e.currentTarget.getBoundingClientRect();
    e.currentTarget.setPointerCapture(e.pointerId);
    // Ghi lại điểm gốc ngay lúc bấm để mảnh không nhảy giật về giữa ngón tay
    e.currentTarget.dataset.ox = String(e.clientX - pos.x * box.width);
    e.currentTarget.dataset.oy = String(e.clientY - pos.y * box.width);
    e.currentTarget.dataset.w = String(box.width);
    setDragging(true);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const { ox, oy, w } = e.currentTarget.dataset;
    const width = Number(w);
    if (!width) return;
    moveTo((e.clientX - Number(ox)) / width, (e.clientY - Number(oy)) / width);
  }

  function handlePointerUp() {
    setDragging(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (solved) return;

    const by: Record<string, [number, number]> = {
      ArrowLeft: [-STEP, 0],
      ArrowRight: [STEP, 0],
      ArrowUp: [0, -STEP],
      ArrowDown: [0, STEP],
    };
    const delta = by[e.key];
    if (delta) {
      e.preventDefault();
      moveTo(pos.x + delta[0], pos.y + delta[1]);
      return;
    }

    // Enter / Space: khỏi canh, cho khớp luôn
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      moveTo(0, 0);
    }
  }

  const [left, right] = puzzle.pieces;

  return (
    <div className={s.wrap}>
      <p className={s.title}>{puzzle.title}</p>

      {/* Hai đường cắt dùng chung, đo theo hộp bao nên co giãn theo mảnh */}
      <svg className={s.defs} aria-hidden="true">
        <defs>
          <clipPath id={`${clipId}-tab`} clipPathUnits="objectBoundingBox">
            <path d={`M0,0 H${1 - TAB} V0.35 C0.9,0.27 1,0.37 1,0.5 C1,0.63 0.9,0.73 ${1 - TAB},0.65 V1 H0 Z`} />
          </clipPath>
          <clipPath id={`${clipId}-notch`} clipPathUnits="objectBoundingBox">
            <path d={`M0,0 H1 V1 H0 V0.65 C0.08,0.73 ${TAB},0.63 ${TAB},0.5 C${TAB},0.37 0.08,0.27 0,0.35 Z`} />
          </clipPath>
        </defs>
      </svg>

      <div className={`${s.board} ${solved ? s.solved : ""}`}>
        <figure className={s.slot} style={{ clipPath: `url(#${clipId}-tab)` }}>
          <img src={left.src} alt={left.alt} width={620} height={620} draggable={false} />
        </figure>

        <div
          className={`${s.piece} ${dragging ? s.dragging : ""}`}
          style={
            {
              clipPath: `url(#${clipId}-notch)`,
              "--fx": pos.x,
              "--fy": pos.y,
            } as CSSProperties
          }
          role="button"
          tabIndex={solved ? -1 : 0}
          aria-label={`${right.alt} — kéo hoặc dùng phím mũi tên để ghép vào mảnh bên trái`}
          aria-disabled={solved}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
        >
          <img src={right.src} alt={right.alt} width={620} height={620} draggable={false} />
        </div>
      </div>

      <p className={s.prompt} aria-live="polite">
        {solved ? puzzle.done : puzzle.prompt}
      </p>
    </div>
  );
}
