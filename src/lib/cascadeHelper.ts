import { app, db } from '@/lib/firebaseConfig';
import { collection, doc, deleteDoc, getDocs, query, where, addDoc, writeBatch } from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';

// Helper to delete related modules and cascade to content and assignments
export async function deleteRelatedModules(courseId: string) {
    const moduleQuery = query(collection(db, 'course-module'), where('course_id', '==', courseId));
    const moduleSnapshot = await getDocs(moduleQuery);

    for (const moduleDoc of moduleSnapshot.docs) {
        const moduleId = moduleDoc.id;

        // Log module deletion
        await logAuditAction('DELETE_MODULE', moduleId, `Deleting module in course ${courseId}`);

        // Cascade delete content and assignments within each module
        await deleteRelatedContent(moduleId);
        await deleteRelatedAssignments(moduleId);

        // Delete the module document
        await deleteDoc(moduleDoc.ref);
    }
}

async function deleteContentFile(fileUrl: string) {
    const storage = getStorage(app);
    const fileRef = ref(storage, fileUrl);
    return deleteObject(fileRef).catch((error) => {
        console.error(`Error deleting file from storage: ${error}`);
        throw new Error("Failed to delete file from storage");
    });
}

// Function to delete related files from Firebase Storage using attachments
async function deleteContentRelatedFiles(attachments: string[]) {
    for (const fileUrl of attachments) {
        await deleteContentFile(fileUrl);
    }
}

// Helper to delete related contents in a module
export async function deleteRelatedContent(moduleId: string) {
    const contentQuery = query(collection(db, 'course-content'), where('module_id', '==', moduleId));
    const contentSnapshot = await getDocs(contentQuery);

    for (const contentDoc of contentSnapshot.docs) {
        // Log content deletion
        await logAuditAction('DELETE_CONTENT', contentDoc.id, `Deleting content in module ${moduleId}`);
        const existingContent = contentDoc.data();
        const attachments = existingContent.attachments || [];

        // Delete related files in Firebase Storage using the attachments array
        await deleteContentRelatedFiles(attachments);
        await deleteDoc(contentDoc.ref);
    }
}

async function deleteAssignmentFile(fileUrl: string) {
    const storage = getStorage(app);
    const fileRef = ref(storage, fileUrl);

    return deleteObject(fileRef).catch((error) => {
        console.error(`Error deleting file from storage: ${error}`);
        throw new Error("Failed to delete file from storage");
    });
}

// Function to delete related documents from a specific collection
async function deleteAssignmentRelatedFiles(assignmentId: string) {
    const relatedCollectionRef = collection(db, "related_collection_name"); // Replace with actual collection name
    const q = query(relatedCollectionRef, where("assignment_id", "==", assignmentId));
    const relatedDocs = await getDocs(q);

    const deletePromises = relatedDocs.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
}

// Helper to delete related assignments and their submissions in a module
export async function deleteRelatedAssignments(moduleId: string) {
    const assignmentQuery = query(collection(db, 'assessments'), where('module_id', '==', moduleId));
    const assignmentSnapshot = await getDocs(assignmentQuery);

    for (const assignmentDoc of assignmentSnapshot.docs) {
        const assignmentId = assignmentDoc.id;

        const assignmentData = assignmentDoc.data();
        const attachmentUrls = assignmentData?.attachments || []; // Assuming 'attachments' is an array

        // Delete all attached files from Firebase Storage if available
        for (const fileUrl of attachmentUrls) {
            await deleteAssignmentFile(fileUrl);
        }

        // Delete related documents in other collections (if applicable)
        await deleteAssignmentRelatedFiles(assignmentId);

        // Log assignment deletion
        await logAuditAction('DELETE_ASSIGNMENT', assignmentId, `Deleting assignment in module ${moduleId}`);
        await deleteRelatedSubmissions(assignmentId);

        // Delete the assignment document
        await deleteDoc(assignmentDoc.ref);
    }
}

// Helper to delete related submissions for an assignment
export async function deleteRelatedSubmissions(assignmentId: string) {
    const submissionQuery = query(collection(db, 'submissions'), where('assignment_id', '==', assignmentId));
    const submissionSnapshot = await getDocs(submissionQuery);

    for (const submissionDoc of submissionSnapshot.docs) {
        const fileUrl = submissionDoc.data().file_url;

        // Delete the file from Firebase Storage
        if (fileUrl) {
            const storage = getStorage(app);
            const fileRef = ref(storage, fileUrl);
            await deleteObject(fileRef);
        }
        // Log submission deletion
        await logAuditAction('DELETE_SUBMISSION', submissionDoc.id, `Deleting submission for assignment ${assignmentId}`);
        await deleteDoc(submissionDoc.ref);
    }
}

// Audit logging function
export async function logAuditAction(action: string, entityId: string, reason: string) {
    try {
        const auditLogRef = collection(db, 'auditLogs');
        await addDoc(auditLogRef, {
            action,
            entityId,
            reason,
            timestamp: new Date().toISOString(),
        });
        console.log(`Audit log for ${action} on ${entityId} created.`);
    } catch (error) {
        console.error(`Failed to log audit action ${action} for ${entityId}:`, error);
    }
}
