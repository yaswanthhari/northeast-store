import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'users.json');

export function getMockUsers() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

export function saveMockUser(user: any) {
  const users = getMockUsers();
  users.push(user);
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

export function findMockUserByEmail(email: string) {
  const users = getMockUsers();
  return users.find((u: any) => u.email === email);
}
