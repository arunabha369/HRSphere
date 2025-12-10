import React from 'react';
import TypewriterText from '../components/TypewriterText';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users, Calendar, Clock, CreditCard, TrendingUp, Shield,
    CheckCircle, ArrowRight, Star, Building
} from 'lucide-react';

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const Home = () => {
    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50 to-white -z-10" />
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-100/50 rounded-full blur-3xl -z-10 transform translate-x-1/3 -translate-y-1/4" />

                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.span variants={fadeInUp} className="inline-block py-1 px-3 rounded-full bg-blue-100 text-primary-700 text-sm font-semibold mb-6">
                            🚀 The Future of HR Management
                        </motion.span>
                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
                            <TypewriterText text="All-in-One " delay={0.1} />
                            <span className="text-gradient">
                                <TypewriterText text="HR System" delay={0.1} />
                            </span>
                            <br className="hidden md:block" />
                            <TypewriterText text=" for Modern Teams" delay={1.1} />
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Automate HR workflows, manage employees, simplify payroll, and boost productivity — all in one platform.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2">
                                Get Started <ArrowRight className="w-5 h-5" />
                            </Link>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold text-lg transition-all shadow-sm">
                                Request Demo
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Dashboard Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative max-w-6xl mx-auto"
                    >
                        <div className="absolute inset-0 bg-primary-500/10 blur-3xl rounded-3xl -z-10 transform scale-95 translate-y-4" />
                        <img
                            src="/dashboard-mockup.png"
                            alt="HRSphere Dashboard"
                            className="rounded-2xl shadow-2xl border border-slate-200/50 w-full"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Trusted By */}
            <section className="py-10 border-y border-slate-100 bg-slate-50/50">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm font-medium text-slate-500 mb-6 uppercase tracking-wider">Trusted by innovative companies</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Acme Corp', 'GlobalTech', 'Nebula', 'Circle', 'FoxRun'].map((company) => (
                            <div key={company} className="flex items-center gap-2 text-xl font-bold text-slate-800">
                                <Building className="w-6 h-6" /> {company}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Highlights */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to manage your people</h2>
                        <p className="text-lg text-slate-600">Powerful modules integrated into one seamless platform.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Users, title: 'Employee Management', desc: 'Centralized database for all your employee records and documents.' },
                            { icon: Clock, title: 'Attendance & Timesheets', desc: 'Track work hours, overtime, and shifts with biometric integration.' },
                            { icon: Calendar, title: 'Leave Automation', desc: 'Streamlined leave requests and approval workflows.' },
                            { icon: CreditCard, title: 'Payroll Processing', desc: 'Automated salary calculation, tax deductions, and payslip generation.' },
                            { icon: TrendingUp, title: 'Performance Reviews', desc: '360-degree feedback, goals tracking, and appraisal cycles.' },
                            { icon: Shield, title: 'Recruitment ATS', desc: 'Manage job postings, candidates, and hiring pipelines efficiently.' },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                className="glass-card p-8 rounded-2xl"
                            >
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-primary-600">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Why leading companies choose HRSphere</h2>
                            <div className="space-y-8">
                                {[
                                    { title: 'Seamless Integration', desc: 'Connects with your favorite tools like Slack, Zoom, and Google Workspace.' },
                                    { title: 'Bank-Grade Security', desc: 'Enterprise-level data protection with SOC2 compliance and encryption.' },
                                    { title: '24/7 Expert Support', desc: 'Dedicated support team to help you succeed at every step.' },
                                ].map((item, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="mt-1">
                                            <CheckCircle className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                                            <p className="text-slate-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-blue-600 rounded-2xl transform rotate-3 opacity-20" />
                            <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl border border-slate-100">
                                <img
                                    src="/why-choose-us.png"
                                    alt="Team collaboration"
                                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16">Loved by HR teams worldwide</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Sarah Johnson', role: 'HR Director, TechFlow', text: 'HRSphere transformed how we manage our remote team. The onboarding process is now 10x faster.' },
                            { name: 'Michael Chen', role: 'CEO, StartUp Inc', text: 'The best investment we made this year. It saves us countless hours on payroll and compliance.' },
                            { name: 'Emily Davis', role: 'People Ops, CreativeStudio', text: 'Beautiful interface and incredibly intuitive. Our employees actually love using it!' },
                        ].map((testimonial, index) => (
                            <div key={index} className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                                <div className="flex justify-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-slate-700 italic mb-6">"{testimonial.text}"</p>
                                <div>
                                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Teaser */}
            <section className="py-24 bg-primary-900 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to streamline your HR?</h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Join thousands of companies building better workplaces with HRSphere.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/pricing" className="px-8 py-4 bg-white text-primary-900 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors">
                            View Pricing
                        </Link>
                        <Link to="/contact" className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
