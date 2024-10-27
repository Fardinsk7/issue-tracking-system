import { MongoClient } from "mongodb";
import { NextResponse, NextRequest } from "next/server";

import { decodeToken } from "@/lib/decode-token";

export async function GET(req: NextRequest) {
  let mongoClient;

  try {
    const decoded = await decodeToken(req);

    if (decoded === false) {
      return NextResponse.redirect(`${process.env.SERVER_URL}/auth`);
    }

    mongoClient = new MongoClient(process.env.MONGODB_URI as string);
    await mongoClient.connect();

    const vehiclesCollection = mongoClient
      .db(process.env.DB_NAME)
      .collection("vehicles");

    const counts = await vehiclesCollection
      .aggregate([
        {
          $match: {
            userId: "66cc6965d19d4d9d9822be14",
          },
        },
        {
          $match: {
            status: {
              $in: [
                "in-transit",
                "at-pickup",
                "enroute-pickup",
                "available",
                "unloading",
                "completed"
              ],
            },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const data: Record<string, number> = {
      all: 0,
    };

    counts.forEach((count) => {
      data[count._id] = count.count;

      data.all += count.count;
    });

    if (Array.isArray(counts) && counts.length > 0) {
      return NextResponse.json({ status: "success", data });
    } else {
      throw new Error();
    }
  } catch (err) {
    return NextResponse.json({
      status: "error",
      message: "internal server error",
    });
  } finally {
    mongoClient?.close();
  }
}
