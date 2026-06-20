import type { VersusChallenge } from '@shared/types';

/** URL-safe base64 encode of a UTF-8 string. */
function b64urlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Encode a challenge into a compact token. We use short keys to keep the URL
 * small: p=personId, b=by, c=clueLevel, s=points (score), t=timeMs.
 */
export function encodeChallenge(c: VersusChallenge): string {
  const compact = {
    p: c.personId,
    b: c.by,
    c: c.clueLevel,
    s: c.points,
    t: c.timeMs ?? null,
  };
  return b64urlEncode(JSON.stringify(compact));
}

export function decodeChallenge(token: string): VersusChallenge | null {
  try {
    const obj = JSON.parse(b64urlDecode(token));
    if (typeof obj.p !== 'string') return null;
    return {
      personId: obj.p,
      by: typeof obj.b === 'string' ? obj.b : 'A friend',
      clueLevel: obj.c === 1 || obj.c === 2 || obj.c === 3 ? obj.c : null,
      points: typeof obj.s === 'number' ? obj.s : 0,
      timeMs: typeof obj.t === 'number' ? obj.t : null,
    };
  } catch {
    return null;
  }
}

/** Build a full shareable challenge URL for the current origin. */
export function buildChallengeUrl(c: VersusChallenge): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/challenge#${encodeChallenge(c)}`;
}
