"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Lock = {
  /** Chỉ khoá khi JavaScript đã chạy — xem ghi chú ở `ready` bên dưới */
  locked: boolean;
  unlock: () => void;
};

/*
   Mặc định là ĐÃ mở. Component nào nằm ngoài <UnlockProvider> thì hiện bình
   thường, không bị khoá oan.
*/
const LockContext = createContext<Lock>({ locked: false, unlock: () => {} });

/** Cờ "đã hydrate xong": server trả false, máy khách trả true, không đổi nữa */
const subscribeNever = () => () => {};

/** Bọc quanh phần chơi ghép hình và phần bị khoá. Xem <Puzzle /> và <Details />. */
export function UnlockProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  /*
     HTML dựng từ server luôn ở trạng thái mở. Chỉ sau khi hydrate xong mới
     khoá lại — nhờ vậy máy tắt JavaScript vẫn đọc được thông tin lễ cưới thay
     vì nhìn một mảng mờ không cách nào mở ra.
  */
  const ready = useSyncExternalStore(subscribeNever, () => true, () => false);

  const unlock = useCallback(() => setUnlocked(true), []);
  const value = useMemo(
    () => ({ locked: ready && !unlocked, unlock }),
    [ready, unlocked, unlock],
  );

  return <LockContext.Provider value={value}>{children}</LockContext.Provider>;
}

export function useLock() {
  return useContext(LockContext);
}
