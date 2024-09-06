"use client";
import React, { ChangeEvent, useState, useEffect } from 'react';
import axios from 'axios';

const ModifyCategory = () => {
    const [categories, setCategories] = useState<{ id: string; category_name: string; parent_category_id: string | null }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [category, setCategory] = useState({
        category_name: "",
        parent_category_id: ""
    });

    // Fetch all categories when component mounts
    useEffect(() => {
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

    // Handle category selection
    const handleCategorySelect = (e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setSelectedCategory(value);

        // Populate the fields with the selected category details
        const selectedCat = categories.find(cat => cat.id === value);
        if (selectedCat) {
            setCategory({
                category_name: selectedCat.category_name,
                parent_category_id: selectedCat.parent_category_id || ""
            });
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!selectedCategory) {
                alert("Please select a category to modify.");
                return;
            }

            const res = await axios.put('/api/course-category/modify-category', {
                id: selectedCategory,
                category_name: category.category_name,
                parent_category_id: category.parent_category_id
            });
            const data = res.data;
            console.log(data);

            // Optionally reset the form after successful update
            setSelectedCategory("");
            setCategory({
                category_name: "",
                parent_category_id: ""
            });
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Modify Category</h2>
            <form onSubmit={handleSubmit}>
                {/* Select the category to modify */}
                <div className="mb-4">
                    <label htmlFor="selected_category" className="block text-sm font-medium text-gray-700">
                        Select Category to Modify
                    </label>
                    <select
                        id="selected_category"
                        value={selectedCategory}
                        onChange={handleCategorySelect}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.category_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Modify category name */}
                <div className="mb-4">
                    <label htmlFor="category_name" className="block text-sm font-medium text-gray-700">
                        Category Name
                    </label>
                    <input
                        type="text"
                        id="category_name"
                        name="category_name"
                        value={category.category_name}
                        onChange={handleInputChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>

                {/* Modify parent category */}
                <div className="mb-4">
                    <label htmlFor="parent_category_id" className="block text-sm font-medium text-gray-700">
                        Parent Category
                    </label>
                    <select
                        id="parent_category_id"
                        name="parent_category_id"
                        value={category.parent_category_id}
                        onChange={handleInputChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                    >
                        <option value="">No Parent (Top-Level Category)</option>
                        {categories.filter(cat => cat.id !== selectedCategory).map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.category_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Modify Category
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ModifyCategory;
