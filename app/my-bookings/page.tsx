"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";

type Booking = {
  _id: string;
  flightNo: string;
  origin: string;
  destination: string;
  depUtc: number;
  arrUtc: number;
  price: number;
  name: string;
  email: string;
  ref: string;
};

export default function MyBookings() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBookings = async () => {
    if (!email) return alert("Please enter your email");
    setLoading(true);

    try {
      const res = await fetch(`/api/bookings?email=${email}`);
      const data = await res.json();
      setBookings(data);
    } catch {
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (ref: string) => {
    if (!confirm("Cancel this booking?")) return;

    await fetch("/api/bookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref }),
    });

    loadBookings();
  };

  const fmt = (utc: number) =>
    new Date(utc).toLocaleString("en-NZ", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="bg-gradient-to-br from-gray-100 to-blue-50 min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-2">
            ✈ My Bookings
          </h2>
          <p className="text-gray-500 mb-6">
            Retrieve your flight reservations
          </p>

          <div className="flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={loadBookings}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              {loading ? "Loading..." : "Load Bookings"}
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow animate-pulse">
                <div className="h-4 bg-gray-200 w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && bookings.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            <p className="text-xl">No bookings found</p>
            <p className="text-sm mt-2">Try another email</p>
          </div>
        )}

        {/* BOOKINGS */}
        <div className="space-y-6">
          {bookings.map((b) => (
            <div
              key={b.ref}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 border-l-4 border-blue-600"
            >

              {/* Top */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-xl font-bold text-blue-700">
                    {b.flightNo}
                  </div>
                  <div className="text-sm text-gray-500">
                    Booking Ref: {b.ref}
                  </div>
                </div>

                <div className="text-lg font-semibold text-green-600">
                  ${b.price} NZD
                </div>
              </div>

              {/* Route */}
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold">{b.origin}</div>
                  <div className="text-sm text-gray-500">
                    {fmt(b.depUtc)}
                  </div>
                </div>

                <div className="text-gray-400 text-xl">✈</div>

                <div className="text-center">
                  <div className="text-lg font-semibold">{b.destination}</div>
                  <div className="text-sm text-gray-500">
                    {fmt(b.arrUtc)}
                  </div>
                </div>
              </div>

              {/* Passenger */}
              <div className="flex justify-between text-gray-600 text-sm mb-4">
                <div>Passenger: {b.name}</div>
                <div>{b.email}</div>
              </div>

              {/* Actions */}
              <div className="flex justify-end">
                {/* View Invoice */}
                <button
                onClick={() => {
                  window.location.href =
                  `/invoice?flightNo=${b.flightNo}&origin=${b.origin}&destination=${b.destination}` +
                  `&depUtc=${b.depUtc}&arrUtc=${b.arrUtc}&price=${b.price}` +`&name=${b.name}&email=${b.email}&ref=${b.ref}`;
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                View Invoice
              </button>

              {/* Cancel Booking */}
              <button
                onClick={() => cancelBooking(b.ref)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel Booking
              </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}