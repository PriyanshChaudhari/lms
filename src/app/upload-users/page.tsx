"use client"

import ExcelUploader from "@/components/Upload/ExcelUploader";

const UploadUsersPage = () => {
    return (
        <div>
            <h1>Upload Excel to Firestore</h1>
            <ExcelUploader />
        </div>
    );
};

export default UploadUsersPage;