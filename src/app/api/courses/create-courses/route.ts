import { db } from "@/lib/firebaseConfig";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { title, description, teacher_id, category,coursePicUrl } = await req.json();
        
        if (!title || !description || !teacher_id || !category || !coursePicUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Fetch all thumbnails from the thumbnails collection
        // const thumbnailsSnapshot = await getDocs(collection(db, 'thumbnails'));
        // const thumbnails = thumbnailsSnapshot.docs.map(doc => doc.data());

        // if (thumbnails.length === 0) {
        //     return NextResponse.json({ error: 'No thumbnails available' }, { status: 404 });
        // }

        // Select a random thumbnail from the thumbnails collection
        // const randomThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)].url;
        // console.log('Random thumbnail:', randomThumbnail);
        
        // const firebaseStorageId = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
        // const defaultProfilePicUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseStorageId}/o/default-profile-pic.png?alt=media`;
        // Create the course with the random thumbnail

        const courseRef = await addDoc(collection(db, 'courses'), {
            title,
            description, // Use the random thumbnail URL here
            teacher_id,
            category,
            coursePicUrl ,
            created_at: new Date(),
        });

        // Use the created course's ID to add the teacher to the enrolled_at table
        await addDoc(collection(db, 'enrolled_at'), {
            user_id: teacher_id,
            course_id: courseRef.id, // Use the courseRef.id here for the newly created course
            enrolled_at: new Date(),
        });

        return NextResponse.json({ message: 'Course added successfully' }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
    }
}
