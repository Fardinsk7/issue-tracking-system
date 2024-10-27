import { NextRequest, NextResponse } from "next/server";
import DatabaseManager from "@/db";
import { ObjectId } from "mongodb";

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
    const dbManager = DatabaseManager.getInstance();

    try {
        // Parse the request body
        const body = await request.json();
        const { id, nameOfUpdater, newValue, fieldname, logMsg } = body;

        // Validate required fields
        if (!id || !nameOfUpdater || !newValue || !fieldname || !logMsg) {
            return NextResponse.json({
                success: false,
                message: "Missing required fields"
            }, { status: 400 });
        }

        // Get the tickets collection
        const ticketsCollection = await dbManager.getCollection<any>("tickets");

        // Update the ticket
        const objectId = ObjectId.createFromHexString(id)
        const updateResult = await ticketsCollection.updateOne(
            { _id: objectId },
            { $set: { [fieldname]: newValue } }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json({
                success: false,
                message: "Ticket not found"
            }, { status: 404 });
        }

        // Get the activityLogs collection
        const activityLogsCollection = await dbManager.getCollection<any>("activityLogs");

        // Create activity log
        const activityLog = {
            issueId: id,
            name: nameOfUpdater,
            updateMade: logMsg,
            updatedAt: new Date().toISOString()
        };

        // Insert activity log
        await activityLogsCollection.insertOne(activityLog);

        return NextResponse.json({
            success: true,
            message: "Ticket updated successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error in Updating Issue Data", error);

        return NextResponse.json({
            success: false,
            message: "Error in Updating Issue Data"
        }, { status: 500 });
    }
}