import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpClient } from "drizzle-orm/neon-http";

import { config } from "dotenv";

config({ path: ".env.local" });

export const sql = neon(process.env.DATABASE_URL!) as unknown as NeonHttpClient;
export const db = drizzle({ client: sql });
