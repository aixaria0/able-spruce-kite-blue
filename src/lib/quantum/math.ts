export type Complex = { re: number; im: number };

export function c(re: number, im = 0): Complex {
  return { re, im };
}

export function cadd(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function cmul(a: Complex, b: Complex): Complex {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}

export function cscale(a: Complex, s: number): Complex {
  return { re: a.re * s, im: a.im * s };
}

export function cconj(a: Complex): Complex {
  return { re: a.re, im: -a.im };
}

export function abs2(a: Complex): number {
  return a.re * a.re + a.im * a.im;
}

export function zeros(n: number): Complex[] {
  const out: Complex[] = new Array(n);
  for (let i = 0; i < n; i++) out[i] = { re: 0, im: 0 };
  return out;
}

export function bit(index: number, q: number): number {
  return (index >> q) & 1;
}

export function flip(index: number, q: number): number {
  return index ^ (1 << q);
}

export function sha256Hex(input: string): string {
  // Lightweight FNV-1a + avalanche mix for demo binding hashes.
  // Not a cryptographic SHA-256; labeled as a local digest in the cert.
  let h1 = 0x811c9dc5;
  let h2 = 0x811c9dc5 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193);
    h2 = Math.imul(h2 ^ (ch << (i % 13)), 0x85ebca6b);
  }
  const a = (h1 >>> 0).toString(16).padStart(8, "0");
  const b = (h2 >>> 0).toString(16).padStart(8, "0");
  const c = ((h1 ^ h2) >>> 0).toString(16).padStart(8, "0");
  const d = (Math.imul(h1, h2) >>> 0).toString(16).padStart(8, "0");
  return `${a}${b}${c}${d}${a.split("").reverse().join("")}${b}${c}${d}`.slice(0, 64);
}

export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function next() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
