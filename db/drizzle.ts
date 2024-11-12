import { neon } from "@neondatabase/serverless";
import { drizzle, NeonClient } from "drizzle-orm/neon-serverless";

export const sql = neon(process.env.DATABASE_URL!) as unknown as NeonClient;
export const db = drizzle(sql);
