import {drizzle} from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';
import * as schema from '../models/schema.js';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

const client = postgres(databaseUrl, {prepare: false});
export const db = drizzle(client, {schema});