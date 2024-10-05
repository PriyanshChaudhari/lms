import { db } from "@/lib/firebaseConfig"; // Firestore instance
import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { groupId: string } }) {
    try {
        const { groupId } = params;
        if (!groupId) {
            return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
        }

        const groupRef = doc(db, "groups", groupId);
        const groupDoc = await getDoc(groupRef);

        if (!groupDoc.exists()) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }

        const groupData = groupDoc.data();
        return NextResponse.json({ group: groupData }, { status: 200 });

    } catch (error) {
        console.error("Error fetching Group:", error);
        return NextResponse.json({ error: "Failed to fetch Group" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { groupId: string } }) {
    try {
        const { groupId } = params
        const { group_name } = await req.json();
        if (!group_name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const groupRef = doc(db, "groups", groupId);

        const groupQuery = query(collection(db, 'groups'), where('group_name', '==', group_name));
        const groupSnapshot = await getDocs(groupQuery);

        if (!groupSnapshot.empty) {
            // Group with the same name already exists
            return NextResponse.json({ success: false, message: 'Group name already exists' }, { status: 400 });
        }
        // Prepare the data to update
        const updatedGroup = {
            group_name : group_name.toUppercase(),
            updated_at: new Date(),
        };

        await updateDoc(groupRef, updatedGroup);
        return NextResponse.json({ success:true,message: "Group updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating Group:", error);
        return NextResponse.json({ error: "Failed to update Group" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { groupId: string } }) {
    try {
        const { groupId } = params;

        if (!groupId) {
            return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
        }

        // Reference to the document in Firestore
        const groupRef = doc(db, "groups", groupId);

        // Delete the document
        await deleteDoc(groupRef);

        return NextResponse.json({ message: "group deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting group:", error);
        return NextResponse.json({ error: "Failed to delete group" }, { status: 500 });
    }
}