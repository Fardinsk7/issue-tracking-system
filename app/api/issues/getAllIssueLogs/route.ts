import { NextRequest, NextResponse } from "next/server";
import DatabaseManager from "@/db";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const dbManager = DatabaseManager.getInstance();

    try {
        const collection = await dbManager.getCollection<any>("activityLogs");
        
        const { issueId } = await request.json();

        if (!issueId) {
            return NextResponse.json({
                success: false,
                message: "updaterId is required"
            }, { status: 400 });
        }

        const issueLogData = await collection.find({ issueId: issueId }).toArray();

        console.log("data", issueLogData);
        const length = issueLogData.length;

        return NextResponse.json({
            success: true,
            length: length,
            message: "Data fetched successfully",
            data: issueLogData
        }, { status: 200 });

    } catch (error) {
        console.error("Error in Getting Activity Logs Data", error);

        return NextResponse.json({
            success: false,
            message: "Error in Getting Activity Logs Data"
        }, { status: 500 });
    }
}