import React, { useState, useEffect } from 'react';
import { Briefcase, UserPlus, MoreHorizontal, MessageSquare, X, Loader2 } from 'lucide-react';
import client from '../../api/client';

const Recruitment = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', role: '', email: '', phone: '' });

    const columns = [
        { id: 'Applied', title: 'Applied', color: 'bg-blue-500' },
        { id: 'Screening', title: 'Screening', color: 'bg-purple-500' },
        { id: 'Interview', title: 'Interview', color: 'bg-orange-500' },
        { id: 'Offer', title: 'Offer Sent', color: 'bg-green-500' },
    ];

    useEffect(() => { fetchCandidates(); }, []);

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const { data } = await client.get('/recruitment');
            setCandidates(data);
        } catch {
            setCandidates([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await client.post('/recruitment', formData);
            setIsModalOpen(false);
            setFormData({ name: '', role: '', email: '', phone: '' });
            fetchCandidates();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add candidate.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStageChange = async (candidateId, newStage) => {
        try {
            await client.put(`/recruitment/${candidateId}`, { stage: newStage });
            fetchCandidates();
        } catch (err) {
            alert('Failed to update stage.');
        }
    };

    const timeAgo = (date) => {
        if (!date) return '';
        const diff = Date.now() - new Date(date).getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) return 'Today';
        if (days === 1) return '1d ago';
        return `${days}d ago`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Recruitment</h1>
                    <p className="text-slate-500">Track candidates and job openings.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Candidate
                </button>
            </div>

            <div className="flex-1 overflow-x-auto">
                <div className="flex space-x-6 min-w-max h-full pb-4">
                    {columns.map((col) => {
                        const colCandidates = candidates.filter(c => c.stage === col.id);
                        return (
                            <div key={col.id} className="w-80 flex flex-col bg-slate-100 rounded-xl p-4 h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-3 h-3 rounded-full ${col.color}`}></div>
                                        <h3 className="font-bold text-slate-700">{col.title}</h3>
                                        <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-slate-500 shadow-sm">{colCandidates.length}</span>
                                    </div>
                                </div>
                                <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                                    {colCandidates.map((candidate) => (
                                        <div key={candidate._id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-900">{candidate.name}</h4>
                                                <span className="text-xs text-slate-400">{timeAgo(candidate.appliedDate || candidate.createdAt)}</span>
                                            </div>
                                            <p className="text-sm text-primary-600 font-medium mb-3">{candidate.role}</p>
                                            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                                <select
                                                    value={candidate.stage}
                                                    onChange={(e) => handleStageChange(candidate._id, e.target.value)}
                                                    className="text-xs border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-primary-500 outline-none bg-white"
                                                >
                                                    <option>Applied</option>
                                                    <option>Screening</option>
                                                    <option>Interview</option>
                                                    <option>Offer</option>
                                                    <option>Hired</option>
                                                    <option>Rejected</option>
                                                </select>
                                                <div className="flex items-center text-slate-400 text-xs">
                                                    <MessageSquare className="w-3 h-3 mr-1" />
                                                    {candidate.notes ? '1' : '0'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add Candidate Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-slate-900/75" onClick={() => setIsModalOpen(false)}></div>
                        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-900">Add Candidate</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500"><X className="w-6 h-6" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                    <input required type="text" value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                    <input required type="text" value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                        <input required type="email" value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                        <input type="text" value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Cancel</button>
                                    <button type="submit" disabled={submitting}
                                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-lg shadow-primary-500/30 disabled:opacity-50 flex items-center">
                                        {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                        Add Candidate
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

export default Recruitment;
