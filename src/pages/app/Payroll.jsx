import React, { useState, useEffect } from 'react';
import { DollarSign, Download, FileText, TrendingUp, CreditCard, Loader2, Calendar } from 'lucide-react';
import client from '../../api/client';

const Payroll = () => {
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayrolls();
    }, []);

    const fetchPayrolls = async () => {
        setLoading(true);
        try {
            const { data } = await client.get('/payroll');
            setPayrolls(data);
        } catch {
            setPayrolls([]);
        } finally {
            setLoading(false);
        }
    };

    const totalCost = payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);
    const paidCount = payrolls.filter(p => p.status === 'Paid').length;

    const formatCurrency = (n) => `₹${n.toLocaleString('en-IN')}`;

    const formatMonth = (p) => p.month ? `${p.month} ${p.year || ''}`.trim() : '-';

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
                    <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalCost)}</p>
                    <p className="text-sm text-slate-500 mt-1">{payrolls.length} records total</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-700">Paid Slips</h3>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Calendar className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{paidCount}</p>
                    <p className="text-sm text-slate-500 mt-1">of {payrolls.length} processed</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-700">Pending</h3>
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                            <CreditCard className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{payrolls.length - paidCount}</p>
                    <p className="text-sm text-slate-500 mt-1">awaiting processing</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900">Salary Slips</h3>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                    </div>
                ) : payrolls.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                        <p>No payroll records found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {payrolls.map((slip) => (
                            <div key={slip._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{formatMonth(slip)}</p>
                                        <p className="text-sm text-slate-500">
                                            {slip.paymentDate ? `Paid on ${new Date(slip.paymentDate).toLocaleDateString()}` : 'Not yet paid'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <span className="font-mono font-bold text-slate-900">{formatCurrency(slip.netSalary || 0)}</span>
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                        slip.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                        slip.status === 'Processed' ? 'bg-blue-100 text-blue-700' :
                                        'bg-slate-100 text-slate-700'
                                    }`}>{slip.status}</span>
                                    <button className="text-primary-600 hover:text-primary-700 p-2 hover:bg-primary-50 rounded-lg transition-colors">
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payroll;
