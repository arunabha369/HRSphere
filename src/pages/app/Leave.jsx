import React from 'react';
import { Calendar, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';

const Leave = () => {
    const leaveBalances = [
        { type: 'Casual Leave', used: 4, total: 12, color: 'bg-blue-500' },
        { type: 'Sick Leave', used: 2, total: 10, color: 'bg-red-500' },
        { type: 'Earned Leave', used: 5, total: 15, color: 'bg-green-500' },
    ];

    const leaveHistory = [
        { id: 1, type: 'Casual Leave', from: '2024-02-10', to: '2024-02-12', days: 3, reason: 'Family function', status: 'Approved' },
        { id: 2, type: 'Sick Leave', from: '2024-01-15', to: '2024-01-15', days: 1, reason: 'Fever', status: 'Approved' },
        { id: 3, type: 'Earned Leave', from: '2023-12-20', to: '2023-12-25', days: 6, reason: 'Vacation', status: 'Rejected' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
                    <p className="text-slate-500">Track your leave balances and history.</p>
                </div>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Apply for Leave
                </button>
            </div>

            {/* Balances */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {leaveBalances.map((leave, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-700 mb-4">{leave.type}</h3>
                        <div className="flex items-end justify-between mb-2">
                            <span className="text-3xl font-bold text-slate-900">{leave.total - leave.used}</span>
                            <span className="text-sm text-slate-500 mb-1">Available</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${leave.color}`}
                                style={{ width: `${(leave.used / leave.total) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">{leave.used} used of {leave.total}</p>
                    </div>
                ))}
            </div>

            {/* History */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900">Leave History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Type</th>
                                <th className="px-6 py-3 font-medium">Dates</th>
                                <th className="px-6 py-3 font-medium">Days</th>
                                <th className="px-6 py-3 font-medium">Reason</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leaveHistory.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{item.type}</td>
                                    <td className="px-6 py-4 text-slate-600">{item.from} to {item.to}</td>
                                    <td className="px-6 py-4 text-slate-600">{item.days}</td>
                                    <td className="px-6 py-4 text-slate-600">{item.reason}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {item.status === 'Approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                                            {item.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                                            {item.status === 'Rejected' && <XCircle className="w-3 h-3 mr-1" />}
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leave;
