'use server';

import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const DB_PATH = path.join(process.cwd(), 'src/lib/db.json');

export async function getDb() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Database unavailable:", error);
    return { settings: { recruitmentOpen: false }, users: [] };
  }
}

export async function saveDb(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export async function getRecruitmentStatus() {
  const db = await getDb();
  return db.settings.recruitmentOpen;
}

export async function toggleRecruitment() {
  const db = await getDb();
  db.settings.recruitmentOpen = !db.settings.recruitmentOpen;
  await saveDb(db);
  revalidatePath('/rekrutmen');
  revalidatePath('/admin/dashboard');
  return db.settings.recruitmentOpen;
}

export async function login(email: string, password: string) {
  const db = await getDb();
  const user = db.users.find((u: any) => u.email === email && u.password === password);
  
  if (user) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', JSON.stringify({ 
      email: user.email, 
      role: user.role, 
      division: user.division, 
      name: user.name 
    }), { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });
    return { success: true };
  }
  return { success: false, error: 'Kredensial tidak valid' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (!session) return null;
    return JSON.parse(session.value);
  } catch (e) {
    return null;
  }
}
