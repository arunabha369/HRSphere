import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import client from '../api/client';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Employee' // Default role
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const { data } = await client.post('/auth/register', formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/app/dashboard');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <Link to="/" className="inline-flex items-center space-x-2 mb-8">
                            <div className="bg-primary-600 p-1.5 rounded-lg">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900 tracking-tight">HRSphere</span>
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create an account</h1>
                        <p className="text-slate-600 mt-2">Join HRSphere to manage your workforce.</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl"
                    >
                        <form className="space-y-6" onSubmit={handleSignUp}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        placeholder="Enter Your Name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        placeholder="you@company.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
                            >
                                Sign Up
                            </button>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-slate-500">Already have an account?</span>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 inline-flex items-center">
                                    Sign in here <ArrowRight className="ml-1 w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="/signup_hero.png" // We need to move the generated image here
                    alt="Office Team"
                />
                <div className="absolute inset-0 bg-primary-900/20 mix-blend-multiply" />
                <div className="absolute bottom-0 left-0 right-0 p-12 text-white bg-gradient-to-t from-black/60 to-transparent">
                    <blockquote className="max-w-lg">
                        <p className="text-xl font-medium mb-4">"Join thousands of companies building better workplaces with HRSphere."</p>
                    </blockquote>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
