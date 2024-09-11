"use client"
import React, { ChangeEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CreateCategory = () => {
    const router = useRouter();

    const [category, setCategory] = useState({
        category_name: "",
        parent_category_id: ""
    });

    const [categories, setCategories] = useState<{ id: string; category_name: string; parent_category_id: string | null }[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/get/categories');
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleClick = () =>{
    //   router.push('/admin/dashboard');
    }

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

        try {
            const res = await axios.post('/api/course-category/', category);
            const data = res.data;
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
            alert("Category created successfully!");
            router.push('/admin/dashboard');
        } catch (error) {
            console.error(error);
            // Optionally, show an error message
            alert("Failed to create category. Please try again.");
        }
    };

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
                        className=" p-2 w-full border border-gray-300 rounded dark:bg-gray-800 mt-4"
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
            <div className="w-full max-w-md mx-auto mt-8 p-6 dark:bg-gray-800 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Create a New Category</h2>
            <form onSubmit={handleSubmit}>
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
                        className=" p-2 w-full border border-gray-300 rounded dark:bg-gray-800 mt-4"
                        required
                    />
                </div>

                {renderCategoryDropdowns()}

                <div>
                    <button
                        type="submit"
                        onClick={handleClick}
                        className="w-full bg-blue-600 text-white py-2 px-4 mt-4 rounded hover:bg-blue-700"
                    >
                        Create Category
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default CreateCategory;