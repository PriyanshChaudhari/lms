import React from "react";

interface Category {
    id: string;
    category_name: string;
    parent_category_id: string | null;
}

interface Props {
    categories: Category[];
    currentCategoryId: string;
}

const ParentCategoryDisplay: React.FC<Props> = ({ categories, currentCategoryId }) => {
    // Function to fetch the parent hierarchy recursively
    const getParentHierarchy = (categoryId: string): Category[] => {
        const result: Category[] = [];
        let currentCategory = categories.find((cat) => cat.id === categoryId);

        while (currentCategory) {
            result.unshift(currentCategory); // Add to the beginning to maintain hierarchy
            currentCategory = categories.find((cat) => cat.id === currentCategory?.parent_category_id);
        }

        return result;
    };

    const parentHierarchy = getParentHierarchy(currentCategoryId);

    return (
        <div className="flex flex-wrap gap-4 mt-4">
            {parentHierarchy.map((parent, index) => (
                <div
                    key={parent.id}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg shadow-md"
                >
                    <span className="font-semibold">
                        {index === parentHierarchy.length - 1 ? "Current: " : ""}
                    </span>
                    {parent.category_name}
                </div>
            ))}
        </div>
    );
};

export default ParentCategoryDisplay;
