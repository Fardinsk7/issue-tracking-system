import { NextRequest, NextResponse } from "next/server";
import DatabaseManager from "@/db";


export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
    const dbManager = DatabaseManager.getInstance();

    try {
        const collection = await dbManager.getCollection<any>("user");

        const usersData = await collection.find({}).toArray();

        // Log the fetched data
        console.log("data", usersData);
        const leng = usersData.length;
        // Return the fetched data
        return NextResponse.json({
            success: true,
            len: leng,
            messages: "Users Data fetched successfully",
            data: usersData
        }, { status: 200 });

    } catch (error) {
        console.error("Error in Getting Users Data", error);

        // Handle errors
        return NextResponse.json({
            success: false,
            message: "Error in Getting Users Data"
        }, { status: 500 });

    } finally {

    }
}
