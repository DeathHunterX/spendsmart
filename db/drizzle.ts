import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schemas from "./schemas";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
export const db = drizzle({ client: pool, schema: schemas });
