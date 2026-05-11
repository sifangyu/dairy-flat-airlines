"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { AIRPORT_NAMES } from "@/lib/airports";
import { AIRPORT_TIME_INFO } from "@/lib/timezones";

const fmtAirportTime = (
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

function InvoiceContent() {
  const params = useSearchParams();
  const router = useRouter();

  const ref = params.get("ref");
  const name = params.get("name");
  const email = params.get("email");

  const origin = params.get("origin") || "";
  const destination = params.get("destination") || "";

  const [seat, setSeat] = useState("");
  const [gate, setGate] = useState("");

  useEffect(() => {
    setSeat(`${Math.floor(Math.random() * 30) + 1}A`);
    setGate(`${Math.floor(Math.random() * 10) + 1}`);
  }, []);

  const cancelBooking = async () => {
    await fetch("/api/bookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref }),
    });

    alert("Booking cancelled");
    router.push("/");
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-blue-50 min-h-screen">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-16">

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Header */}
          <div className="bg-blue-600 text-white text-center py-6">
            <h1 className="text-3xl font-bold">
              ✈ Dairy Flat Airlines
            </h1>

            <p className="opacity-80 text-sm">
              Official Booking Receipt
            </p>
          </div>

          {/* Body */}
          <div className="p-10 space-y-5 text-gray-700">

            {/* Passenger */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Booking Ref
                </span>

                <span className="font-mono font-bold">
                  {ref}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Passenger
                </span>

                <span>{name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Email
                </span>

                <span>{email}</span>
              </div>
            </div>

            {/* Flight */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Flight
                </span>

                <span className="font-semibold">
                  {params.get("flightNo")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Route
                </span>

                <span>
                  {AIRPORT_NAMES[origin]} →
                  {" "}
                  {AIRPORT_NAMES[destination]}
                </span>
              </div>

              {/* Departure */}
              <div className="flex justify-between items-start">
                <span className="text-gray-500">
                  Departure
                </span>

                <div className="text-right">
                  <div className="font-medium">
                    {fmtAirportTime(
                      Number(params.get("depUtc")),
                      origin
                    )}{" "}
                    {AIRPORT_TIME_INFO[origin]?.label}
                  </div>

                  <div className="text-xs text-gray-400">
                    {AIRPORT_TIME_INFO[origin]?.city}
                    {" "}
                    ({origin}) Local Time
                  </div>
                </div>
              </div>

              {/* Arrival */}
              <div className="flex justify-between items-start">
                <span className="text-gray-500">
                  Arrival
                </span>

                <div className="text-right">
                  <div className="font-medium">
                    {fmtAirportTime(
                      Number(params.get("arrUtc")),
                      destination
                    )}{" "}
                    {AIRPORT_TIME_INFO[destination]?.label}
                  </div>

                  <div className="text-xs text-gray-400">
                    {AIRPORT_TIME_INFO[destination]?.city}
                    {" "}
                    ({destination}) Local Time
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Seat
                </span>

                <span>{seat}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Gate
                </span>

                <span>{gate}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex justify-between text-lg pt-4 border-t">

              <span className="font-semibold">
                Total Fare
              </span>

              <span className="text-blue-700 font-bold">
                ${params.get("price")} NZD
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 flex justify-center gap-4 bg-gray-50">

            <button
              onClick={() => window.print()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Print
            </button>

            <button
              onClick={() => router.push("/flights")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Return to Flight Search
            </button>

            <button
              onClick={cancelBooking}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Cancel Booking
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          This invoice confirms your flight booking.
        </p>
      </div>
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvoiceContent />
    </Suspense>
  );
}