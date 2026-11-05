import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { getProduct, salePrice } from "../data";

type Line = { id: string; qty: number; color?: string; option?: string };
type CartCtx = {
  lines: Line[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (id: string, qty?: number, variant?: { color?: string; option?: string }) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};
const Ctx = createContext<CartCtx>(null!);
export const useCart = () => useContext(Ctx);

/** Demo cart state. In production this maps to /api/cart/{get,add,update,clear}. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([
    { id: "air-buds-pro", qty: 1, color: "White" },
    { id: "geometric-tpu-iphone", qty: 1, option: "Standard" },
  ]);
  const [open, setOpen] = useState(false);
  const add = useCallback((id: string, qty = 1, v?: { color?: string; option?: string }) => {
    setLines((s) => {
      const ex = s.find((l) => l.id === id);
      return ex ? s.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l)) : [...s, { id, qty, ...v }];
    });
    setOpen(true);
  }, []);
  const setQty = useCallback((id: string, qty: number) => setLines((s) => s.map((l) => (l.id === id ? { ...l, qty: Math.max(1, qty) } : l))), []);
  const remove = useCallback((id: string) => setLines((s) => s.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setLines([]), []);
  const value = useMemo(
    () => ({
      lines,
      count: lines.reduce((a, l) => a + l.qty, 0),
      subtotal: lines.reduce((a, l) => a + salePrice(getProduct(l.id)!) * l.qty, 0),
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, open, add, setQty, remove, clear],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
