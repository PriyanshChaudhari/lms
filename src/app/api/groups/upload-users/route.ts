import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import * as XLSX from 'xlsx';
import { db } from '@/lib/firebaseConfig'; // Import Firebase Firestore config
import admin from 'firebase-admin'; // Import Firebase Admin SDK

export const config = {
    api: {
        bodyParser: false, // Disable body parsing to handle multipart form data
    },
};

export async function POST(req: NextRequest) {
    return new Promise((resolve, reject) => {
        // Set up formidable form to handle file upload
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return resolve(
                    NextResponse.json({ success: false, message: 'File upload error' }, { status: 500 })
                );
            }

            try {
                // Get the uploaded file path
                const filePath = files.file.filepath;
                const groupId = fields.groupId as string; // Assuming groupId is sent in the form

                // Read and parse the Excel file using XLSX
                const workbook = XLSX.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

                // Process each row from the Excel file and add users to Firebase
                await Promise.all(
                    worksheet.map(async (row: any) => {
                        const { userId } = row; // Assuming userId is a column in the Excel file

                        // Add the user to the group in Firestore
                        const groupRef = db.collection('groups').doc(groupId);
                        const groupMemberRef = groupRef.collection('members').doc(userId);

                        await groupMemberRef.set({
                            userId: userId,
                            addedAt: admin.firestore.FieldValue.serverTimestamp(),
                        });
                    })
                );

                // Respond with success if users were added successfully
                resolve(
                    NextResponse.json({ success: true, message: 'Users added successfully' }, { status: 200 })
                );
            } catch (error) {
                console.error(error);
                resolve(
                    NextResponse.json({ success: false, message: 'Error processing file' }, { status: 500 })
                );
            }
        });
    });
}
