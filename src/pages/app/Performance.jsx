import React from 'react';
import { Target, Award, TrendingUp, CheckCircle } from 'lucide-react';

const Performance = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Performance</h1>
                <p className="text-slate-500">Track goals and performance reviews.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Goals Section */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center">
                            <Target className="w-5 h-5 mr-2 text-primary-600" />
                            My Goals (Q1 2024)
                        </h2>
                        <button className="text-sm text-primary-600 font-medium hover:underline">Add Goal</button>
                    </div>
                    <div className="space-y-6">
                        {[
                            { title: 'Complete React Certification', progress: 75, status: 'On Track' },
                            { title: 'Deliver HRMS Project', progress: 90, status: 'On Track' },
                            { title: 'Mentor Junior Developers', progress: 40, status: 'At Risk' },
                        ].map((goal, index) => (
                            <div key={index}>
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium text-slate-700">{goal.title}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${goal.status === 'On Track' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                        }`}>{goal.status}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full ${goal.status === 'On Track' ? 'bg-primary-600' : 'bg-amber-500'}`}
                                        style={{ width: `${goal.progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-right text-xs text-slate-500 mt-1">{goal.progress}% completed</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center">
                            <Award className="w-5 h-5 mr-2 text-primary-600" />
                            Performance Reviews
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            { cycle: 'Annual Review 2023', rating: '4.5/5', date: 'Dec 15, 2023', reviewer: 'Alex Morgan' },
                            { cycle: 'Mid-Year Review 2023', rating: '4.2/5', date: 'Jun 20, 2023', reviewer: 'Sarah Chen' },
                        ].map((review, index) => (
                            <div key={index} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{review.cycle}</h3>
                                        <p className="text-sm text-slate-500">Reviewed by {review.reviewer}</p>
                                    </div>
                                    <div className="flex items-center bg-primary-50 px-2 py-1 rounded-lg">
                                        <TrendingUp className="w-4 h-4 text-primary-600 mr-1" />
                                        <span className="font-bold text-primary-700">{review.rating}</span>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center text-xs text-slate-400">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Completed on {review.date}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Performance;
