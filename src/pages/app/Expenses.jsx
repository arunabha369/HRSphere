import React from 'react';
import { Receipt, Plus, Filter, CheckCircle, Clock } from 'lucide-react';

const Expenses = () => {
    const expenses = [
        { id: 1, title: 'Client Lunch', amount: '₹2,500', date: '2024-03-10', category: 'Meals', status: 'Pending', employee: 'Aarav Sharma' },
        { id: 2, title: 'Uber to Airport', amount: '₹850', date: '2024-03-08', category: 'Travel', status: 'Approved', employee: 'Aarav Sharma' },
        { id: 3, title: 'Office Supplies', amount: '₹1,200', date: '2024-03-05', category: 'Office', status: 'Approved', employee: 'Diya Patel' },
        { id: 4, title: 'Software License', amount: '₹15,000', date: '2024-03-01', category: 'Software', status: 'Rejected', employee: 'Vihaan Gupta' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
                    <p className="text-slate-500">Manage claims and reimbursements.</p>
                </div>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    New Claim
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Summary Cards */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-slate-500 font-medium mb-2">Total Claimed (Mar)</h3>
                    <p className="text-3xl font-bold text-slate-900">₹19,550</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-slate-500 font-medium mb-2">Pending Approval</h3>
                    <p className="text-3xl font-bold text-orange-600">₹2,500</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-slate-500 font-medium mb-2">Reimbursed</h3>
                    <p className="text-3xl font-bold text-green-600">₹2,050</p>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Recent Claims</h3>
                    <button className="text-slate-500 hover:text-slate-700 flex items-center text-sm">
                        <Filter className="w-4 h-4 mr-1" /> Filter
                    </button>
                </div>
                <div className="divide-y divide-slate-100">
                    {expenses.map((expense) => (
                        <div key={expense.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                                    <Receipt className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{expense.title}</h4>
                                    <p className="text-sm text-slate-500">{expense.date} • {expense.category}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6">
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">{expense.amount}</p>
                                    <p className="text-xs text-slate-400">{expense.employee}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center ${expense.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                        expense.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    {expense.status === 'Approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                                    {expense.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                                    {expense.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Expenses;
