import React from 'react';
import { BarChart, PieChart, Download, Calendar } from 'lucide-react';

const Reports = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
                    <p className="text-slate-500">Data-driven insights for your organization.</p>
                </div>
                <div className="flex space-x-2">
                    <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium flex items-center hover:bg-slate-50">
                        <Calendar className="w-4 h-4 mr-2" />
                        Last 30 Days
                    </button>
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Headcount Chart */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center">
                        <BarChart className="w-5 h-5 mr-2 text-primary-600" />
                        Headcount Growth
                    </h3>
                    <div className="h-64 flex justify-between px-4 space-x-2">
                        {[45, 50, 52, 58, 62, 65, 70, 72, 75, 80, 85, 92].map((value, i) => (
                            <div key={i} className="w-full h-full flex flex-col justify-end items-center group">
                                <div
                                    className="w-full bg-primary-500 hover:bg-primary-600 transition-colors rounded-t-sm relative"
                                    style={{ height: `${value}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {value}
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 mt-2">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Department Distribution */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center">
                        <PieChart className="w-5 h-5 mr-2 text-purple-600" />
                        Department Distribution
                    </h3>
                    <div className="flex items-center justify-center h-64">
                        {/* Simple CSS Pie Chart representation */}
                        <div className="relative w-48 h-48 rounded-full bg-slate-100 border-8 border-white shadow-lg overflow-hidden">
                            <div className="absolute inset-0 bg-primary-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0)' }}></div>
                            <div className="absolute inset-0 bg-purple-500" style={{ clipPath: 'polygon(50% 50%, 0 0, 50% 0)' }}></div>
                            <div className="absolute inset-0 bg-green-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 40%)' }}></div>
                            <div className="absolute inset-0 bg-white rounded-full m-12 flex items-center justify-center">
                                <span className="font-bold text-slate-900 text-xl">Total<br />92</span>
                            </div>
                        </div>
                        <div className="ml-8 space-y-3">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
                                <span className="text-sm text-slate-600">Engineering (65%)</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                <span className="text-sm text-slate-600">Sales (20%)</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-sm text-slate-600">HR (15%)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance Stats */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">Attendance Overview</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-600 font-medium">Present Today</p>
                            <p className="text-2xl font-bold text-green-700">88%</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                            <p className="text-sm text-red-600 font-medium">Absent</p>
                            <p className="text-2xl font-bold text-red-700">4%</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-600 font-medium">On Leave</p>
                            <p className="text-2xl font-bold text-blue-700">6%</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                            <p className="text-sm text-orange-600 font-medium">Late Arrival</p>
                            <p className="text-2xl font-bold text-orange-700">2%</p>
                        </div>
                    </div>
                </div>

                {/* Salary Trends */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">Expense Trends</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Travel', amount: '₹45,000', pct: 70, color: 'bg-blue-500' },
                            { label: 'Software', amount: '₹28,000', pct: 45, color: 'bg-purple-500' },
                            { label: 'Office Supplies', amount: '₹12,000', pct: 20, color: 'bg-orange-500' },
                            { label: 'Meals', amount: '₹8,500', pct: 15, color: 'bg-green-500' },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700">{item.label}</span>
                                    <span className="font-bold text-slate-900">{item.amount}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
