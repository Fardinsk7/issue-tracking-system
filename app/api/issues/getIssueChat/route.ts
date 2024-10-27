import { NextRequest, NextResponse } from "next/server";
import DatabaseManager from "@/db";
import { ObjectId } from "mongodb";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const dbManager = DatabaseManager.getInstance();

    try {
        // Parse the request body
        const { id } = await request.json();

        if (!id || typeof id !== 'string') {
            return NextResponse.json({
                success: false,
                message: "Invalid or missing id in request body"
            }, { status: 400 });
        }

        console.log("Received ID:", id);

        const collection = await dbManager.getCollection<any>("tickets");
        
        // Use ObjectId.createFromHexString to create ObjectId from string
        const objectId = ObjectId.createFromHexString(id);

        const issueChatData = await collection.aggregate([
            { $match: { _id: objectId } },
            { $unwind: '$chats' },
            { $sort: { 'chats.createdAt': 1 } },
            { $group: { _id: '$_id', chats: { $push: '$chats' } } }
        ]).toArray();  // Add toArray() to get the result

        if (issueChatData.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No data found for the given id"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Data fetched successfully",
            data: issueChatData[0]  // Return the first (and should be only) result
        }, { status: 200 });

    } catch (error) {
        console.error("Error in Getting Issue Data", error);

        // Handle errors
        return NextResponse.json({
            success: false,
            message: "Error in Getting Issue Data",
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}