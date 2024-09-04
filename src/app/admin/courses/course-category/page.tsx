"use client";
import React, { ChangeEvent, useState, useEffect } from 'react';
import axios from 'axios';

const CreateCategory = () => {
    const [category, setCategory] = useState({
        category_name: "",
        parent_category_id: ""
    });

    const [categories, setCategories] = useState<{ id: string; category_name: string; parent_category_id: string | null }[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    useEffect(() => {
        // Fetch the list of categories when the component mounts
        const fetchCategories = async () => {
            try {
                const res = await axios.get('/api/get/categories');
                setCategories(res.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryChange = (index: number, e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        const updatedSelectedCategories = [...selectedCategories];
        updatedSelectedCategories[index] = value;
        setSelectedCategories(updatedSelectedCategories);

        // Update the category's parent_category_id if the last select is changed
        if (index === selectedCategories.length - 1) {
            setCategory({ ...category, parent_category_id: value });
        }
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post('/api/courses/create-category', category);
            const data = res.data;
            console.log(data);

            // Optionally, reset the form after successful submission
            setCategory({
                category_name: "",
                parent_category_id: ""
            });
            setSelectedCategories([]);
        } catch (error) {
            console.error(error);
        }
    };

    const renderCategoryDropdowns = () => {
        let availableCategories = categories.filter(cat => !cat.parent_category_id);

        return selectedCategories.map((selectedCategoryId, index) => {
            const nextLevelCategories = categories.filter(cat => cat.parent_category_id === selectedCategoryId);
            if (nextLevelCategories.length === 0) return null; // No more subcategories

            availableCategories = nextLevelCategories;

            return (
                <div key={index} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        {index === 0 ? "Parent Category" : "Subcategory"}
                    </label>
                    <select
                        value={selectedCategoryId}
                        onChange={(e) => handleCategoryChange(index, e)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
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
        });
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Create a New Category</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="category_name" className="block text-sm font-medium text-gray-700">
                        Category Name
                    </label>
                    <input
                        type="text"
                        id="category_name"
                        name="category_name"
                        value={category.category_name}
                        onChange={handleNameChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>



                {/* Initial top-level category dropdown */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Top-Level Category</label>
                    <select
                        value={selectedCategories[0] || ""}
                        onChange={(e) => handleCategoryChange(0, e)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.filter(cat => !cat.parent_category_id).map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.category_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Render the category dropdowns */}
                {renderCategoryDropdowns()}

                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Create Category
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCategory;
