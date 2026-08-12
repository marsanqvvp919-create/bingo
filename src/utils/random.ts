/**
 * Generate a cryptographically secure random integer between min (inclusive) and max (inclusive).
 */
export function getRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  if (range <= 0) return min;

  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    const maxUint32 = 0xffffffff;
    // To prevent modulo bias, compute the largest multiple of range <= maxUint32
    const limit = maxUint32 - (maxUint32 % range);
    
    let randomVal: number;
    do {
      window.crypto.getRandomValues(array);
      randomVal = array[0];
    } while (randomVal >= limit);

    return min + (randomVal % range);
  }

  // Fallback to Math.random if crypto is unavailable
  return Math.floor(Math.random() * range) + min;
}

/**
 * Pick an undrawn random number from remaining available numbers
 */
export function pickNextBingoNumber(drawnNumbers: number[], maxNumber: number): number | null {
  const drawnSet = new Set(drawnNumbers);
  const remaining: number[] = [];

  for (let i = 1; i <= maxNumber; i++) {
    if (!drawnSet.has(i)) {
      remaining.push(i);
    }
  }

  if (remaining.length === 0) {
    return null;
  }

  const randomIndex = getRandomInt(0, remaining.length - 1);
  return remaining[randomIndex];
}
