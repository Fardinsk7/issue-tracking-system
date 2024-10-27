export const dynamic = "force-dynamic";

import { MongoClient } from "mongodb";

import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  let mongoClient;

  try {
    mongoClient = new MongoClient(process.env.MONGODB_URI as string);
    await mongoClient.connect();

    const offset = req.nextUrl.searchParams.get("offset")
    const status = req.nextUrl.searchParams.get("status");
    const vehicleNumber = req.nextUrl.searchParams.get("vehicle_number");

    const query: {
      userId: string;
      status?: string;
      vehicleNumber?: any;
    } = {
      userId: "66cc6965d19d4d9d9822be14",
      vehicleNumber: {
        $regex: vehicleNumber,
        $options: "i",
      },
    };

    if (status !== "all") {
      query.status = status;
    }

    const vehiclesCollection = mongoClient
      .db(process.env.DB_NAME)
      .collection("vehicles");

    const res = await vehiclesCollection.find(query).skip(Number(offset)).toArray();

    if (Array.isArray(res) && res.length > 0) {
      return NextResponse.json({
        status: "success",
        data: res,
      });
    } else {
      return NextResponse.json(
        { status: "failed", message: "no vehicles found" },
        { status: 404 }
      );
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { status: "error", message: "internal server error" },
      { status: 500 }
    );
  }
}
