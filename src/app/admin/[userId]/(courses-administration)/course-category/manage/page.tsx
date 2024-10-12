"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

interface Category {
    id: string;
    category_name: string;
    parent_category_id: string | null;
}

interface Course {
    id: string;
    title: string;
    category_id: string;
}

const ManageCategories = () => {
    const params = useParams();
    const userId = params.userId as string;
    const [categories, setCategories] = useState<Category[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchCourses(selectedCategory);
        }
    }, [selectedCategory]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/get/categories');
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchCourses = async (categoryId: string) => {
        try {
            const res = await axios.get(`/api/get/courses/categoryId?categoryId=${categoryId}`);
            setCourses(res.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(categoryId);
    };

    // Open the edit modal
    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsEditModalOpen(true);
    };

    // Open the delete modal
    const handleDelete = (categoryId: string) => {
        setDeletingCategoryId(categoryId);
        setIsDeleteModalOpen(true);
    };

    // Handle edit form input change
    const handleEditInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (editingCategory) {
            setEditingCategory({
                ...editingCategory,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;

        try {
            await axios.put("/api/course-category", {
                id: editingCategory.id,
                category_name: editingCategory.category_name,
                parent_category_id: editingCategory.parent_category_id || null
            });
            alert("Category has been modified successfully.");
            setIsEditModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    const handleDeleteSubmit = async () => {
        if (!deletingCategoryId) return;

        try {
            await axios.delete(`/api/course-category?categoryId=${deletingCategoryId}`);
            alert("Category has been deleted successfully.");
            setIsDeleteModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const renderCategoryTree = (parentId: string | null = null, level: number = 0) => {
        const filteredCategories = categories.filter(cat => cat.parent_category_id === parentId);

        return (
            <ul className={`space-y-2 ${level > 0 ? 'ml-4' : ''}`}>
                {filteredCategories.map(category => (
                    <li key={category.id} className='space-y-2'>
                        <div className="flex items-center justify-between p-2 border rounded">
                            <span 
                                className="cursor-pointer hover:text-blue-600"
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                {category.category_name}
                            </span>
                            <div>
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="mr-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        {renderCategoryTree(category.id, level + 1)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Manage Categories and Courses</h1>
            <div className="flex">
                <div className="w-1/2 pr-4">
                    <h2 className="text-xl font-semibold mb-2">Categories</h2>
                    {renderCategoryTree()}
                </div>
                <div className="w-1/2 pl-4">
                    <h2 className="text-xl font-semibold mb-2">Courses</h2>
                    {selectedCategory ? (
                                                <ul className="space-y-2">
                            {courses.length > 0 ? (
                                courses.map(course => (
                                    <li key={course.id} className="p-2 border rounded">
                                        {course.title}
                                    </li>
                                ))
                            ) : (
                                <li className="p-2 border rounded">
                                    This category has no courses.
                                </li>
                            )}
                        </ul>
                    ) : (
                        <p>Select a category to view courses</p>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && editingCategory && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label htmlFor="category_name" className="block text-sm font-medium text-gray-700">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    id="category_name"
                                    name="category_name"
                                    value={editingCategory.category_name}
                                    onChange={handleEditInputChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="parent_category_id" className="block text-sm font-medium text-gray-700">
                                    Parent Category
                                </label>
                                <select
                                    id="parent_category_id"
                                    name="parent_category_id"
                                    value={editingCategory.parent_category_id || ""}
                                    onChange={handleEditInputChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                                >
                                    <option value="">No Parent (Top-Level Category)</option>
                                    {categories.filter(cat => cat.id !== editingCategory.id).map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && deletingCategoryId && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this category?</p>
                        <div className="flex justify-end mt-4">
                            <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                                Cancel
                            </button>
                            <button onClick={handleDeleteSubmit} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCategories;