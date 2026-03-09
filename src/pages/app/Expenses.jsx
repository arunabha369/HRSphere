import React, { useState, useEffect } from 'react';
import { Receipt, Plus, Filter, CheckCircle, Clock, XCircle, X, Loader2 } from 'lucide-react';
import client from '../../api/client';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ title: '', amount: '', date: '', category: 'Travel' });

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => { fetchExpenses(); }, []);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const { data } = await client.get('/expenses');
            setExpenses(data);
        } catch {
            setExpenses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await client.post('/expenses', {
                employeeId: user._id || user.id,
                title: formData.title,
                amount: Number(formData.amount),
                date: formData.date,
                category: formData.category,
            });
            setIsModalOpen(false);
            setFormData({ title: '', amount: '', date: '', category: 'Travel' });
            fetchExpenses();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to file expense.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
    const totalClaimed = expenses.reduce((s, e) => s + (e.amount || 0), 0);
    const pendingAmount = expenses.filter(e => e.status === 'Pending').reduce((s, e) => s + (e.amount || 0), 0);
    const reimbursedAmount = expenses.filter(e => e.status === 'Reimbursed' || e.status === 'Approved').reduce((s, e) => s + (e.amount || 0), 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
                    <p className="text-slate-500">Manage claims and reimbursements.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    New Claim
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-slate-500 font-medium mb-2">Total Claimed</h3>
                    <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalClaimed)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-slate-500 font-medium mb-2">Pending Approval</h3>
                    <p className="text-3xl font-bold text-orange-600">{formatCurrency(pendingAmount)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-slate-500 font-medium mb-2">Reimbursed</h3>
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(reimbursedAmount)}</p>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Recent Claims</h3>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Receipt className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                        <p>No expense claims found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {expenses.map((expense) => (
                            <div key={expense._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                                        <Receipt className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{expense.title}</h4>
                                        <p className="text-sm text-slate-500">
                                            {expense.date ? new Date(expense.date).toLocaleDateString() : '-'} • {expense.category}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">{formatCurrency(expense.amount)}</p>
                                        <p className="text-xs text-slate-400">{expense.employee?.name || ''}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center ${
                                        expense.status === 'Approved' || expense.status === 'Reimbursed' ? 'bg-green-100 text-green-700' :
                                        expense.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {(expense.status === 'Approved' || expense.status === 'Reimbursed') && <CheckCircle className="w-3 h-3 mr-1" />}
                                        {expense.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                                        {expense.status === 'Rejected' && <XCircle className="w-3 h-3 mr-1" />}
                                        {expense.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* New Claim Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-slate-900/75" onClick={() => setIsModalOpen(false)}></div>
                        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-900">New Expense Claim</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500"><X className="w-6 h-6" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                    <input required type="text" value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="e.g. Client Dinner" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
                                        <input required type="number" value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                        <input required type="date" value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none">
                                        <option>Travel</option><option>Meals</option><option>Office</option><option>Software</option><option>Other</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Cancel</button>
                                    <button type="submit" disabled={submitting}
                                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-lg shadow-primary-500/30 disabled:opacity-50 flex items-center">
                                        {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                        Submit Claim
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

export default Expenses;
