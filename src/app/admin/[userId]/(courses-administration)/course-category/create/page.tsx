"use client"
import React, { ChangeEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

const CreateCategory = ({ editingCategory = null }: { editingCategory?: any }) => {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const [category, setCategory] = useState({
        category_name: "",
        parent_category_id: ""
    });

    const [error, setError] = useState<string | null>(null);
    const [showMessage, setShowMessage] = useState(false);
    const [categories, setCategories] = useState<{ id: string; category_name: string; parent_category_id: string | null }[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/get/categories');
            setCategories(res.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(false);
        }, 5000); // 5 seconds delay

        // Cleanup the timer when the component unmounts or re-renders
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        fetchCategories();

        if (editingCategory) {
            // Set initial category data for editing
            setCategory({
                category_name: editingCategory.category_name,
                parent_category_id: editingCategory.parent_category_id || "",
            });

            // Populate selectedCategories for dropdowns
            const initialSelectedCategories = [];
            let currentParentId = editingCategory.parent_category_id;

            while (currentParentId) {
                initialSelectedCategories.unshift(currentParentId);
                const parent = categories.find((cat) => cat.id === currentParentId);
                currentParentId = parent ? parent.parent_category_id : null;
            }

            setSelectedCategories(initialSelectedCategories);
        }
    }, []);

    const handleCategoryChange = (index: number, e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        const updatedSelectedCategories = [...selectedCategories.slice(0, index + 1)];
        updatedSelectedCategories[index] = value;
        setSelectedCategories(updatedSelectedCategories);

        // Update the category's parent_category_id
        setCategory({ ...category, parent_category_id: value });
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (category.category_name.trim() === "") {
            setError("Please Enter Valid Category.")
            return;
        }
        else {
            try {
                if (editingCategory) {
                    // Update existing category
                    await axios.put(`/api/course-category/${editingCategory.id}`, category);
                    alert("Category updated successfully!");
                }
                else {
                    const res = await axios.post('/api/course-category/', category);
                    const data = res.data.categories;
                    console.log(data);

                    // Reset the form
                    setCategory({
                        category_name: "",
                        parent_category_id: ""
                    });
                    setSelectedCategories([]);

                    // Fetch updated categories
                    await fetchCategories();

                    // Optionally, show a success message
                    setShowMessage(true);
                   
                }
            } catch (error) {
                console.error(error);
                // Optionally, show an error message
                alert("Failed to create category. Please try again.");
            }
        }
    };

    const closeShowMessage = () => {
        router.push(`/admin/${userId}/course-category/manage`);
        setShowMessage(false);
    }

    const renderCategoryDropdowns = () => {
        let availableCategories = categories.filter(cat => !cat.parent_category_id);
        const dropdowns = [];

        for (let i = 0; i <= selectedCategories.length; i++) {
            const parentId = i === 0 ? null : selectedCategories[i - 1];
            availableCategories = categories.filter(cat => cat.parent_category_id === parentId);

            if (availableCategories.length === 0) break;

            dropdowns.push(
                <div key={i} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">
                        {i === 0 ? "Top-Level Category" : `Subcategory Level ${i}`}
                    </label>
                    <select
                        value={selectedCategories[i] || ""}
                        onChange={(e) => handleCategoryChange(i, e)}
                        className=" p-2 w-full border border-gray-300 rounded-lg dark:bg-[#151b23] mt-4"
                    >
                        <option value="">Select Category</option>
                        {availableCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.category_name}
                            </option>
                        ))}
                    </select>
                </div>
            );
        }

        return dropdowns;
    };

    return (
        <div className='flex h-screen justify-center items-center'>
            {showMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1e2631] p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Course Created Sucessfully
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            course added sucessfully.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={closeShowMessage}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg"
                            >
                                Cancel (Closing in 5 seconds)
                            </button>

                        </div>
                    </div>
                </div>
            )}
            <div className="w-full max-w-md mx-auto mt-8 p-6 dark:bg-[#151b23] rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-black dark:text-gray-300 mb-4">{editingCategory ? "Edit Category" : "Create New Category"}</h2>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-4 text-red-500 font-semibold text-left">
                            {error}
                        </div>
                    )}
                    <div className="mb-6">
                        <label htmlFor="category_name" className="block text-sm font-medium text-gray-700 dark:text-gray-100">
                            Category Name
                        </label>
                        <input
                            type="text"
                            id="category_name"
                            name="category_name"
                            value={category.category_name}
                            onChange={handleNameChange}
                            className=" p-2 w-full border border-gray-300 rounded-lg dark:bg-[#151b23] mt-4"
                            required
                        />
                    </div>

                    {renderCategoryDropdowns()}

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 mt-4 rounded-lg hover:bg-blue-700"
                        >
                            {editingCategory ? "Update Category" : "Create Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCategory;