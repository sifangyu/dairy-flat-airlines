import { connectDB } from "@/lib/mongodb";

export async function GET() {
  const db = await connectDB();

  await db.collection("test").insertOne({
    name: "connected"
  });

  return Response.json({ ok: true });
}