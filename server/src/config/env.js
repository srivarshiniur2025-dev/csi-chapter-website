import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim()),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/csi_platform',
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  firebasePrivateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  adminEmail: process.env.ADMIN_EMAIL || 'admin@csi.vitc.edu',
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin@12345',
  adminName: process.env.ADMIN_NAME || 'CSI Admin',
  jwtSecret: process.env.JWT_SECRET || 'csi-dev-jwt-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
