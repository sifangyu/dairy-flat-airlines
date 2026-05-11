"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/app/components/Navbar";

import { FLIGHT_TIMETABLE } from "@/lib/timetable";
import { AIRPORT_NAMES } from "@/lib/airports";

import { fmtAirportTime } from "@/lib/time";
import { AIRPORT_TIME_INFO } from "@/lib/timezones";

type Schedule = {
  _id: string;
  flightNo: string;
  origin: string;
  destination: string;
  depUtc: number;
  arrUtc: number;
  price: number;
};

export default function Flights() {
  const router = useRouter();

  const [orig, setOrig] = useState("NZNE");
  const [dest, setDest] = useState("YSSY");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [schedules, setSchedules] =
    useState<Schedule[]>([]);

  // Booking Modal
  const [selectedFlight, setSelectedFlight] =
    useState<Schedule | null>(null);

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [gender, setGender] =
    useState("M");

  const [email, setEmail] =
    useState("");

  // Restricted routes
  const validDestinations = (
    from: string
  ) => {
    if (from === "NZNE") {
      return [
        "YSSY",
        "NZRO",
        "NZGB",
        "NZCI",
        "NZTL",
      ];
    }

    return ["NZNE"];
  };

  // Minimum date
  const getMinDate = () => {
    const now = new Date();

    const today = now.getDay();

    const currentMin =
      now.getHours() * 60 +
      now.getMinutes();

    const remainingFlights =
      FLIGHT_TIMETABLE.filter(
        (f) =>
          f.origin === orig &&
          f.destination === dest &&
          f.weekdays.includes(today) &&
          f.depUtcMin > currentMin
      );

    if (remainingFlights.length === 0) {
      const tomorrow = new Date();

      tomorrow.setDate(
        tomorrow.getDate() + 1
      );

      return tomorrow
        .toISOString()
        .split("T")[0];
    }

    return now
      .toISOString()
      .split("T")[0];
  };

  // Search flights
  const search = async () => {
    if (!startDate || !endDate) {
      alert(
        "Please select start and end date"
      );

      return;
    }

    const res = await fetch(
      `/api/flights?origin=${orig}&dest=${dest}&start=${startDate}&end=${endDate}`
    );

    const data = await res.json();

    setSchedules(data);
  };

  // Open booking modal
  const book = (sched: Schedule) => {
    setSelectedFlight(sched);
  };

  // Confirm booking
  const confirmBooking = async () => {
    if (!selectedFlight) return;

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim()
    ) {
      alert(
        "Please complete all required fields."
      );

      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert(
        "Please enter a valid email address."
      );

      return;
    }

    const fullName =
      `${firstName} ${lastName}`;

    const ref =
      "DF-" +
      Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase();

    await fetch("/api/bookings", {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        ...selectedFlight,
        name: fullName,
        gender,
        email,
        ref,
      }),
    });

    router.push(
      `/invoice?flightNo=${selectedFlight.flightNo}` +
        `&origin=${selectedFlight.origin}` +
        `&destination=${selectedFlight.destination}` +
        `&depUtc=${selectedFlight.depUtc}` +
        `&arrUtc=${selectedFlight.arrUtc}` +
        `&price=${selectedFlight.price}` +
        `&name=${fullName}` +
        `&email=${email}` +
        `&ref=${ref}`
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-blue-50 min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">

          <h2 className="text-3xl font-bold text-blue-700 mb-8">
            Search Flights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* From */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                From
              </label>

              <select
                value={orig}
                onChange={(e) => {
                  setOrig(
                    e.target.value
                  );

                  setDest("NZNE");
                }}
                className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:outline-none focus:border-blue-500 transition"
              >
                <option value="NZNE">
                  NZNE (Dairy Flat)
                </option>

                <option value="YSSY">
                  YSSY (Sydney)
                </option>

                <option value="NZRO">
                  NZRO (Rotorua)
                </option>

                <option value="NZCI">
                  NZCI (Chatham)
                </option>

                <option value="NZGB">
                  NZGB (Great Barrier)
                </option>

                <option value="NZTL">
                  NZTL (Lake Tekapo)
                </option>
              </select>
            </div>

            {/* To */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                To
              </label>

              <select
                value={dest}
                onChange={(e) =>
                  setDest(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:outline-none focus:border-blue-500 transition"
              >
                {validDestinations(
                  orig
                ).map((d) => (
                  <option
                    key={d}
                    value={d}
                  >
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                Start Date
              </label>

              <input
                type="date"
                min={getMinDate()}
                value={startDate}
                onChange={(e) =>
                  setStartDate(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                End Date
              </label>

              <input
                type="date"
                min={
                  startDate ||
                  getMinDate()
                }
                value={endDate}
                onChange={(e) =>
                  setEndDate(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Search */}
          <button
            onClick={search}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 transition text-white p-4 rounded-xl font-semibold shadow-md"
          >
            Search Flights
          </button>
        </div>

        {/* Results */}
        <div className="space-y-6">

          {schedules.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
              No flights found.
            </div>
          )}

          {schedules.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border-l-4 border-blue-600"
            >

              {/* Header */}
              <div className="flex justify-between items-center mb-4">

                <div>
                  <div className="text-2xl font-bold text-blue-700">
                    {s.flightNo}
                  </div>

                  <div className="text-gray-500 text-sm">
                    {
                      AIRPORT_NAMES[
                        s.origin
                      ]
                    }{" "}
                    →
                    {
                      AIRPORT_NAMES[
                        s.destination
                      ]
                    }
                  </div>
                </div>

                <div className="text-xl font-semibold text-green-600">
                  ${s.price} NZD
                </div>
              </div>

              {/* Times */}
              <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center mb-4">

                {/* Departure */}
                <div className="text-center">
                  <div className="font-semibold text-lg">
                    Departure
                  </div>

                  <div className="text-gray-500 text-sm">
                    {fmtAirportTime(
                      s.depUtc,
                      s.origin
                    )}{" "}
                    {
                      AIRPORT_TIME_INFO[
                        s.origin
                      ]?.label
                    }
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    {
                      AIRPORT_TIME_INFO[
                        s.origin
                      ]?.city
                    }{" "}
                    Local Time
                  </div>
                </div>

                {/* Plane */}
                <div className="text-2xl text-gray-400">
                  ✈
                </div>

                {/* Arrival */}
                <div className="text-center">
                  <div className="font-semibold text-lg">
                    Arrival
                  </div>

                  <div className="text-gray-500 text-sm">
                    {fmtAirportTime(
                      s.arrUtc,
                      s.destination
                    )}{" "}
                    {
                      AIRPORT_TIME_INFO[
                        s.destination
                      ]?.label
                    }
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    {
                      AIRPORT_TIME_INFO[
                        s.destination
                      ]?.city
                    }{" "}
                    Local Time
                  </div>
                </div>

              </div>

              {/* Book */}
              <div className="flex justify-end">
                <button
                  onClick={() =>
                    book(s)
                  }
                  className="bg-green-600 hover:bg-green-700 transition text-white px-5 py-2 rounded-xl shadow"
                >
                  Book Flight
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Booking Modal */}
        {selectedFlight && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

              <h2 className="text-2xl font-bold text-blue-700 mb-6">
                Passenger Details
              </h2>

              <div className="space-y-4">

                <input
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) =>
                    setFirstName(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl p-3"
                />

                <input
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) =>
                    setLastName(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl p-3"
                />

                <select
                  value={gender}
                  onChange={(e) =>
                    setGender(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl p-3"
                >
                  <option value="M">
                    Male
                  </option>

                  <option value="F">
                    Female
                  </option>
                </select>

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl p-3"
                />

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={() =>
                    setSelectedFlight(
                      null
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    confirmBooking
                  }
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Confirm Booking
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}