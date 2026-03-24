import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, XCircle, Plus, X, Loader2, UserCircle } from 'lucide-react';
import client from '../../api/client';

const Leave = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState(null); // tracks which leave ID is being updated
    const [formData, setFormData] = useState({ type: 'Casual Leave', startDate: '', endDate: '', reason: '' });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdminOrHR = user.role === 'Admin' || user.role === 'HR';

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const { data } = await client.get('/leave');
            setLeaves(data);
        } catch {
            setLeaves([]);
        } finally {
            setLoading(false);
        }
    };

    // Compute leave balances from records
    const leaveTypes = [
        { type: 'Casual Leave', total: 12, color: 'bg-blue-500', lightBg: 'bg-blue-50', textColor: 'text-blue-600' },
        { type: 'Sick Leave', total: 10, color: 'bg-red-500', lightBg: 'bg-red-50', textColor: 'text-red-600' },
        { type: 'Earned Leave', total: 15, color: 'bg-green-500', lightBg: 'bg-green-50', textColor: 'text-green-600' },
    ];

    const getUsedCount = (type) => {
        return leaves.filter(l => l.type === type && l.status === 'Approved').reduce((sum, l) => {
            const days = Math.ceil((new Date(l.endDate) - new Date(l.startDate)) / (1000 * 60 * 60 * 24)) + 1;
            return sum + days;
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await client.post('/leave', {
                employeeId: user._id || user.id,
                type: formData.type,
                startDate: formData.startDate,
                endDate: formData.endDate,
                reason: formData.reason,
            });
            setIsModalOpen(false);
            setFormData({ type: 'Casual Leave', startDate: '', endDate: '', reason: '' });
            fetchLeaves();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to apply for leave.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateStatus = async (leaveId, newStatus) => {
        setActionLoading(leaveId);
        try {
            await client.put(`/leave/${leaveId}`, { status: newStatus });
            fetchLeaves();
        } catch (err) {
            alert(err.response?.data?.message || `Failed to ${newStatus.toLowerCase()} leave.`);
        } finally {
            setActionLoading(null);
        }
    };

    const getDays = (start, end) => {
        if (!start || !end) return 0;
        return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '-';

    const pendingCount = leaves.filter(l => l.status === 'Pending').length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
                    <p className="text-slate-500">Track your leave balances and history.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Apply for Leave
                </button>
            </div>

            {/* Pending badge for Admin/HR */}
            {isAdminOrHR && pendingCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <p className="text-sm text-amber-700 font-medium">
                        {pendingCount} leave request{pendingCount > 1 ? 's' : ''} pending your approval
                    </p>
                </div>
            )}

            {/* Balances */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {leaveTypes.map((leave, index) => {
                    const used = getUsedCount(leave.type);
                    return (
                        <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-700">{leave.type}</h3>
                                <div className={`p-2 rounded-lg ${leave.lightBg}`}>
                                    <Calendar className={`w-4 h-4 ${leave.textColor}`} />
                                </div>
                            </div>
                            <div className="flex items-end justify-between mb-2">
                                <span className="text-3xl font-bold text-slate-900">{leave.total - used}</span>
                                <span className="text-sm text-slate-500 mb-1">Available</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${leave.color} transition-all duration-500`}
                                    style={{ width: `${Math.min((used / leave.total) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">{used} used of {leave.total}</p>
                        </div>
                    );
                })}
            </div>

            {/* History */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Leave History</h3>
                    {isAdminOrHR && (
                        <span className="text-xs text-slate-400">Showing all employees</span>
                    )}
                </div>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                    </div>
                ) : leaves.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                        <p>No leave records found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    {isAdminOrHR && <th className="px-6 py-3 font-medium">Employee</th>}
                                    <th className="px-6 py-3 font-medium">Type</th>
                                    <th className="px-6 py-3 font-medium">Dates</th>
                                    <th className="px-6 py-3 font-medium">Days</th>
                                    <th className="px-6 py-3 font-medium">Reason</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    {isAdminOrHR && <th className="px-6 py-3 font-medium text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {leaves.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                                        {isAdminOrHR && (
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-bold">
                                                        {item.employee?.name ? item.employee.name.charAt(0) : '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900 text-sm">{item.employee?.name || 'Unknown'}</p>
                                                        <p className="text-xs text-slate-400">{item.employee?.department || ''}</p>
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                        <td className="px-6 py-4 font-medium text-slate-900">{item.type}</td>
                                        <td className="px-6 py-4 text-slate-600">{formatDate(item.startDate)} — {formatDate(item.endDate)}</td>
                                        <td className="px-6 py-4 text-slate-600">{getDays(item.startDate, item.endDate)}</td>
                                        <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate">{item.reason}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                item.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {item.status === 'Approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                                                {item.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                                                {item.status === 'Rejected' && <XCircle className="w-3 h-3 mr-1" />}
                                                {item.status}
                                            </span>
                                        </td>
                                        {isAdminOrHR && (
                                            <td className="px-6 py-4 text-right">
                                                {item.status === 'Pending' ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleUpdateStatus(item._id, 'Approved')}
                                                            disabled={actionLoading === item._id}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-100 border border-green-200 transition-colors disabled:opacity-50"
                                                        >
                                                            {actionLoading === item._id ? (
                                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                            ) : (
                                                                <CheckCircle className="w-3 h-3" />
                                                            )}
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(item._id, 'Rejected')}
                                                            disabled={actionLoading === item._id}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50"
                                                        >
                                                            {actionLoading === item._id ? (
                                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                            ) : (
                                                                <XCircle className="w-3 h-3" />
                                                            )}
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">—</span>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Apply Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-slate-900/75" onClick={() => setIsModalOpen(false)}></div>
                        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-900">Apply for Leave</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                                    >
                                        <option>Casual Leave</option>
                                        <option>Sick Leave</option>
                                        <option>Earned Leave</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">From</label>
                                        <input required type="date" value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                                        <input required type="date" value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                                    <textarea required rows="3" value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Cancel</button>
                                    <button type="submit" disabled={submitting}
                                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-lg shadow-primary-500/30 disabled:opacity-50 flex items-center">
                                        {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                        Apply
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

export default Leave;
