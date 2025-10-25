import { useEffect, useEffectEvent, useState } from "react";
import { create } from "zustand";

type LayoutStore = {
  isFullWidth: boolean;
  setIsFullWidth: (v: boolean) => void;
};

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const onMobile = useEffectEvent(() =>
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT),
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    mql.addEventListener("change", onChange);
    onMobile();
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValue;
}

export function useLayoutStore() {
  return create<LayoutStore>()((set) => ({
    isFullWidth: false,
    setIsFullWidth: (v) => {
      set({ isFullWidth: v });
      localStorage.setItem("layout:fullWidth", String(v));
    },
  }));
}

export * from "./swr";
