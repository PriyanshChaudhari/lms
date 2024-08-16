"use client"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'


const LoginPage = () => {
    const [user, setUser] = React.useState({
        username: "",
        password: ""
    })

    const onLogin = async () => {

    }
    return (
        <div className="flex items-center justify-center min-h-screen  dark:bg-gradient-to-r dark:from-slate-900 via-slate-500 to-slate-900">
            <div className="bg-neutral-900 p-10 rounded-[0.5rem] shadow-custom shadow-blue-800">
                <form className="space-y-6 text-white">
                    <div className='text-5xl font-semibold'>Login,</div>
                    <div>
                        <label className="block mb-2 text-lg font-medium text-slate-100" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="w-full px-3 py-2 border rounded-lg text-black font-medium focus:outline-none focus:ring-1 focus:ring-slate-200 focus:border-transparent"
                            type="text"
                            name="username"
                            id="username"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            placeholder='username'
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-lg font-medium text-slate-100" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full px-3 py-2 border rounded-lg text-black font-medium focus:outline-none focus:ring-1 focus:ring-slate-200 focus:border-transparent"
                            type="password"
                            name="password"
                            id="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            placeholder='password'
                            required
                        />
                    </div>
                    <div className='text-right hover:text-slate-400'>
                        <Link href='/forgot-password'>Forgot Password?</Link>
                    </div>
                    <div className="flex items-center justify-between">
                        <Button onClick={onLogin} variant="outline" type="submit" className='transition-all duration-300 ease-in-out'>
                            Login
                        </Button>
                    </div>
                </form>
            </div >
        </div >

    )
}

export default LoginPage