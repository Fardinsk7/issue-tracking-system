export const dynamic = 'force-dynamic'

import { MongoClient } from "mongodb";

import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  let mongoClient;

  try {
    mongoClient = new MongoClient(process.env.MONGODB_URI as string);
    await mongoClient.connect();

    const offset = req.nextUrl.searchParams.get("offset")
    const status = req.nextUrl.searchParams.get("status")

    const query: {
      userId: string;
      status?: string;
    } = {
      userId: "66cc6965d19d4d9d9822be14",
    };

    if (status !== "all") {
      query.status = status;
    }

    const vehiclesCollection = mongoClient
      .db(process.env.DB_NAME)
      .collection("vehicles");

    const res = await vehiclesCollection
      .aggregate([
        {
          $match: query,
        },
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            documents: [{ $skip: Number(offset) }, { $limit: 10 }],
          },
        },
      ])
      .toArray();

    if (Array.isArray(res) && res.length > 0) {
      return NextResponse.json({
        status: "success",
        data: {
          total: res[0]?.totalCount?.[0]?.count ?? 0,
          vehicles: res[0]?.documents ?? [],
        },
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
