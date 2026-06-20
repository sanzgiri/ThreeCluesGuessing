import type { Person } from '@shared/types';
import peopleData from './people.json';

import Fuse from 'fuse.js';

export const people: Person[] = peopleData as Person[];

const fuse = new Fuse(people, {
  keys: [
    { name: 'name', weight: 1.0 },
    { name: 'metadata.aliases', weight: 0.9 },
  ],
  threshold: 0.3, // 0.0 is exact match, 1.0 is match anything. 0.3 allows for typos/partial matches.
  ignoreLocation: true,
  includeScore: true,
});

export function getRandomPerson(excludeIds: string[] = []): Person {
  const available = people.filter((p) => !excludeIds.includes(p.id));
  const pool = available.length > 0 ? available : people;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Deterministic daily puzzle. Uses the date to pick an index, but also walks a
 * full permutation so the same person doesn't reappear within one cycle through
 * the whole list. The permutation itself is fixed (seeded), so every player gets
 * the same person on the same calendar day.
 */
export function getDailyPerson(dateISO: string): Person {
  const epochDay = Math.floor(new Date(`${dateISO}T00:00:00Z`).getTime() / 86_400_000);
  const order = getDailyOrder();
  const index = ((epochDay % order.length) + order.length) % order.length;
  return order[index];
}

let cachedOrder: Person[] | null = null;
function getDailyOrder(): Person[] {
  if (cachedOrder) return cachedOrder;
  // Seeded shuffle (mulberry32) so the rotation is stable across sessions/builds.
  const arr = [...people];
  let seed = 0x9e3779b9;
  const rand = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  cachedOrder = arr;
  return arr;
}

const STRONG_MATCH_SCORE = 0.45; // Fuse score; lower is better. Reject loose matches.

/**
 * Resolve a typed guess to a Person, tolerating typos but rejecting unrelated
 * input. Returns undefined when nothing is a confident match (so a random
 * string is NOT silently counted as a correct/known answer).
 */
export function findPersonByName(name: string): Person | undefined {
  const normalized = normalize(name);
  if (!normalized) return undefined;

  // 1. Exact / alias / last-name match wins immediately.
  const exact = people.find(
    (p) =>
      normalize(p.name) === normalized ||
      lastName(p.name) === normalized ||
      p.metadata?.aliases?.some((a) => normalize(a) === normalized),
  );
  if (exact) return exact;

  // 2. Fall back to fuzzy, but only accept a confident match.
  const results = fuse.search(name);
  if (results.length > 0 && (results[0].score ?? 1) <= STRONG_MATCH_SCORE) {
    return results[0].item;
  }
  return undefined;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents (José -> jose)
    .replace(/[.\-']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function lastName(fullName: string): string {
  const parts = normalize(fullName).split(' ');
  return parts[parts.length - 1] ?? '';
}

export const categories = Array.from(new Set(people.map((p) => p.category)));

/** Look up a person by their stable id (used for versus challenges). */
export function findPersonById(id: string): Person | undefined {
  return people.find((p) => p.id === id);
}
