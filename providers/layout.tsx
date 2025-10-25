"use client";

import {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
} from "react";

type LayoutContextType = {
  isFullWidth: boolean | null;
  isMounted: boolean;
  toggleLayout: () => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isFullWidth, setIsFullWidth] = useState<boolean | null>(null);

  const onMount = useEffectEvent(() => {
    const stored = localStorage.getItem("layout:fullwidth");
    if (stored === null) {
      setIsFullWidth(false);
      localStorage.setItem("layout:fullwidth", JSON.stringify(false));
    } else setIsFullWidth(JSON.parse(stored));
  });

  useEffect(() => onMount(), []);

  const isMounted = isFullWidth !== null;
  const toggleLayout = () => {
    setIsFullWidth((prev) => {
      const updated = !prev;
      localStorage.setItem("layout:fullwidth", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <LayoutContext.Provider value={{ isFullWidth, isMounted, toggleLayout }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used in LayoutProvider");
  return ctx;
}
