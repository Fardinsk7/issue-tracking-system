import { NextRequest, NextResponse } from "next/server";
import DatabaseManager from "@/db";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const dbManager = DatabaseManager.getInstance();

    try {
        const issueData = await request.json();

        const ticketsCollection = await dbManager.getCollection<any>("tickets");

        // Insert the new issue data into the tickets collection
        const result = await ticketsCollection.insertOne(issueData);

        return NextResponse.json({
            success: true,
            message: "Issue added successfully",
            data: result
        }, { status: 201 });

    } catch (error) {
        console.error("Error in creating issue", error);

        return NextResponse.json({
            success: false,
            message: "Error in creating issue"
        }, { status: 500 });
    }
}