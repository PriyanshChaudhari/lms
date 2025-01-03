"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import CreateCategory from '../create/page';
import ParentCategoryDisplay from './ParentCategoryDisplay';

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
    const [loading, setLoading] = useState<boolean>(true);
    const [courseLoading, setCourseLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

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
            setCategories(res.data.categories);
            setLoading(false)
            console.log(categories)

        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchCourses = async (categoryId: string) => {
        try {
            const res = await axios.get(`/api/get/courses/categoryId?categoryId=${categoryId}`);
            setCourses(res.data);
            setCourseLoading(false)
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

        if (editingCategory.category_name.trim() === "") {
            setError("Please Enter Valid Category.")
            return;
        }

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

    const getParentHierarchy = (parentId: string | null): Category[] => {
        const hierarchy: Category[] = [];
        let currentCategory = categories.find((cat) => cat.id === parentId);

        while (currentCategory) {
            hierarchy.unshift(currentCategory); // Add parent to the beginning of the list
            currentCategory = categories.find((cat) => cat.id === currentCategory?.parent_category_id);
        }

        return hierarchy;
    };


    const handleDeleteSubmit = async () => {
        if (!deletingCategoryId) return;

        try {
            console.log((deletingCategoryId))
            await axios.delete(`/api/course-category?categoryId=${deletingCategoryId}`);

            alert("Category has been deleted successfully.");
            setIsDeleteModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const renderCategoryTree = (parentId: string | null = null, level: number = 0) => {

        const toggleExpand = (categoryId: string) => {
            setExpandedCategories(prevState => ({
                ...prevState,
                [categoryId]: !prevState[categoryId],
            }));
        };

        const filteredCategories = categories.filter(cat => cat.parent_category_id === parentId);

        const filteredCategory = searchTerm === ''
            ? filteredCategories
            : filteredCategories.filter(
                (item) =>
                    item.category_name.toLowerCase().includes(searchTerm.toLowerCase())
            );

        return (
            <ul className={`space-y-2 ${level > 0 ? 'ml-4' : ''}`}>
                {filteredCategory.map(category => (
                    <li key={category.id} className="space-y-2">
                        <div
                            className={`flex items-center justify-between p-2 bg-gray-50 border rounded-lg ${selectedCategory === category.id
                                ? 'bg-gray-100 text-blue-500 font-semibold'
                                : ''
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                {/* Toggle Icon */}
                                {categories.some(cat => cat.parent_category_id === category.id) && (
                                    <button
                                        onClick={() => toggleExpand(category.id)}
                                        className="focus:outline-none"
                                    >
                                        {expandedCategories[category.id] ? (
                                            <FaChevronDown className="text-gray-600" />
                                        ) : (
                                            <FaChevronRight className="text-gray-600" />
                                        )}
                                    </button>
                                )}
                                <span
                                    className="cursor-pointer hover:text-blue-600"
                                    onClick={() => handleCategoryClick(category.id)}
                                >
                                    {category.category_name}
                                </span>
                                {/* <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Parent:{" "}
                                    {category.parent_category_id
                                        ? categories.find((cat) => cat.id === category.parent_category_id)
                                            ?.category_name || "Unknown"
                                        : "None"}
                                </p> */}

                            </div>
                            <div className="flex">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="mr-2 py-2 bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1 px-3  transition-all duration-200 ease-in-out transform focus:outline-none"
                                >
                                    Edit
                                    <MdModeEdit className="text-white text-lg" />
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="mr-2 py-2 bg-red-500 hover:bg-red-600 text-white flex items-center gap-1 px-3  transition-all duration-200 ease-in-out transform focus:outline-none"
                                >
                                    Delete
                                    <MdDeleteForever className="text-white text-lg" />
                                </button>
                            </div>
                        </div>
                        {/* Render children if expanded */}
                        {expandedCategories[category.id] && renderCategoryTree(category.id, level + 1)}
                    </li >
                ))}
            </ul >
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl text-black dark:text-gray-300 font-semibold mb-4">Manage Categories and Courses</h1>
            <div className="flex">
                <div className="w-1/2 pr-4">
                    <h2 className="text-xl font-semibold mb-2">Categories</h2>
                    <input
                        type="text"
                        placeholder="Search Category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full mb-6 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#151b23]"
                    />
                    {loading ? (<div>Loading...</div>) : (renderCategoryTree())}
                </div>

                <div className="w-1/2 pl-4">
                    <h2 className="text-xl font-semibold mb-2">Courses</h2>
                    {selectedCategory ? (
                        <ul className="space-y-2">
                            {courseLoading ? (<div>Loading..</div>) : (courses.length > 0 ? (
                                courses.map(course => (
                                    <li key={course.id} className="p-2 border rounded-lg">
                                        {course.title}
                                    </li>
                                ))
                            ) : (
                                <li className="p-2 border rounded-lg">
                                    This category has no courses.
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Select a category to view courses</p>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {/* {isEditModalOpen && editingCategory && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Edit Category</h2>

                        <form onSubmit={handleEditSubmit}>
                            {error && (
                                <div className="mb-4 text-red-500 font-semibold text-left">
                                    {error}
                                </div>
                            )}
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
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
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
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                                >
                                    <option value="">No Parent (Top-Level Category)</option>
                                    {categories.filter(cat => cat.id !== editingCategory.id).map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.category_name}
                                        </option>
                                    ))}

                                </select>
                                {currentCategoryId && (
                                    <ParentCategoryDisplay
                                        categories={categories}
                                        currentCategoryId={currentCategoryId}
                                    />
                                )}
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                    {/* <CreateCategory editingCategory={editingCategory} /> */}
            {/* </div>
            )}  */}

            {isEditModalOpen && editingCategory && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
                        <h2 className="text-2xl font-bold mb-4">Edit Category</h2>

                        <form onSubmit={handleEditSubmit}>
                            {error && (
                                <div className="mb-4 text-red-500 font-semibold text-left">
                                    {error}
                                </div>
                            )}
                            {/* Category Name Field */}
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
                                    className="mt-1 p-2 w-full uppercase border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            {/* Parent Category Dropdown */}
                            <div className="mb-4">
                                <label htmlFor="parent_category_id" className="block text-sm font-medium text-gray-700">
                                    Parent Category
                                </label>
                                <select
                                    id="parent_category_id"
                                    name="parent_category_id"
                                    value={editingCategory.parent_category_id || ""}
                                    onChange={handleEditInputChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                                >
                                    <option value="">No Parent (Top-Level Category)</option>
                                    {categories
                                        .filter((cat) => cat.id !== editingCategory.id) // Exclude current category to avoid circular reference
                                        .map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                <span>{cat.category_name}</span>
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Parent Category Hierarchy Display */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Parent Hierarchy
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {getParentHierarchy(editingCategory.parent_category_id).map((parent, index) => (
                                        <div
                                            key={parent.id}
                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg shadow-md"
                                        >
                                            {parent.category_name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
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
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this category?</p>
                        <div className="flex justify-end mt-4">
                            <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                                Cancel
                            </button>
                            <button onClick={handleDeleteSubmit} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
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