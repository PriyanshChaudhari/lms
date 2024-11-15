import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const date = req.nextUrl.searchParams.get('date');

        if (!date) {
            return NextResponse.json({ error: 'date is required' }, { status: 400 });
        }

        const eventsCollectionRef = collection(db, 'calendar_events');
        const q = query(eventsCollectionRef, where('date', '==', new Date(date)));
        const eventsSnapshot = await getDocs(q);
        const eventsList = eventsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log(eventsList[0]);

        // Return the list of events as JSON
        return NextResponse.json(eventsList);
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}