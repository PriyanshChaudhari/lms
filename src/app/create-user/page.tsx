"use client";

import React, { ChangeEvent, useState } from "react";
import axios from 'axios'

const AddUser = () => {
    const [user, setUser] = useState({
        userId: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "student",
        profile_pic: "",
        dob: ""
    });

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/auth/create-user', user)
            console.log(response.data.message)
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="container bg-slate-300 min-h-screen p-10">
                <form>
                    <label htmlFor="userId">userId : </label>
                    <input
                        type="text"
                        id="userId"
                        name="userId"
                        value={user.userId}
                        onChange={handleChange}
                    />
                    <br />
                    <br />

                    <label htmlFor="firstName">First Name : </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleChange}
                    />
                    <br />
                    <br />

                    <label htmlFor="lastName">Last Name : </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleChange}
                    />
                    <br />
                    <br />

                    <label htmlFor="email">Email : </label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                    />
                    <br />
                    <br />

                    <label htmlFor="password">Password : </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                    />
                    <br />
                    <br />

                    <label htmlFor="role">Role : </label>
                    <select name="role" value={user.role} onChange={handleChange} required>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                    <br />
                    <br />

                    <label htmlFor="profile_pic">profile_pic : </label>
                    <input
                        type="text"
                        id="profile_pic"
                        name="profile_pic"
                        value={user.profile_pic}
                        onChange={handleChange}
                    />
                    <br />
                    <br />

                    <label htmlFor="dob">Dob : </label>
                    <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={user.dob}
                        onChange={handleChange}
                    />
                    <br />
                    <br />

                    <button onClick={handleSubmit} className="bg-red-500 p-2">Submit</button>
                </form>
            </div>
        </>
    );
};

export default AddUser;
