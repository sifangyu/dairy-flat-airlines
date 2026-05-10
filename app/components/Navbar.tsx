"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand name */}
        <Link href="/" className="text-2xl font-bold text-blue-700">
          Dairy Flat Airlines
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className={`text-lg font-medium ${
              pathname === "/"
                ? "text-blue-700 border-b-2 border-blue-700 pb-1"
                : "text-gray-600 hover:text-blue-700"
            }`}
          >
            Home
          </Link>
          <Link
            href="/flights"
            className={`text-lg font-medium ${
              pathname === "/flights"
                ? "text-blue-700 border-b-2 border-blue-700 pb-1"
                : "text-gray-600 hover:text-blue-700"
            }`}
          >
            Search Flights
          </Link>
          <Link
            href="/my-bookings"
            className={`text-lg font-medium ${
              pathname === "/my-bookings"
                ? "text-blue-700 border-b-2 border-blue-700 pb-1"
                : "text-gray-600 hover:text-blue-700"
            }`}
          >
            My Bookings
          </Link>
        </div>
      </div>
    </nav>
  );
}