import type { Person } from '@shared/types';
import peopleData from './people.json';

import Fuse from 'fuse.js';

export const people: Person[] = peopleData as Person[];

const fuse = new Fuse(people, {
  keys: [
    { name: 'name', weight: 1.0 },
    { name: 'metadata.aliases', weight: 0.9 }
  ],
  threshold: 0.3, // 0.0 is exact match, 1.0 is match anything. 0.3 allows for typos/partial matches.
  includeScore: true,
});

export function getRandomPerson(excludeIds: string[] = []): Person {
  const available = people.filter(p => !excludeIds.includes(p.id));
  return available[Math.floor(Math.random() * available.length)];
}

export function getDailyPerson(dateISO: string): Person {
  const hash = dateISO.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  const index = Math.abs(hash) % people.length;
  return people[index];
}

export function findPersonByName(name: string): Person | undefined {
  const results = fuse.search(name);
  if (results.length > 0) {
    // Return the best match
    return results[0].item;
  }
  return undefined;
}

export const categories = Array.from(new Set(people.map(p => p.category)));
