"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { rsvpClient, sheetEndpoint, type InvitationType } from "@/data/wedding";

export type Guest = {
  slug: string;
  name: string;
  type: InvitationType;
  /** Số bàn cặp đôi xếp trong Sheet; rỗng là chưa xếp */
  table: string;
};

type GuestState = {
  /** null nghĩa là khách vào thẳng trang chủ, không qua link mời riêng */
  guest: Guest | null;
  /** Còn đang hỏi Sheet — dùng để tránh nháy chữ "Dear …" rồi lại mất */
  loading: boolean;
};

const GuestContext = createContext<GuestState>({ guest: null, loading: false });

/** Đọc `?to=` thẳng từ thanh địa chỉ; server không có URL nên trả về null */
const subscribeNever = () => () => {};
const readSlug = () => new URLSearchParams(window.location.search).get("to");

export function GuestProvider({ children }: { children: ReactNode }) {
  const slug = useSyncExternalStore(subscribeNever, readSlug, () => null);

  const [guest, setGuest] = useState<Guest | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!slug || !sheetEndpoint) return;

    // Người xem có thể đóng tab giữa chừng — cờ này chặn setState sau khi gỡ
    let alive = true;
    const url = `${sheetEndpoint}?client=${rsvpClient}&slug=${encodeURIComponent(slug)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data: { ok?: boolean; name?: string; type?: string; table?: string | number }) => {
        if (!alive) return;
        if (!data?.ok || !data.name) {
          setFailed(true);
          return;
        }
        setGuest({
          slug,
          name: data.name,
          type: data.type === "intimate" ? "intimate" : "general",
          table: String(data.table ?? "").trim(),
        });
      })
      .catch(() => {
        if (alive) setFailed(true);
      });

    return () => {
      alive = false;
    };
  }, [slug]);

  const value = useMemo(
    () => ({ guest, loading: Boolean(slug) && Boolean(sheetEndpoint) && !guest && !failed }),
    [guest, slug, failed],
  );

  return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>;
}

export function useGuest() {
  return useContext(GuestContext);
}

/**
 * Kiểu thiệp đang áp dụng. Khách không có link riêng (hoặc slug sai) được coi
 * như khách `general` — thấy tiệc chính, không thấy tiệc chiều.
 */
export function useInvitationType(): InvitationType {
  return useGuest().guest?.type ?? "general";
}
