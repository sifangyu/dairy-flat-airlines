export function generateFlights(date1: string, date2: string) {
  const flights: any[] = [];

  const start = new Date(date1);
  const end = new Date(date2);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();

    // NZNE → YSSY Friday
    if (day === 5) {
      flights.push({
        _id: "FL-" + d.toISOString(),
        from: "NZNE",
        to: "YSSY",
        departure: d.toISOString(),
        capacity: 6,
        price: 1200
      });
    }

    // YSSY → NZNE Sunday
    if (day === 0) {
      flights.push({
        _id: "FLR-" + d.toISOString(),
        from: "YSSY",
        to: "NZNE",
        departure: d.toISOString(),
        capacity: 6,
        price: 1200
      });
    }
  }

  return flights;
}