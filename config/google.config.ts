import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
  projectId: process.env.GOOGLE_PROJECT_ID,
  clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
  privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}));