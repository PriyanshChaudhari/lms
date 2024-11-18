import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseConfig";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";

export async function POST(req: NextRequest) {
    try {
        const group_name = (await req.json()).group_name.toString().toUpperCase();
        console.log(group_name);

        if (!group_name) {
            return NextResponse.json({ success: false, message: 'Group name is required' }, { status: 400 });
        }
        // Query to check if the group already exists
        const groupQuery = query(collection(db, 'groups'), where('group_name', '==', group_name));
        const groupSnapshot = await getDocs(groupQuery);

        if (!groupSnapshot.empty) {
            // Group with the same name already exists
            return NextResponse.json({ success: false, message: 'Group name already exists' }, { status: 400 });
        }

        // If no group with the same name exists, create a new group
        const groupRef = await addDoc(collection(db, 'groups'), {
            group_name,
            created_at: new Date(),
        });

        return NextResponse.json({ success: true, message: 'Group created successfully', groupId: groupRef.id });

    } catch (error) {
        console.error('Error in POST /api/groups/create-group:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
