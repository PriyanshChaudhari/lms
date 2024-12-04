import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import UploadGrades from './UploadGrades';

interface UploadGradesDialogProps {
    courseId: string;
}

const UploadGradesDialog: React.FC<UploadGradesDialogProps> = ({ courseId }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors mb-8">
                    Upload Grades
                </button>
            </DialogTrigger>
            <DialogContent className="custom-dialog-content">
                <DialogTitle>Upload Grades</DialogTitle>
                <DialogDescription>
                    Select and upload the Excel file of your choice.
                </DialogDescription>
                <UploadGrades courseId={courseId} />
                <DialogClose asChild>
                    <button className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                        Close
                    </button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default UploadGradesDialog;