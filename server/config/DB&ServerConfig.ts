import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../src/.env') });

const MONGO_URI: string = process.env.MONGO_URI || '';
const BACKEND_SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const config = {
  server: { PORT: BACKEND_SERVER_PORT },
  DB: { URL: MONGO_URI }
};

console.log(config);
export default config;
