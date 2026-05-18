"use client";

import { useState, useEffect } from "react";

import Navbar from "@/app/components/Navbar";

import dynamic from "next/dynamic";
import { AIRPORT_NAMES } from "@/lib/airports";

const Map = dynamic(
  () => import("@/app/components/Map"),
  { ssr: false }
);

export default function Home() {

  const [from, setFrom] =
    useState("NZNE");

  const [to, setTo] =
    useState("YSSY");

  // Ensure destination is valid for selected origin
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

  // If origin changes and current destination is invalid, reset destination
  useEffect(() => {

    const valid =
      validDestinations(from);

    if (!valid.includes(to)) {
      setTo(valid[0]);
    }

  }, [from]);

  return (
    <div className="font-sans bg-gray-50 text-gray-900 antialiased min-h-screen">

      <Navbar />

      <main className="pt-16">

        {/* HERO */}
        <section
          className="relative h-[72vh] min-h-[600px] bg-cover bg-center"
          style={{
            backgroundImage:
              `url('https://picsum.photos/id/1018/1920/1080')`,
          }}
        >

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">

            <div className="max-w-2xl">

              <div className="inline-block px-4 py-1 bg-blue-600/90 text-white rounded-full text-sm mb-5 shadow">
                Premium Regional Airline
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-xl">

                Explore
                <br />

                New Zealand
                <br />

                From The Sky
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-xl">

                Discover seamless travel across New Zealand,
                Australia and the Pacific with Dairy Flat Airlines.
              </p>

              <a
                href="/flights"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-semibold shadow-xl transition hover:scale-105"
              >
                Search Flights
              </a>
            </div>
          </div>

          {/* Bottom Wave */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg
              viewBox="0 0 1440 120"
              className="w-full h-auto"
            >
              <path
                fill="#f9fafb"
                d="M0,96L48,85.3C96,75,192,53,288,48C384,43,480,53,576,69.3C672,85,768,107,864,101.3C960,96,1056,64,1152,53.3C1248,43,1344,53,1392,58.7L1440,64L1440,120L0,120Z"
              />
            </svg>
          </div>
        </section>

        {/* ROUTE EXPLORER */}
        <section className="max-w-7xl mx-auto px-6 py-20">

          <div className="text-center mb-12">

            <h2 className="text-4xl font-bold text-blue-700 mb-4">
              Interactive Route Explorer
            </h2>

            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Select an origin and destination to instantly
              visualize the airline route network.
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10 border border-gray-100">

            <div className="grid md:grid-cols-2 gap-6">

              {/* FROM */}
              <div>

                <label className="block text-sm font-semibold text-gray-500 mb-2">
                  Origin Airport
                </label>

                <select
                  value={from}
                  onChange={(e) =>
                    setFrom(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-2xl p-4 text-lg focus:outline-none focus:border-blue-500 transition shadow-sm"
                >

                  <option value="NZNE">
                    Dairy Flat (NZNE)
                  </option>

                  <option value="YSSY">
                    Sydney (YSSY)
                  </option>

                  <option value="NZRO">
                    Rotorua (NZRO)
                  </option>

                  <option value="NZGB">
                    Great Barrier (NZGB)
                  </option>

                  <option value="NZCI">
                    Chatham Islands (NZCI)
                  </option>

                  <option value="NZTL">
                    Lake Tekapo (NZTL)
                  </option>

                </select>
              </div>

              {/* TO */}
              <div>

                <label className="block text-sm font-semibold text-gray-500 mb-2">
                  Destination Airport
                </label>

                <select
                  value={to}
                  onChange={(e) =>
                    setTo(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-2xl p-4 text-lg focus:outline-none focus:border-blue-500 transition shadow-sm"
                >

                  {validDestinations(from).map((d) => (

                    <option
                      key={d}
                      value={d}
                    >
                      {AIRPORT_NAMES[d]}
                    </option>

                  ))}

                </select>
              </div>
            </div>
          </div>

          {/* MAP */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">

            <Map
              from={from}
              to={to}
            />

          </div>
        </section>
      </main>
    </div>
  );
}