import { AIRPORT_TIME_INFO } from "./timezones";

export const fmtAirportTime = (
  utc: number,
  airportCode: string
) => {
  const info = AIRPORT_TIME_INFO[airportCode];

  return new Date(utc).toLocaleString("en-NZ", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: info.timezone,
  });
};