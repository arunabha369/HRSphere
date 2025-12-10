import React from 'react';
import { BookOpen, PlayCircle, Award, Clock } from 'lucide-react';

const Training = () => {
    const courses = [
        { id: 1, title: 'React Advanced Patterns', instructor: 'Kent C. Dodds', duration: '4h 30m', progress: 75, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { id: 2, title: 'Effective Communication', instructor: 'Simon Sinek', duration: '2h 15m', progress: 30, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { id: 3, title: 'Cybersecurity Basics', instructor: 'Security Team', duration: '1h 00m', progress: 0, image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Training & Development</h1>
                    <p className="text-slate-500">Upgrade your skills with our course catalog.</p>
                </div>
                <div className="flex space-x-3">
                    <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center">
                        <Award className="w-5 h-5 text-yellow-500 mr-2" />
                        <span className="font-bold text-slate-900">1,250 XP</span>
                    </div>
                </div>
            </div>

            <h2 className="text-lg font-bold text-slate-900">Continue Learning</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                        <div className="relative h-40 overflow-hidden">
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <PlayCircle className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                                <Clock className="w-3 h-3 mr-1" /> {course.duration}
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{course.title}</h3>
                            <p className="text-sm text-slate-500 mb-4">{course.instructor}</p>

                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                                <span>{course.progress}% Complete</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div
                                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-primary-900 rounded-2xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">Recommended for You</h3>
                        <p className="text-blue-200 mb-6 max-w-md">Based on your role as Senior Developer, we recommend mastering these cloud technologies.</p>
                        <button className="bg-white text-primary-900 px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                            View Path
                        </button>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10">
                        <BookOpen className="w-48 h-48 -mr-10 -mb-10" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Certifications</h3>
                    <div className="space-y-4">
                        <div className="flex items-center p-3 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mr-4">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">AWS Certified Solutions Architect</h4>
                                <p className="text-xs text-slate-500">Valid until Dec 2025</p>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-slate-50 rounded-xl opacity-60">
                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 mr-4">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Scrum Master Certified</h4>
                                <p className="text-xs text-slate-500">Expired Jan 2024</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Training;
