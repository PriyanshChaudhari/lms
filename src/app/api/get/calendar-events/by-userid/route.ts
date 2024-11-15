import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const userId = req.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const eventsCollectionRef = collection(db, 'calendar_events');

        const notifiedQuery = query(eventsCollectionRef, where('notified_user_ids', 'array-contains', userId));

        const createdByQuery = query(eventsCollectionRef, where('created_by_user_id', '==', userId));

        const [notifiedSnapshot, createdBySnapshot] = await Promise.all([
            getDocs(notifiedQuery),
            getDocs(createdByQuery)
        ]);

        const eventMap = new Map();

        notifiedSnapshot.docs.forEach(doc => {
            eventMap.set(doc.id, { id: doc.id, ...doc.data() });
        });

        createdBySnapshot.docs.forEach(doc => {
            eventMap.set(doc.id, { id: doc.id, ...doc.data() });
        });

        const eventsList = Array.from(eventMap.values());

        return NextResponse.json(eventsList);
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}