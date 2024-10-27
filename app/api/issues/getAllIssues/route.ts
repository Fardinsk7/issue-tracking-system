import { NextRequest, NextResponse } from "next/server";
import DatabaseManager from "@/db";


export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
    const dbManager = DatabaseManager.getInstance();

    try {
        const collection = await dbManager.getCollection<any>("tickets");

        const issueData = await collection.find({}).toArray();

        // Log the fetched data
        console.log("data", issueData);
        const leng = issueData.length;
        // Return the fetched data
        return NextResponse.json({
            success: true,
            len: leng,
            messages: "Data fetched successfully",
            data: issueData
        }, { status: 200 });

    } catch (error) {
        console.error("Error in Getting Issue Data", error);

        // Handle errors
        return NextResponse.json({
            success: false,
            message: "Error in Getting Issue Data"
        }, { status: 500 });

    } finally {

    }
}
