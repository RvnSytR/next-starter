"use client";

import {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import z from "zod";

const allLayoutMode = ["fullwidth", "centered"] as const;
type LayoutMode = (typeof allLayoutMode)[number];

const defaultLayout: LayoutMode = "centered";

type LayoutContextType = {
  layout: LayoutMode | null;
  setLayout: React.Dispatch<React.SetStateAction<LayoutMode | null>>;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [layout, setLayout] = useState<LayoutMode | null>(null);

  const onMount = useEffectEvent(() => {
    const stored = localStorage.getItem("layout-preference");
    const zodRes = z.enum(allLayoutMode).safeParse(stored);
    if (zodRes.success) setLayout(zodRes.data);
    else {
      setLayout(defaultLayout);
      localStorage.setItem("layout-preference", defaultLayout);
    }
  });

  useEffect(() => onMount(), []);

  useEffect(() => {
    if (layout) localStorage.setItem("layout-preference", layout);
  }, [layout]);

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used in LayoutProvider");
  return ctx;
}
