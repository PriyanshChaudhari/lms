// pages/contact.tsx
"use client"
import React, { useRef, useState } from "react";

const Contact = () => {
	const formRef = useRef<HTMLFormElement>(null);
	const [form, setForm] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;

		setForm({
			...form,
			[name]: value,
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const username = form.name.trim();
		const user_email = form.email.trim();
		const user_message = form.message.trim();

		if (username === '' || user_email === '' || user_message === '') {
			setLoading(false);
			alert("Please fill all the fields.");
			return;
		}

	};

	return (
		<div className=' bg-white dark:dark:bg-[#212830] '>   
			<div className='text-black contact overflow-x-hidden pt-14  py-7' id='contact'>
				<div className='z-10 w-full sm:w-[650px] m-auto p-8 rounded-lg-2xl'>
					<p className='font-light dark:text-gray-100'>REACH OUT TO US</p>
					<h2 className='text-5xl font-extrabold mt-2 bg-clip-text text-transparent bg-gradient-to-r dark:bg-[#212830]'>Contact.</h2>
					<form
						ref={formRef}
						onSubmit={handleSubmit}
						className='mt-12 flex flex-col gap-8'
					>
						<label className='flex flex-col'>
							<span className='font-medium mb-4 dark:text-gray-100'>Your Name</span>
							<input
								type='text'
								name='name'
								value={form.name}
								onChange={handleChange}
								placeholder="Enter your name"
								className='py-4 px-6 rounded-lg-lg font-medium bg-[#f3f4f6]'
								required
							/>
						</label>
						<label className='flex flex-col'>
							<span className='font-medium mb-4 dark:text-gray-100'>Your email</span>
							<input
								type='email'
								name='email'
								value={form.email}
								onChange={handleChange}
								placeholder="Ex:abc@gmail.com"
								className='py-4 px-6 rounded-lg-lg font-medium bg-[#f3f4f6]'
								required
							/>
						</label>
						<label className='flex flex-col'>
							<span className='font-medium mb-4 dark:text-gray-100'>Your Message</span>
							<textarea
								rows={7}
								name='message'
								value={form.message}
								onChange={handleChange}
								placeholder='Do you have anything to say?'
								className='py-4 px-6 rounded-lg-lg font-medium bg-[#f3f4f6]'
								required
							/>
						</label>

						<button
							type='submit'
							className='pt-3 px-8 w-fit font-bold dark:text-black dark:bg-[#212830] hover:dark:bg-white text-white p-3 rounded-lg-xl hover:bg-[#1a1a1a]'
						>
							{loading ? "Sending..." : "Send"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Contact;
