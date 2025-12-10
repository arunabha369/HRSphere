import React from 'react';
import { Briefcase, UserPlus, MoreHorizontal, MessageSquare } from 'lucide-react';

const Recruitment = () => {
    const columns = [
        { id: 'applied', title: 'Applied', color: 'bg-blue-500', count: 12 },
        { id: 'screening', title: 'Screening', color: 'bg-purple-500', count: 5 },
        { id: 'interview', title: 'Interview', color: 'bg-orange-500', count: 3 },
        { id: 'offer', title: 'Offer Sent', color: 'bg-green-500', count: 1 },
    ];

    const candidates = [
        { id: 1, name: 'Aarav Patel', role: 'Frontend Dev', status: 'applied', time: '2h ago' },
        { id: 2, name: 'Vihaan Sharma', role: 'Product Designer', status: 'screening', time: '1d ago' },
        { id: 3, name: 'Aditya Verma', role: 'Backend Dev', status: 'interview', time: '3d ago' },
        { id: 4, name: 'Diya Gupta', role: 'HR Manager', status: 'offer', time: '5d ago' },
        { id: 5, name: 'Ishaan Kumar', role: 'Frontend Dev', status: 'applied', time: '4h ago' },
    ];

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Recruitment</h1>
                    <p className="text-slate-500">Track candidates and job openings.</p>
                </div>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Post Job
                </button>
            </div>

            <div className="flex-1 overflow-x-auto">
                <div className="flex space-x-6 min-w-max h-full pb-4">
                    {columns.map((col) => (
                        <div key={col.id} className="w-80 flex flex-col bg-slate-100 rounded-xl p-4 h-full">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${col.color}`}></div>
                                    <h3 className="font-bold text-slate-700">{col.title}</h3>
                                    <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-slate-500 shadow-sm">{col.count}</span>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                                {candidates.filter(c => c.status === col.id).map((candidate) => (
                                    <div key={candidate.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-900">{candidate.name}</h4>
                                            <span className="text-xs text-slate-400">{candidate.time}</span>
                                        </div>
                                        <p className="text-sm text-primary-600 font-medium mb-3">{candidate.role}</p>
                                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                            <div className="flex -space-x-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">HR</div>
                                            </div>
                                            <div className="flex items-center text-slate-400 text-xs">
                                                <MessageSquare className="w-3 h-3 mr-1" />
                                                2
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Recruitment;
