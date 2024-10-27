import { NextRequest, NextResponse } from "next/server";
import DatabaseManager from "@/db";
import { MongoClient, ObjectId } from "mongodb";

// MongoDB connection URI
const uri = process.env.MONGODB_URI || "";

// Function to get the MongoDB client
async function getMongoClient() {
    const client = new MongoClient(uri);
    await client.connect();
    return client;
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    let client: MongoClient | null = null;

    try {
        client = await getMongoClient();
        const db = client.db('issue-tracking-system'); // Use the default database
        
        const { searchParams } = new URL(request.url);
        const formId = searchParams.get('formId');

        if (!formId) {
            return NextResponse.json({
                success: false,
                message: "formId is required"
            }, { status: 400 });
        }
        let objectId = ObjectId.createFromHexString(formId)
        const issueFormData = await db.collection("ticketForms").findOne({ _id: objectId });

        if (!issueFormData) {
            return NextResponse.json({
                success: false,
                message: "Form data not found for the given formId"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Form Data fetched successfully",
            data: issueFormData
        }, { status: 200 });

    } catch (error) {
        console.error("Error in Getting Issue Form Data", error);

        // Improved error handling
        let errorMessage = "Error in Getting Issue Form Data";
        let statusCode = 500;

        if (error instanceof Error) {
            errorMessage = error.message;
            if (error.message.includes("connection")) {
                statusCode = 503; // Service Unavailable
                errorMessage = "Database connection error. Please try again later.";
            }
        }

        return NextResponse.json({
            success: false,
            message: errorMessage
        }, { status: statusCode });
    }
}