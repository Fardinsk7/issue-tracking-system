import { NextRequest, NextResponse } from "next/server";
import DatabaseManager from "@/db";


export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
    const dbManager = DatabaseManager.getInstance();

    try {
        const collection = await dbManager.getCollection<any>("processAreas");

        const processAreaDatas = await collection.find({}).toArray();

        // Log the fetched data
        console.log("data", processAreaDatas);
        const leng = processAreaDatas.length;
        // Return the fetched data
        return NextResponse.json({
            success: true,
            len: leng,
            messages: "Process Area Data fetched successfully",
            data: processAreaDatas
        }, { status: 200 });

    } catch (error) {
        console.error("Error in Getting Process Area Data", error);

        // Handle errors
        return NextResponse.json({
            success: false,
            message: "Error in Getting Process Area Data"
        }, { status: 500 });

    } finally {

    }
}
