import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseConfig"
import { addDoc, collection } from "firebase/firestore";

export async function POST(req: NextRequest) {
    try {
        const { group_name } = await req.json();
        console.log(group_name)

        if (!group_name) {
            return NextResponse.json({ success: false, message: 'Group name is required' }, { status: 400 });
        }

        const groupRef = await addDoc(collection(db, 'groups'), {
            group_name,
            created_at: new Date(),
        });

        return NextResponse.json({ success: true, message: 'Group created successfully'});

    } catch (error) {
        console.error('Error in POST /api/groups/create-group:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
