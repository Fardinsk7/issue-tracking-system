// import { MongoClient, ObjectId } from "mongodb";

import { NextResponse, NextRequest } from "next/server";

import { decodeToken } from "@/lib/decode-token";

export async function GET(req: NextRequest) {
  // let mongoClient;

  try {
    const decoded = await decodeToken(req);

    if (decoded === false) {
      return NextResponse.redirect(`${process.env.SERVER_URL}/auth`);
    }

    // mongoClient = new MongoClient(process.env.MONGODB_URI as string);
    // await mongoClient.connect();

    // const userCollection = mongoClient
    //   .db(process.env.DB_NAME)
    //   .collection("user");

    // const user = await userCollection.findOne({
    //   _id: new ObjectId(decoded._id as string),
    // });

    // if (user) {
    //   return NextResponse.json({ user }, { status: 200 });
    // } else {
    //   return NextResponse.json({ error: "no user found" }, { status: 404 });
    // }
  } catch (err) {
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
