import { db } from "@/lib/firebaseConfig"; // Firestore instance
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where, writeBatch } from "firebase/firestore";
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
            group_name: group_name.toUppercase(),
            updated_at: new Date(),
        };

        await updateDoc(groupRef, updatedGroup);
        return NextResponse.json({ success: true, message: "Group updated successfully" }, { status: 200 });
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

        const groupRef = doc(db, "groups", groupId);

        const collectionsToCascade = [
            { name: 'group_members', field: 'group_id' }
        ];

        for (const collectionInfo of collectionsToCascade) {
            await deleteRelatedDocuments(collectionInfo.name, collectionInfo.field, groupId);
        }

        // Delete the document
        await deleteDoc(groupRef);

        await logAuditAction(groupId)

        return NextResponse.json({ message: "group deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting group:", error);
        return NextResponse.json({ error: "Failed to delete group" }, { status: 500 });
    }
}

// Helper function to cascade delete related documents
async function deleteRelatedDocuments(collectionName: string, field: string, groupId: string) {
    const batch = writeBatch(db);
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where(field, '==', groupId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((docSnap) => {
        batch.delete(docSnap.ref);
    });

    if (!querySnapshot.empty) {
        await batch.commit();
        console.log(`Deleted documents from ${collectionName} for groupId ${groupId}.`);
    }
}

async function logAuditAction(groupId: string) {
    const auditLogRef = collection(db, "auditLogs"); // Assuming 'audit_logs' is the Firestore collection name
    await addDoc(auditLogRef, {
        action: "DELETE_GROUP",
        groupId,
        timestamp: new Date().toISOString(),
        reason: "Group deleted by admin",
    });
    console.log(`Audit log created for groupId ${groupId}.`);
}