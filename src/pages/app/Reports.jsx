import React, { useState, useEffect } from 'react';
import { BarChart, PieChart, Download, Calendar, Loader2 } from 'lucide-react';
import { useEmployees } from '../../context/EmployeeContext';
import client from '../../api/client';

const Reports = () => {
    const { employees } = useEmployees();
    const [expenses, setExpenses] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [expRes, attRes] = await Promise.allSettled([
                client.get('/expenses'),
                client.get('/attendance'),
            ]);
            if (expRes.status === 'fulfilled') setExpenses(expRes.value.data);
            if (attRes.status === 'fulfilled') setAttendance(attRes.value.data);
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    };

    // Department distribution
    const deptCounts = {};
    employees.forEach(e => {
        const dept = e.department || 'Other';
        deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });
    const deptColors = ['bg-primary-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500'];
    const deptEntries = Object.entries(deptCounts).sort((a, b) => b[1] - a[1]);

    // Expense breakdown by category
    const catTotals = {};
    expenses.forEach(e => {
        catTotals[e.category] = (catTotals[e.category] || 0) + (e.amount || 0);
    });
    const maxExpense = Math.max(...Object.values(catTotals), 1);
    const catColors = { Travel: 'bg-blue-500', Software: 'bg-purple-500', Office: 'bg-orange-500', Meals: 'bg-green-500', Other: 'bg-slate-500' };

    // Attendance overview
    const totalEmployees = employees.length || 1;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date && a.date.startsWith(todayStr));
    const presentCount = todayAttendance.filter(a => a.checkIn).length;
    const onLeaveCount = employees.filter(e => e.status === 'On Leave').length;
    const presentPct = Math.round((presentCount / totalEmployees) * 100);
    const leavePct = Math.round((onLeaveCount / totalEmployees) * 100);
    const absentPct = Math.max(0, 100 - presentPct - leavePct);

    // Monthly headcount (from employees joinDate)
    const monthlyCount = Array(12).fill(0);
    employees.forEach(e => {
        const joinDate = new Date(e.joinDate);
        if (joinDate.getFullYear() === new Date().getFullYear()) {
            monthlyCount[joinDate.getMonth()]++;
        }
    });
    // Cumulative
    let cum = employees.filter(e => new Date(e.joinDate) < new Date(new Date().getFullYear(), 0, 1)).length;
    const cumulativeHeadcount = monthlyCount.map(c => { cum += c; return cum; });
    const maxHeadcount = Math.max(...cumulativeHeadcount, 1);
    const formatCurrency = (n) => `₹${n.toLocaleString('en-IN')}`;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
            </div>
        );
    }

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
                        {cumulativeHeadcount.map((value, i) => {
                            const pct = (value / maxHeadcount) * 100;
                            return (
                                <div key={i} className="w-full h-full flex flex-col justify-end items-center group">
                                    <div
                                        className="w-full bg-primary-500 hover:bg-primary-600 transition-colors rounded-t-sm relative"
                                        style={{ height: `${pct}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {value}
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400 mt-2">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Department Distribution */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center">
                        <PieChart className="w-5 h-5 mr-2 text-purple-600" />
                        Department Distribution
                    </h3>
                    <div className="flex items-center justify-center h-64">
                        <div className="relative w-48 h-48 rounded-full bg-slate-100 border-8 border-white shadow-lg overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-primary-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0)' }}></div>
                            {deptEntries.length > 1 && <div className="absolute inset-0 bg-purple-500" style={{ clipPath: 'polygon(50% 50%, 0 0, 50% 0)' }}></div>}
                            {deptEntries.length > 2 && <div className="absolute inset-0 bg-green-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 40%)' }}></div>}
                            <div className="absolute inset-0 bg-white rounded-full m-12 flex items-center justify-center">
                                <span className="font-bold text-slate-900 text-xl text-center">Total<br />{employees.length}</span>
                            </div>
                        </div>
                        <div className="ml-8 space-y-3">
                            {deptEntries.map(([dept, count], i) => (
                                <div key={dept} className="flex items-center">
                                    <div className={`w-3 h-3 ${deptColors[i] || 'bg-slate-400'} rounded-full mr-2`}></div>
                                    <span className="text-sm text-slate-600">{dept} ({Math.round((count / totalEmployees) * 100)}%)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Attendance Stats */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">Attendance Overview</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-600 font-medium">Present Today</p>
                            <p className="text-2xl font-bold text-green-700">{presentPct}%</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                            <p className="text-sm text-red-600 font-medium">Absent</p>
                            <p className="text-2xl font-bold text-red-700">{absentPct}%</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-600 font-medium">On Leave</p>
                            <p className="text-2xl font-bold text-blue-700">{leavePct}%</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                            <p className="text-sm text-orange-600 font-medium">Total Tracked</p>
                            <p className="text-2xl font-bold text-orange-700">{attendance.length}</p>
                        </div>
                    </div>
                </div>

                {/* Expense Trends */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">Expense Trends</h3>
                    {Object.keys(catTotals).length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <p>No expense data available yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(catTotals).sort((a, b) => b[1] - a[1]).map(([cat, total]) => (
                                <div key={cat}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700">{cat}</span>
                                        <span className="font-bold text-slate-900">{formatCurrency(total)}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className={`h-2 rounded-full ${catColors[cat] || 'bg-slate-500'}`} style={{ width: `${(total / maxExpense) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;
