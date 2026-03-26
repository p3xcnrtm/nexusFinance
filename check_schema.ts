import db from './server/db.ts';

const columns = db.prepare("PRAGMA table_info(users);").all();
console.log(columns);
