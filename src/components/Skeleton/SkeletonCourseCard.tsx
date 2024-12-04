const SkeletonCourseCard = () => (
    <div className="bg-white dark:bg-[#151b23] rounded-lg overflow-hidden shadow-md p-6 animate-pulse">
        <div className="aspect-video bg-gray-200 dark:bg-gray-700 mb-2"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="flex gap-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
        </div>
    </div>
    
);

export default SkeletonCourseCard