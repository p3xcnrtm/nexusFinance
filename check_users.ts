import db from './server/db.ts';

try {
  const users = db.prepare('SELECT id, fullName, email, phone, country, role, balance, status, kycStatus, createdAt FROM users WHERE role = "user" ORDER BY createdAt DESC').all();
  console.log(users);
} catch (e) {
  console.error(e);
}
