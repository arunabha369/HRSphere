import React, { useState, useEffect } from 'react';
import {
    BookOpen, PlayCircle, Award, Clock, Search, Filter, Plus, X,
    Loader2, GraduationCap, TrendingUp, BarChart3, ChevronRight,
    Users, Star, CheckCircle, Zap, Bookmark, ArrowRight
} from 'lucide-react';
import client from '../../api/client';

/* ─── Category Config ─── */
const CATEGORIES = [
    { id: 'All', label: 'All Courses', icon: BookOpen },
    { id: 'Technical', label: 'Technical', icon: Zap },
    { id: 'Leadership', label: 'Leadership', icon: Star },
    { id: 'Compliance', label: 'Compliance', icon: CheckCircle },
    { id: 'Communication', label: 'Communication', icon: Users },
    { id: 'Design', label: 'Design', icon: Bookmark },
];

const LEVEL_COLORS = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-blue-100 text-blue-700',
    Advanced: 'bg-purple-100 text-purple-700',
};

const CATEGORY_GRADIENTS = {
    Technical: 'from-blue-500 to-indigo-600',
    Leadership: 'from-amber-500 to-orange-600',
    Compliance: 'from-emerald-500 to-teal-600',
    Communication: 'from-pink-500 to-rose-600',
    Design: 'from-violet-500 to-purple-600',
    Other: 'from-slate-500 to-slate-700',
};

const DEFAULT_THUMBNAILS = {
    Technical: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=60',
    Leadership: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=60',
    Compliance: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=60',
    Communication: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=60',
    Design: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format&fit=crop&q=60',
    Other: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60',
};

/* ─── Ring Chart ─── */
const ProgressRing = ({ percentage, size = 52, strokeWidth = 5, color = '#3b82f6' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
                stroke="#e2e8f0" strokeWidth={strokeWidth} />
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
                stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
        </svg>
    );
};

const Training = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', category: 'Technical', instructor: '',
        duration: '', level: 'Beginner', thumbnail: '',
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id || user.id;

    useEffect(() => { fetchCourses(); }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const { data } = await client.get('/training');
            setCourses(data);
        } catch {
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId) => {
        try {
            await client.post(`/training/${courseId}/enroll`);
            fetchCourses();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to enroll.');
        }
    };

    const handleProgressUpdate = async (courseId, progress) => {
        try {
            await client.put(`/training/${courseId}/progress`, { progress });
            fetchCourses();
        } catch {
            alert('Failed to update progress.');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await client.post('/training', {
                ...formData,
                thumbnail: formData.thumbnail || DEFAULT_THUMBNAILS[formData.category] || DEFAULT_THUMBNAILS.Other,
            });
            setIsCreateOpen(false);
            setFormData({ title: '', description: '', category: 'Technical', instructor: '', duration: '', level: 'Beginner', thumbnail: '' });
            fetchCourses();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create course.');
        } finally {
            setSubmitting(false);
        }
    };

    /* ─── Derived data ─── */
    const filtered = courses.filter(c => {
        const matchCat = activeCategory === 'All' || c.category === activeCategory;
        const matchSearch = c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCat && matchSearch;
    });

    const getEnrollment = (course) => course.enrolledUsers?.find(e => e.user === userId || e.user?._id === userId);

    const enrolledCourses = courses.filter(c => getEnrollment(c));
    const completedCourses = enrolledCourses.filter(c => {
        const enrollment = getEnrollment(c);
        return enrollment && enrollment.progress === 100;
    });
    const inProgressCourses = enrolledCourses.filter(c => {
        const enrollment = getEnrollment(c);
        return enrollment && enrollment.progress > 0 && enrollment.progress < 100;
    });
    const totalXp = completedCourses.length * 500 + inProgressCourses.reduce((s, c) => {
        const enrollment = getEnrollment(c);
        return s + Math.floor((enrollment?.progress || 0) * 5);
    }, 0);

    return (
        <div className="space-y-6">
            {/* ─── Header ─── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Training & Development</h1>
                    <p className="text-slate-500 mt-1">Grow your skills with curated learning paths.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                        <Award className="w-5 h-5 text-white" />
                        <span className="font-bold text-white">{totalXp.toLocaleString()} XP</span>
                    </div>
                    <button onClick={() => setIsCreateOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm">
                        <Plus className="w-4 h-4" />
                        Add Course
                    </button>
                </div>
            </div>

            {/* ─── Stats Row ─── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg"><BookOpen className="w-5 h-5 text-blue-600" /></div>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{courses.length}</p>
                    <p className="text-sm text-slate-500">Total Courses</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-50 rounded-lg"><TrendingUp className="w-5 h-5 text-green-600" /></div>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{inProgressCourses.length}</p>
                    <p className="text-sm text-slate-500">In Progress</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-50 rounded-lg"><GraduationCap className="w-5 h-5 text-purple-600" /></div>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{completedCourses.length}</p>
                    <p className="text-sm text-slate-500">Completed</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-50 rounded-lg"><Award className="w-5 h-5 text-amber-600" /></div>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{completedCourses.length}</p>
                    <p className="text-sm text-slate-500">Certificates</p>
                </div>
            </div>

            {/* ─── Continue Learning (In-Progress Courses) ─── */}
            {inProgressCourses.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-primary-500" />
                        Continue Learning
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {inProgressCourses.map(course => {
                            const enrollment = getEnrollment(course);
                            const progress = enrollment?.progress || 0;
                            return (
                                <div key={course._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow">
                                    <div className="w-28 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={course.thumbnail || DEFAULT_THUMBNAILS[course.category]} alt={course.title}
                                            className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 text-sm truncate">{course.title}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">{course.instructor}</p>
                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="flex-1">
                                                <div className="w-full bg-slate-100 rounded-full h-2">
                                                    <div className="bg-primary-500 h-2 rounded-full transition-all duration-700"
                                                        style={{ width: `${progress}%` }}></div>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-600">{progress}%</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleProgressUpdate(course._id, Math.min(100, progress + 25))}
                                        className="self-center p-2 bg-primary-50 hover:bg-primary-100 rounded-lg text-primary-600 transition-colors"
                                        title="Continue (+25%)">
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ─── Search + Filters ─── */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="text" placeholder="Search courses, instructors..." value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white shadow-sm" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {CATEGORIES.map(cat => {
                        const CatIcon = cat.icon;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeCategory === cat.id
                                        ? 'bg-primary-600 text-white shadow-sm'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                <CatIcon className="w-3.5 h-3.5" />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ─── Course Catalog ─── */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-slate-500 font-medium">No courses found</p>
                    <p className="text-sm text-slate-400 mt-1">Try changing filters or add a new course.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(course => {
                        const enrollment = getEnrollment(course);
                        const isEnrolled = !!enrollment;
                        const progress = enrollment?.progress || 0;
                        const isCompleted = progress === 100;
                        const gradient = CATEGORY_GRADIENTS[course.category] || CATEGORY_GRADIENTS.Other;

                        return (
                            <div key={course._id}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
                                {/* Thumbnail */}
                                <div className="relative h-44 overflow-hidden">
                                    <img src={course.thumbnail || DEFAULT_THUMBNAILS[course.category]}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                    {/* Play overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                                            <PlayCircle className="w-10 h-10 text-white" />
                                        </div>
                                    </div>

                                    {/* Duration badge */}
                                    {course.duration && (
                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {course.duration}
                                        </div>
                                    )}

                                    {/* Level badge */}
                                    <div className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-lg font-semibold ${LEVEL_COLORS[course.level] || LEVEL_COLORS.Beginner}`}>
                                        {course.level}
                                    </div>

                                    {/* Category strip */}
                                    <div className="absolute bottom-3 left-3">
                                        <span className={`text-xs font-semibold text-white bg-gradient-to-r ${gradient} px-2.5 py-1 rounded-lg`}>
                                            {course.category}
                                        </span>
                                    </div>

                                    {/* Completion check */}
                                    {isCompleted && (
                                        <div className="absolute bottom-3 right-3 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-2 leading-snug">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-1">{course.instructor || 'HR Team'}</p>

                                    {course.description && (
                                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">{course.description}</p>
                                    )}

                                    <div className="mt-auto pt-3 border-t border-slate-100">
                                        {isEnrolled ? (
                                            <div>
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <span className="text-xs text-slate-500">Progress</span>
                                                    <span className="text-xs font-bold text-slate-700">{progress}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                                                    <div className={`h-2 rounded-full transition-all duration-700 ${isCompleted ? 'bg-green-500' : 'bg-primary-500'}`}
                                                        style={{ width: `${progress}%` }}></div>
                                                </div>
                                                {isCompleted ? (
                                                    <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                                                        <Award className="w-4 h-4" />
                                                        Course Completed!
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleProgressUpdate(course._id, Math.min(100, progress + 25))}
                                                        className="w-full py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-semibold hover:bg-primary-100 transition-colors flex items-center justify-center gap-2">
                                                        <PlayCircle className="w-4 h-4" />
                                                        Continue Learning
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleEnroll(course._id)}
                                                className="w-full py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/20 flex items-center justify-center gap-2">
                                                <GraduationCap className="w-4 h-4" />
                                                Enroll Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ─── Recommended + Certifications ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recommended */}
                <div className="bg-gradient-to-br from-primary-700 via-primary-800 to-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5"></div>
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-amber-400" />
                            <span className="text-amber-300 text-sm font-semibold uppercase tracking-wide">Recommended for You</span>
                        </div>
                        <h3 className="text-2xl font-extrabold mb-3">Level Up Your Career</h3>
                        <p className="text-blue-200 mb-6 max-w-md text-sm leading-relaxed">
                            Based on your role and interests, we recommend exploring leadership and advanced technical courses to accelerate your growth.
                        </p>
                        <button className="bg-white text-primary-800 px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2">
                            View Learning Path
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="absolute right-4 bottom-4 opacity-[0.07]">
                        <GraduationCap className="w-36 h-36" />
                    </div>
                </div>

                {/* Certifications */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Award className="w-5 h-5 text-amber-500" />
                            Certifications
                        </h3>
                        <span className="text-xs text-slate-400 font-medium">{completedCourses.length} earned</span>
                    </div>
                    {completedCourses.length > 0 ? (
                        <div className="space-y-3">
                            {completedCourses.map(c => (
                                <div key={c._id} className="flex items-center gap-4 p-3 bg-amber-50 rounded-xl">
                                    <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Award className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-slate-900 text-sm truncate">{c.title}</h4>
                                        <p className="text-xs text-slate-500">Completed • {c.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Award className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-sm text-slate-500 font-medium">No certifications yet</p>
                            <p className="text-xs text-slate-400 mt-1">Complete a course to earn your first certificate!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── Create Course Modal ─── */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-slate-900/75" onClick={() => setIsCreateOpen(false)}></div>
                        <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-900">Add New Course</h3>
                                <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-500">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
                                    <input required type="text" value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                                        placeholder="e.g. Advanced React Patterns" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <textarea rows="2" value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                                        placeholder="Brief description of the course..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none">
                                            <option>Technical</option><option>Leadership</option><option>Compliance</option>
                                            <option>Communication</option><option>Design</option><option>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
                                        <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none">
                                            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Instructor</label>
                                        <input type="text" value={formData.instructor}
                                            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                                            placeholder="Instructor name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                                        <input type="text" value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                                            placeholder="e.g. 3h 30m" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail URL (optional)</label>
                                    <input type="url" value={formData.thumbnail}
                                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                                        placeholder="https://..." />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button type="button" onClick={() => setIsCreateOpen(false)}
                                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Cancel</button>
                                    <button type="submit" disabled={submitting}
                                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-lg shadow-primary-500/30 disabled:opacity-50 flex items-center gap-2">
                                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Create Course
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Training;
