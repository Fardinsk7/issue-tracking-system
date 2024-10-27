import { NextRequest, NextResponse } from "next/server";
import DatabaseManager from "@/db";
import { ObjectId, Collection } from "mongodb";

export const dynamic = 'force-dynamic';

interface Msg {
    _id?: ObjectId;  // Make _id optional as MongoDB will generate it
    message: string;
    senderName: string;
    senderNumber: string;
    documentUrl: string;
    createdAt: string;
}

interface Ticket {
    _id: ObjectId;
    issueTitle: string;
    assignedTo: string;
    relatedTo: string;
    issueStatus: string;
    problemStatus: string;
    chats: Msg[];
}

export async function POST(request: NextRequest) {
    const dbManager = DatabaseManager.getInstance();

    try {
        // Parse the request body
        let { id, newMessage } = await request.json();
        console.log(newMessage)
        if (!id || typeof id !== 'string') {
            return NextResponse.json({
                success: false,
                message: "Invalid or missing id in request body"
            }, { status: 400 });
        }

        if (!newMessage || typeof newMessage !== "object") {
            return NextResponse.json({
                success: false,
                message: "Invalid or missing message"
            }, { status: 400 });
        }

        console.log("Received ID:", id);

        const collection: Collection<Ticket> = await dbManager.getCollection<Ticket>("tickets");

        // Use new ObjectId() to create ObjectId from string
        const objectId = new ObjectId(id);
        console.log(objectId);

        newMessage = { ...newMessage, _id: new ObjectId() }
        // Find the document and update it in one operation
        const result = await collection.findOneAndUpdate(
            { _id: objectId },
            { $push: { chats: newMessage as Msg } },
            { returnDocument: 'after' }
        );

        if (!result) {
            return NextResponse.json({
                success: false,
                message: "Issue not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Message added successfully",
            data: result
        }, { status: 200 });

    } catch (error) {
        console.error("Error in Adding Issue Message", error);

        // Handle specific errors
        if (error instanceof Error) {
            if (error.name === 'BSONTypeError') {
                return NextResponse.json({
                    success: false,
                    message: "Invalid ID format",
                    error: error.message
                }, { status: 400 });
            }
        }

        // Handle general errors
        return NextResponse.json({
            success: false,
            message: "Error in Adding Issue Message",
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}