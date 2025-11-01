import { people } from '../client/src/data/people';
import * as fs from 'fs';

fs.writeFileSync('client/src/data/people.json', JSON.stringify(people, null, 2));

console.log(`✅ Successfully created people.json with ${people.length} people`);
console.log('First:', people[0].name);
console.log('Last:', people[people.length - 1].name);
