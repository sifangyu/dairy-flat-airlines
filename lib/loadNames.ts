import fs from "fs";
import path from "path";
import csv from "csv-parser";

export function loadNames(): Promise<any[]> {
  return new Promise((resolve) => {
    const results: any[] = [];

    fs.createReadStream(path.join(process.cwd(), "randomnames.csv"))
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results));
  });
}