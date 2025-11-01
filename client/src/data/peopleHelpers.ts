import type { Person } from '@shared/types';
import peopleData from './people.json';

export const people: Person[] = peopleData as Person[];

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
  const normalized = name.toLowerCase().trim();
  return people.find(p => 
    p.name.toLowerCase() === normalized ||
    p.metadata?.aliases?.some(a => a.toLowerCase() === normalized)
  );
}

export const categories = Array.from(new Set(people.map(p => p.category)));
