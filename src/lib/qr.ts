/**
 * Minimal, spec-correct QR Code generator.
 * Byte mode · ECC level L · versions 1–5 · fixed mask 0.
 * Adapted from the public-domain algorithm structure of Project Nayuki's qrcodegen.
 */

const TOTAL_CODEWORDS = [26, 44, 70, 100, 134]; // versions 1..5
const ECC_CODEWORDS_L = [7, 10, 15, 20, 26];
const ALIGNMENT_CENTERS: number[][] = [[], [6, 18], [6, 22], [6, 26], [6, 30]];

export type QRMatrix = boolean[][];

function utf8Bytes(text: string): number[] {
  const out: number[] = [];
  const enc = encodeURIComponent(text);
  for (let i = 0; i < enc.length; i++) {
    if (enc[i] === '%') {
      out.push(parseInt(enc.slice(i + 1, i + 3), 16));
      i += 2;
    } else {
      out.push(enc.charCodeAt(i));
    }
  }
  return out;
}

function gfMul(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
}

function rsDivisor(degree: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < degree - 1; i++) result.push(0);
  result.push(1);
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = gfMul(result[j], root);
      if (j + 1 < result.length) result[j] ^= result[j + 1];
    }
    root = gfMul(root, 0x02);
  }
  return result;
}

function rsRemainder(data: number[], divisor: number[]): number[] {
  const result: number[] = divisor.map(() => 0);
  for (const b of data) {
    const factor = b ^ (result.shift() as number);
    result.push(0);
    for (let i = 0; i < divisor.length; i++) {
      result[i] ^= gfMul(divisor[i], factor);
    }
  }
  return result;
}

function getBit(x: number, i: number): boolean {
  return ((x >>> i) & 1) !== 0;
}

/** Generates a QR matrix for the given text, or null if it is too long. */
export function generateQR(text: string): QRMatrix | null {
  const bytes = utf8Bytes(text);

  // Choose smallest version whose byte-mode capacity fits.
  let version = 0;
  for (let v = 1; v <= 5; v++) {
    const dataCodewords = TOTAL_CODEWORDS[v - 1] - ECC_CODEWORDS_L[v - 1];
    if (bytes.length + 2 <= dataCodewords) {
      version = v;
      break;
    }
  }
  if (version === 0) return null;

  const size = 17 + version * 4;
  const matrix: QRMatrix = Array.from({ length: size }, () => Array(size).fill(false));
  const isFunc: QRMatrix = Array.from({ length: size }, () => Array(size).fill(false));

  const setFunc = (x: number, y: number, dark: boolean) => {
    matrix[y][x] = dark;
    isFunc[y][x] = true;
  };

  /* ------------------------- function patterns ------------------------- */

  // Timing patterns
  for (let i = 0; i < size; i++) {
    setFunc(6, i, i % 2 === 0);
    setFunc(i, 6, i % 2 === 0);
  }

  // Finder patterns + separators
  const drawFinder = (cx: number, cy: number) => {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || y < 0 || x >= size || y >= size) continue;
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        setFunc(x, y, dist !== 2 && dist !== 4);
      }
    }
  };
  drawFinder(3, 3);
  drawFinder(size - 4, 3);
  drawFinder(3, size - 4);

  // Alignment patterns
  const centers = ALIGNMENT_CENTERS[version - 1];
  if (centers.length > 0) {
    const last = centers[centers.length - 1];
    for (const cy of centers) {
      for (const cx of centers) {
        if ((cx === 3 && cy === 3) || (cx === last && cy === 3) || (cx === 3 && cy === last)) continue;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            setFunc(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
          }
        }
      }
    }
  }

  // Format information — ECC L (01) with mask 0
  const mask = 0;
  {
    const data = (0b01 << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;
    for (let i = 0; i <= 5; i++) setFunc(8, i, getBit(bits, i));
    setFunc(8, 7, getBit(bits, 6));
    setFunc(8, 8, getBit(bits, 7));
    setFunc(7, 8, getBit(bits, 8));
    for (let i = 9; i < 15; i++) setFunc(14 - i, 8, getBit(bits, i));
    for (let i = 0; i < 8; i++) setFunc(size - 1 - i, 8, getBit(bits, i));
    for (let i = 8; i < 15; i++) setFunc(8, size - 15 + i, getBit(bits, i));
    setFunc(8, size - 8, true); // always-dark module
  }

  /* ----------------------------- codewords ----------------------------- */

  const dataCodewords = TOTAL_CODEWORDS[version - 1] - ECC_CODEWORDS_L[version - 1];
  const capacityBits = dataCodewords * 8;

  const bits: number[] = [];
  const push = (val: number, n: number) => {
    for (let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1);
  };
  push(4, 4); // byte mode
  push(bytes.length, 8); // char count (versions 1–9)
  for (const b of bytes) push(b, 8);
  push(0, Math.min(4, capacityBits - bits.length)); // terminator
  while (bits.length % 8 !== 0) bits.push(0);
  for (let pad = 0xec; bits.length < capacityBits; pad ^= 0xec ^ 0x11) push(pad, 8);

  const dataBytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
    dataBytes.push(b);
  }

  const ecc = rsRemainder(dataBytes, rsDivisor(ECC_CODEWORDS_L[version - 1]));
  const allCodewords = [...dataBytes, ...ecc];

  // Zigzag placement
  let bitIdx = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (!isFunc[y][x] && bitIdx < allCodewords.length * 8) {
          matrix[y][x] = getBit(allCodewords[bitIdx >>> 3], 7 - (bitIdx & 7));
          bitIdx++;
        }
      }
    }
  }

  // Mask 0: invert where (x + y) % 2 === 0
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!isFunc[y][x] && (x + y) % 2 === 0) matrix[y][x] = !matrix[y][x];
    }
  }

  return matrix;
}
