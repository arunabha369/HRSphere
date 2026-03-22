import React, { useState, useEffect } from 'react';
import { Target, Award, TrendingUp, CheckCircle, Plus, X, Loader2, Trash2, BarChart3 } from 'lucide-react';
import client from '../../api/client';

const QUARTER_OPTIONS = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'];
const STATUS_COLORS = {
    'Not Started': 'bg-slate-100 text-slate-600',
    'On Track': 'bg-green-100 text-green-700',
    'At Risk': 'bg-amber-100 text-amber-700',
    'Completed': 'bg-emerald-100 text-emerald-700',
};

const Performance = () => {
    const [goals, setGoals] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [goalForm, setGoalForm] = useState({ title: '', description: '', quarter: 'Q2 2026', dueDate: '' });
    const [reviewForm, setReviewForm] = useState({ title: '', rating: '', reviewer: '', feedback: '', employeeId: '' });
    const [employees, setEmployees] = useState([]);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdminOrHR = user.role === 'Admin' || user.role === 'HR';

    useEffect(() => {
        fetchData();
        if (isAdminOrHR) fetchEmployees();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await client.get('/performance/me');
            setGoals(data.filter(r => r.type === 'goal'));
            setReviews(data.filter(r => r.type === 'review'));
        } catch {
            setGoals([]);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            // For Admin/HR to assign reviews — get users list from auth or employees
            // We'll use a simple approach: fetch from the same performance endpoint with all users
        } catch { /* ignore */ }
    };

    const handleCreateGoal = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await client.post('/performance', {
                type: 'goal',
                ...goalForm,
            });
            setIsGoalModalOpen(false);
            setGoalForm({ title: '', description: '', quarter: 'Q2 2026', dueDate: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create goal.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateReview = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await client.post('/performance', {
                type: 'review',
                title: reviewForm.title,
                rating: Number(reviewForm.rating),
                reviewer: reviewForm.reviewer,
                feedback: reviewForm.feedback,
                reviewDate: new Date().toISOString(),
                employeeId: reviewForm.employeeId || undefined,
            });
            setIsReviewModalOpen(false);
            setReviewForm({ title: '', rating: '', reviewer: '', feedback: '', employeeId: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create review.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateProgress = async (id, newProgress) => {
        try {
            const progress = Math.min(100, Math.max(0, newProgress));
            const status = progress === 100 ? 'Completed' : progress >= 50 ? 'On Track' : progress > 0 ? 'At Risk' : 'Not Started';
            await client.put(`/performance/${id}`, { progress, status });
            fetchData();
        } catch {
            alert('Failed to update progress.');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await client.put(`/performance/${id}`, { status });
            fetchData();
        } catch {
            alert('Failed to update status.');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this record?')) return;
        try {
            await client.delete(`/performance/${id}`);
            fetchData();
        } catch {
            alert('Failed to delete.');
        }
    };

    // Stats
    const completedGoals = goals.filter(g => g.status === 'Completed').length;
    const avgProgress = goals.length > 0 ? Math.round(goals.reduce((s, g) => s + (g.progress || 0), 0) / goals.length) : 0;
    const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1) : '-';

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Performance</h1>
                    <p className="text-slate-500">Track goals, progress, and performance reviews.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setIsGoalModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm">
                        <Plus className="w-4 h-4" /> Add Goal
                    </button>
                    {isAdminOrHR && (
                        <button onClick={() => setIsReviewModalOpen(true)}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm">
                            <Award className="w-4 h-4" /> Add Review
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg"><Target className="w-5 h-5 text-blue-600" /></div>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{goals.length}</p>
                    <p className="text-sm text-slate-500">Total Goals</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-50 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{completedGoals}</p>
                    <p className="text-sm text-slate-500">Completed</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-50 rounded-lg"><BarChart3 className="w-5 h-5 text-purple-600" /></div>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{avgProgress}%</p>
                    <p className="text-sm text-slate-500">Avg Progress</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-50 rounded-lg"><Award className="w-5 h-5 text-amber-600" /></div>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{avgRating}</p>
                    <p className="text-sm text-slate-500">Avg Rating</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Goals Section */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center">
                            <Target className="w-5 h-5 mr-2 text-primary-600" />
                            My Goals
                        </h2>
                    </div>
                    {goals.length === 0 ? (
                        <div className="text-center py-8">
                            <Target className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">No goals yet. Add one to get started!</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {goals.map((goal) => (
                                <div key={goal._id} className="group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1 min-w-0">
                                            <span className="font-medium text-slate-700 block truncate">{goal.title}</span>
                                            {goal.quarter && (
                                                <span className="text-xs text-slate-400">{goal.quarter}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 ml-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[goal.status] || STATUS_COLORS['Not Started']}`}>
                                                {goal.status}
                                            </span>
                                            {isAdminOrHR && (
                                                <button onClick={() => handleDelete(goal._id)}
                                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {goal.description && (
                                        <p className="text-xs text-slate-400 mb-2 line-clamp-1">{goal.description}</p>
                                    )}
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 mb-1">
                                        <div
                                            className={`h-2.5 rounded-full transition-all duration-500 ${goal.status === 'Completed' ? 'bg-emerald-500' : goal.status === 'At Risk' ? 'bg-amber-500' : 'bg-primary-600'}`}
                                            style={{ width: `${goal.progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-slate-500">{goal.progress}% completed</p>
                                        {goal.status !== 'Completed' && (
                                            <div className="flex gap-1">
                                                <button onClick={() => handleUpdateProgress(goal._id, (goal.progress || 0) + 10)}
                                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium bg-primary-50 hover:bg-primary-100 px-2 py-0.5 rounded transition-colors">
                                                    +10%
                                                </button>
                                                <button onClick={() => handleUpdateProgress(goal._id, (goal.progress || 0) + 25)}
                                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium bg-primary-50 hover:bg-primary-100 px-2 py-0.5 rounded transition-colors">
                                                    +25%
                                                </button>
                                                <button onClick={() => handleUpdateProgress(goal._id, 100)}
                                                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded transition-colors">
                                                    Done
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reviews Section */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center">
                            <Award className="w-5 h-5 mr-2 text-primary-600" />
                            Performance Reviews
                        </h2>
                    </div>
                    {reviews.length === 0 ? (
                        <div className="text-center py-8">
                            <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">No reviews yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review._id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-slate-900">{review.title}</h3>
                                            <p className="text-sm text-slate-500">
                                                {review.reviewer ? `Reviewed by ${review.reviewer}` : 'HR Team'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center bg-primary-50 px-2 py-1 rounded-lg">
                                                <TrendingUp className="w-4 h-4 text-primary-600 mr-1" />
                                                <span className="font-bold text-primary-700">{review.rating || '-'}/5</span>
                                            </div>
                                            {isAdminOrHR && (
                                                <button onClick={() => handleDelete(review._id)}
                                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {review.feedback && (
                                        <p className="text-sm text-slate-500 mt-2 italic">&ldquo;{review.feedback}&rdquo;</p>
                                    )}
                                    <div className="mt-3 flex items-center text-xs text-slate-400">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        {review.reviewDate
                                            ? `Completed on ${new Date(review.reviewDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`
                                            : `Created ${new Date(review.createdAt).toLocaleDateString()}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Goal Modal */}
            {isGoalModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-slate-900/75" onClick={() => setIsGoalModalOpen(false)}></div>
                        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-900">Add New Goal</h3>
                                <button onClick={() => setIsGoalModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateGoal} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Goal Title</label>
                                    <input required type="text" value={goalForm.title}
                                        onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                                        placeholder="e.g. Complete React Certification" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <textarea rows="2" value={goalForm.description}
                                        onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                                        placeholder="Brief description..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Quarter</label>
                                        <select value={goalForm.quarter} onChange={(e) => setGoalForm({ ...goalForm, quarter: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none">
                                            {QUARTER_OPTIONS.map(q => <option key={q}>{q}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                                        <input type="date" value={goalForm.dueDate}
                                            onChange={(e) => setGoalForm({ ...goalForm, dueDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button type="button" onClick={() => setIsGoalModalOpen(false)}
                                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Cancel</button>
                                    <button type="submit" disabled={submitting}
                                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-lg shadow-primary-500/30 disabled:opacity-50 flex items-center gap-2">
                                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Create Goal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Review Modal (Admin/HR) */}
            {isReviewModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-slate-900/75" onClick={() => setIsReviewModalOpen(false)}></div>
                        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-900">Add Performance Review</h3>
                                <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateReview} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Review Title</label>
                                    <input required type="text" value={reviewForm.title}
                                        onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                                        placeholder="e.g. Annual Review 2025" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Rating (out of 5)</label>
                                        <input required type="number" min="0" max="5" step="0.1" value={reviewForm.rating}
                                            onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                                            placeholder="4.5" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Reviewer Name</label>
                                        <input type="text" value={reviewForm.reviewer}
                                            onChange={(e) => setReviewForm({ ...reviewForm, reviewer: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                                            placeholder="e.g. John Doe" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Feedback</label>
                                    <textarea rows="3" value={reviewForm.feedback}
                                        onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                                        placeholder="Write feedback..." />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button type="button" onClick={() => setIsReviewModalOpen(false)}
                                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Cancel</button>
                                    <button type="submit" disabled={submitting}
                                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium shadow-lg shadow-amber-500/30 disabled:opacity-50 flex items-center gap-2">
                                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Add Review
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

export default Performance;
