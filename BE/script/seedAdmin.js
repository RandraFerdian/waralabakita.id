import {db} from '../db/db.js';
import { users } from '../models/users.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const createAdmin = async () => {
  const email = 'superadmin@gmail.com';
  const password = 'superadminpassword';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingAdmin.length > 0) {
    console.log('Admin already exist');
    process.exit(0);
  }

  await db.insert(users).values({
    name: 'Super Admin',
    username: 'superadmin',
    email: email,
    passwordHash: hashedPassword,
    role: 'admin',
  });

  console.log('Admin successfully created');
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});