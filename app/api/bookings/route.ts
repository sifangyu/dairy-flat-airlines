import { connectDB } from "@/lib/mongodb";
import { NextRequest } from "next/server";

// Aircraft capacities
const CAPACITY: Record<string, number> = {

  // Sydney prestige service
  YSSY: 6,

  // Rotorua shuttle
  NZRO: 4,

  // Great Barrier
  NZGB: 4,

  // Chatham Islands
  NZCI: 5,

  // Lake Tekapo
  NZTL: 5,
};

// GET BOOKINGS
export async function GET(
  req: NextRequest
) {

  const email =
    new URL(req.url)
      .searchParams
      .get("email");

  if (!email) {
    return Response.json([]);
  }

  const db = await connectDB();

  const bookings = await db
    .collection("bookings")
    .find({ email })
    .sort({ createdAt: -1 })
    .toArray();

  return Response.json(bookings);
}

// CREATE BOOKING
export async function POST(
  req: Request
) {

  try {

    const data =
      await req.json();

    const db =
      await connectDB();

    // Count existing bookings
    const count = await db
      .collection("bookings")
      .countDocuments({

        flightNo:
          data.flightNo,

        depUtc:
          data.depUtc,
      });

    // Capacity by aircraft route
    const maxSeats =
      CAPACITY[
        data.destination
      ] || 4;

    // Prevent overbooking
    if (count >= maxSeats) {

      return Response.json(
        {
          error:
            `Flight full (${maxSeats} seats)`
        },
        {
          status: 400
        }
      );
    }

    // Unique booking reference
    const ref =
      "DF-" +
      Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase();

    const booking = {

      _id: ref,

      // Flight
      flightNo:
        data.flightNo,

      origin:
        data.origin,

      destination:
        data.destination,

      depUtc:
        data.depUtc,

      arrUtc:
        data.arrUtc,

      price:
        data.price,

      // Passenger
      firstName:
        data.firstName,

      lastName:
        data.lastName,

      name:
        data.name,

      gender:
        data.gender,

      email:
        data.email,

      // Booking
      ref,

      createdAt:
        new Date(),
    };

    await db
      .collection("bookings")
      .insertOne(booking);

    return Response.json({

      success: true,

      ref,
    });

  } catch (e) {

    console.error(e);

    return Response.json(
      {
        error:
          "Failed"
      },
      {
        status: 500
      }
    );
  }
}

// CANCEL BOOKING
export async function DELETE(
  req: Request
) {

  try {

    const { ref } =
      await req.json();

    const db =
      await connectDB();

    await db
      .collection("bookings")
      .deleteOne({
        _id: ref,
      });

    return Response.json({
      success: true,
    });

  } catch (e) {

    console.error(e);

    return Response.json(
      {
        error:
          "Failed"
      },
      {
        status: 500
      }
    );
  }
}