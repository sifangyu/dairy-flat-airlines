import { connectDB } from "@/lib/mongodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const origin = searchParams.get("origin");
  const dest = searchParams.get("dest");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!origin || !dest || !start || !end) {
    return Response.json([]);
  }

  const db = await connectDB();

  const templates = await db.collection("flights").find({
    origin,
    destination: dest
  }).toArray();

  let current = new Date(start);
  const endDate = new Date(end);

  const results = [];

  while (current <= endDate) {
    const dateStr = current.toISOString().split("T")[0];
    const day = current.getDay();

    const utcStart = Date.UTC(
      current.getFullYear(),
      current.getMonth(),
      current.getDate()
    );

    for (const t of templates) {
      if (!t.weekdays.includes(day)) continue;

      const depUtc = utcStart + t.depUtcMin * 60000;
      const arrUtc = depUtc + t.durationMin * 60000;

      results.push({
        _id: `${t.flightNo}-${dateStr}`,
        flightNo: t.flightNo,
        origin: t.origin,
        destination: t.destination,
        depUtc,
        arrUtc,
        price: 120 + Math.floor(Math.random() * 200),
      });
    }

    current.setDate(current.getDate() + 1);
  }

  return Response.json(results);
}