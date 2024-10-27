import { NextRequest, NextResponse } from "next/server";
import DatabaseManager from "@/db";
import { MongoClient } from "mongodb";

export const dynamic = 'force-dynamic';

// MongoDB connection URI
const uri = process.env.MONGODB_URI || "";

// Function to get the MongoDB client
async function getMongoClient() {
    const client = new MongoClient(uri);
    await client.connect();
    return client;
}

export async function GET(request: NextRequest) {
    let client: MongoClient | null = null;

    try {
        client = await getMongoClient();
        const db = client.db('issue-tracking-system');
        

       

        const processArea = await db.collection("processAreas").find().toArray();

        console.log("data", processArea);
        const length = processArea.length;

        return NextResponse.json({
            success: true,
            length: length,
            message: "Data fetched successfully",
            data: processArea
        }, { status: 200 });

    } catch (error) {
        console.error("Error in Fetching Process Areas Data", error);

        return NextResponse.json({
            success: false,
            message: "Error in Fetching Process Areas Data"
        }, { status: 500 });
    }
}