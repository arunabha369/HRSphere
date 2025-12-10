import React from 'react';
import { motion } from 'framer-motion';
import { Target, Heart, Zap, Globe, Award, Users } from 'lucide-react';

const About = () => {
    return (
        <div className="pt-20 pb-20 bg-slate-50 min-h-screen">
            {/* Hero */}
            <section className="bg-white py-20 border-b border-slate-100">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
                    >
                        We're building the <span className="text-primary-600">future of work</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
                    >
                        HRSphere is a comprehensive Human Resource Management System designed to streamline workforce management. This project represents the culmination of my engineering studies.
                    </motion.p>
                </div>
            </section>

            {/* Values */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { icon: Target, title: 'Our Mission', desc: 'To simplify complex HR processes and enable companies to focus on their most valuable asset: their people.' },
                            { icon: Heart, title: 'Our Culture', desc: 'We foster a culture of empathy, innovation, and continuous learning. We practice what we preach.' },
                            { icon: Zap, title: 'Innovation', desc: 'We are constantly pushing the boundaries of what HR tech can do with AI and automation.' }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center"
                            >
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Project Timeline */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-16">Project Journey</h2>
                    <div className="max-w-4xl mx-auto space-y-12 relative before:absolute before:inset-0 before:ml-5 md:before:ml-[50%] before:-translate-x-px md:before:mx-auto before:h-full before:w-0.5 before:bg-slate-200">
                        {[
                            { year: 'Aug 2024', title: 'Project Inception', desc: 'Identified the need for a modern, simplified HRMS for small businesses.' },
                            { year: 'Sep 2024', title: 'Requirement Analysis', desc: 'Gathered requirements and designed the system architecture and database schema.' },
                            { year: 'Oct 2024', title: 'Development Phase', desc: 'Started implementation using React, Tailwind CSS, and modern web technologies.' },
                            { year: 'Dec 2024', title: 'Final Submission', desc: 'Completed testing and documentation for the final year project submission.' }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                        <div className="font-bold text-slate-900">{item.title}</div>
                                        <time className="font-mono text-primary-600 font-bold">{item.year}</time>
                                    </div>
                                    <div className="text-slate-600 text-sm">{item.desc}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12">Technology Stack</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {['React.js', 'Tailwind CSS', 'Vite', 'Framer Motion', 'React Router', 'Lucide Icons', 'Git', 'VS Code'].map((tech, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 font-medium text-slate-700"
                            >
                                {tech}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Project Team */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-16">Project Team</h2>
                    <div className="max-w-xs mx-auto">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                        >
                            <div className="w-32 h-32 bg-slate-200 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-slate-50 shadow-lg">
                                <img
                                    src="/arunabha.jpg"
                                    alt="Arunabha Banerjee"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="font-bold text-slate-900">Arunabha Banerjee</h3>
                            <p className="text-primary-600 text-sm">Final Year Student</p>
                            <p className="text-slate-500 text-xs mt-2">Computer Science & Business Systems</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Global Presence */}
            <section className="py-20 bg-slate-900 text-white overflow-hidden">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-8">From Kolkata to the World</h2>
                    <p className="text-blue-200 mb-12 max-w-2xl mx-auto">Developed in Kolkata, designed for global impact. Scalable, secure, and ready for enterprise deployment.</p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative max-w-4xl mx-auto"
                    >
                        <img src="/global-map.png" alt="Global Map" className="w-full opacity-80" />
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
