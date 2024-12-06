import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpClient } from "drizzle-orm/neon-http";

export const sql = neon(process.env.DATABASE_URL!) as unknown as NeonHttpClient;
export const db = drizzle({ client: sql });
