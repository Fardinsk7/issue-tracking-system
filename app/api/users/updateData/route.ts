import { NextRequest, NextResponse } from "next/server";
import DatabaseManager from "@/db";
import { ObjectId } from "mongodb";


export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
    const dbManager = DatabaseManager.getInstance();

    try {
        const collection = await dbManager.getCollection<any>("user");
        const {id,fieldToUpdate,newData} = await request.json()
        if(!id || !fieldToUpdate || !newData){
            return NextResponse.json({
                success:false,
                message:"All fields require"
            },{status:404})
        }

        const objId = ObjectId.createFromHexString(id)
        const updateUserData= await collection.findOneAndUpdate(
            {_id:objId},
            {$set:{[fieldToUpdate]:newData}}
        )

        if(updateUserData){
            return NextResponse.json({
                success: true,
                messages: "Users Data Updated successfully",
            }, { status: 200 });
        }

        return NextResponse.json({
            success:false,
            message:"User Not Found"
        },{status:404})

        

    } catch (error) {
        console.error("Error in Updating Users Data", error);

        // Handle errors
        return NextResponse.json({
            success: false,
            message: "Error in Updating Users Data"
        }, { status: 500 });

    } finally {

    }
}
