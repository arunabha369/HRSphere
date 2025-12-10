import React from 'react';
import { DollarSign, Download, FileText, TrendingUp, CreditCard } from 'lucide-react';

const Payroll = () => {
    const salarySlips = [
        { id: 1, month: 'February 2024', amount: '₹45,000.00', status: 'Paid', date: 'Feb 28, 2024' },
        { id: 2, month: 'January 2024', amount: '₹45,000.00', status: 'Paid', date: 'Jan 30, 2024' },
        { id: 3, month: 'December 2023', amount: '₹42,000.00', status: 'Paid', date: 'Dec 29, 2023' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Payroll</h1>
                    <p className="text-slate-500">Manage salaries and view payslips.</p>
                </div>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Process Payroll
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-700">Total Payroll Cost</h3>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">₹14,52,000</p>
                    <p className="text-sm text-slate-500 mt-1">+12% from last month</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-700">Next Pay Date</h3>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <CalendarIcon className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">Mar 30</p>
                    <p className="text-sm text-slate-500 mt-1">20 days remaining</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-700">Pending Reimbursements</h3>
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                            <CreditCard className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">₹12,500</p>
                    <p className="text-sm text-slate-500 mt-1">5 requests pending</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900">Salary Slips</h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {salarySlips.map((slip) => (
                        <div key={slip.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{slip.month}</p>
                                    <p className="text-sm text-slate-500">Processed on {slip.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6">
                                <span className="font-mono font-bold text-slate-900">{slip.amount}</span>
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">{slip.status}</span>
                                <button className="text-primary-600 hover:text-primary-700 p-2 hover:bg-primary-50 rounded-lg transition-colors">
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

function CalendarIcon({ className }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    )
}

export default Payroll;
