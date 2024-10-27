import { NextRequest, NextResponse } from "next/server";
import DatabaseManager from "@/db";
import { toCamelCase } from "@/helper/helper";
import { ObjectId } from "mongodb";

export const dynamic = 'force-dynamic';

// Define interfaces for our document types
interface TicketForm {
    formType: string;
    title: string;
    processArea: string;
    fields: any[]; // You might want to define a more specific type for fields
}

interface FormReference {
    formName: string;
    formId: ObjectId;
}

interface ProcessArea {
    nameOfProcess: string;
    label: string;
    forms: FormReference[];
}



export async function POST(request: NextRequest) {
    const dbManager = DatabaseManager.getInstance();

    try {
        const { formType, processArea, fields } = await request.json();

        if (!formType || !processArea || !fields) {
            return NextResponse.json({
                success: false,
                message: "formType, processArea, and fields are required"
            }, { status: 400 });
        }

        const ticketFormsCollection = await dbManager.getCollection<TicketForm>("ticketForms");
        
        // Check if form type already exists
        const existingForm = await ticketFormsCollection.findOne({ formType: toCamelCase(formType),processArea:processArea.trim() });

        if (existingForm) {
            return NextResponse.json({
                success: false,
                message: "Form type already exists"
            }, { status: 400 });
        }

        // Create the new form data
        const formToAdd: TicketForm = {
            formType: toCamelCase(formType),
            title: formType,
            processArea: processArea.trim(),
            fields: fields
        };

        // Insert the new form data into the ticketForms collection
        const result = await ticketFormsCollection.insertOne(formToAdd);

        // Create the new form object for processAreas
        const newFormObject: FormReference = {
            formName: formType,
            formId: result.insertedId
        };

        const processAreasCollection = await dbManager.getCollection<ProcessArea>("processAreas");
        
        // Check if process area exists
        const existingProcessArea = await processAreasCollection.findOne({ nameOfProcess: toCamelCase(processArea) });

        if (existingProcessArea) {
            // If process area exists, add the new form to its forms array
            await processAreasCollection.updateOne(
                { nameOfProcess: toCamelCase(processArea) },
                { $push: { forms: newFormObject } }
            );
        } else {
            // If process area doesn't exist, create it with the new form
            const newProcessArea: ProcessArea = {
                nameOfProcess: toCamelCase(processArea),
                label: processArea.trim(),
                forms: [newFormObject]
            };
            await processAreasCollection.insertOne(newProcessArea);
        }

        return NextResponse.json({
            success: true,
            message: "Form added successfully",
            data: result
        }, { status: 201 });

    } catch (error) {
        console.error("Error in creating form", error);

        return NextResponse.json({
            success: false,
            message: "Error in creating form"
        }, { status: 500 });
    }
}