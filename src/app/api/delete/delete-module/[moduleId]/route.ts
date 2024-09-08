import { db } from "@/lib/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// The handler for the DELETE request
export async function DELETE(req: NextRequest, { params }: { params: { moduleId: string } }) {
    try {
        const { moduleId } = params;
        if (!moduleId) {
            return NextResponse.json({ error: "Module ID is required" }, { status: 400 });
        }
        const moduleRef = doc(db, "course-module", moduleId);
        await deleteDoc(moduleRef);

        return NextResponse.json({ message: "Module deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting content:", error);
        return NextResponse.json({ error: "Failed to delete Module" }, { status: 500 });
    }
}
