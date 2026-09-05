import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

export function formatFixed(n: number, digits = 4) {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(digits);
}

export function shortHash(hex: string, n = 12) {
  if (hex.length <= n) return hex;
  return `${hex.slice(0, n)}…`;
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
