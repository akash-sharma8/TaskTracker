import 'dotenv/config';
import app from './server.js';
import { connectDB } from './config/database.js';

await connectDB();

export default app;