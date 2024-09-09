import { db } from "@/lib/firebaseConfig";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { title, description, teacher_id, category } = await req.json();
        
        // Fetch all thumbnails from the thumbnails collection
        const thumbnailsSnapshot = await getDocs(collection(db, 'thumbnails'));
        const thumbnails = thumbnailsSnapshot.docs.map(doc => doc.data());

        if (thumbnails.length === 0) {
            return NextResponse.json({ error: 'No thumbnails available' }, { status: 404 });
        }

        // Select a random thumbnail from the thumbnails collection
        const randomThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)].url;
        console.log('Random thumbnail:', randomThumbnail);
        
        // Create the course with the random thumbnail
        const docRef = await addDoc(collection(db, 'courses'), {
            title,
            description,
            thumbnail: randomThumbnail, // Use the random thumbnail URL here
            teacher_id,
            category,
            created_at: new Date(),
        });

        return NextResponse.json({ message: 'Course added' }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
    }
}
