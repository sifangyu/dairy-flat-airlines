export const AIRPORT_TIME_INFO: Record<
  string,
  {
    timezone: string;
    city: string;
    label: string;
  }
> = {
  NZNE: {
    timezone: "Pacific/Auckland",
    city: "Auckland",
    label: "NZST",
  },

  NZRO: {
    timezone: "Pacific/Auckland",
    city: "Rotorua",
    label: "NZST",
  },

  YSSY: {
    timezone: "Australia/Sydney",
    city: "Sydney",
    label: "AEST",
  },

  YMML: {
    timezone: "Australia/Melbourne",
    city: "Melbourne",
    label: "AEST",
  },
};