import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

let db: any;

export async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("airline");
  }
  return db;
}