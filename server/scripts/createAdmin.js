/**
 * Create or reset the dummy admin account in MongoDB.
 * Usage: npm run create-admin --prefix server
 */
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { User } from '../src/models/User.js';

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/csi_platform';
const adminEmail = (process.env.ADMIN_EMAIL || 'admin@csi.vitc.edu').toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
const adminName = process.env.ADMIN_NAME || 'CSI Admin';

async function main() {
  await mongoose.connect(mongoUri);
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await User.findOneAndUpdate(
    { email: adminEmail },
    {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: 'admin',
      department: 'CSE',
      domainInterests: ['Web Development', 'AI / ML'],
    },
    { upsert: true, new: true }
  );

  console.log('Dummy admin ready:');
  console.log('  Email:   ', adminEmail);
  console.log('  Password:', adminPassword);
  console.log('  Role:    ', admin.role);
  console.log('  ID:      ', admin._id.toString());
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
