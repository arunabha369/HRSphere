import React, { useState, useEffect } from 'react';
import { useEmployees } from '../../context/EmployeeContext';
import {
    Users, UserCheck, UserMinus, UserPlus, TrendingUp, TrendingDown,
    Loader2, Calendar, Clock, MapPin, Receipt, Briefcase, Bell,
    ArrowUpRight, ArrowDownRight, ChevronRight, Activity,
    CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import client from '../../api/client';

/* ───────── Animated Stat Card ───────── */
const StatCard = ({ icon: Icon, label, value, trend, color, gradient }) => (
    <div className={`relative overflow-hidden p-6 rounded-2xl shadow-sm border border-white/20 ${gradient}`}>
        {/* Decorative blob */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-md"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5"></div>

        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                    <Icon className="w-5 h-5 text-white" />
                </div>
                {trend !== undefined && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
                        trend >= 0 ? 'bg-white/20 text-white' : 'bg-white/20 text-white'
                    }`}>
                        {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <h3 className="text-3xl font-extrabold text-white mb-1 tracking-tight">{value}</h3>
            <p className="text-white/70 text-sm font-medium">{label}</p>
        </div>
    </div>
);

/* ───────── Mini Ring Chart ───────── */
const RingChart = ({ percentage, color, size = 56, strokeWidth = 5 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
                stroke="currentColor" strokeWidth={strokeWidth} className="text-slate-100" />
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
                stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
    );
};

/* ───────── Dashboard Component ───────── */
const Dashboard = () => {
    const { stats, employees, loading } = useEmployees();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [recentLeaves, setRecentLeaves] = useState([]);
    const [recentAnnouncements, setRecentAnnouncements] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    /* Live clock */
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    /* Fetch all dashboard data */
    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setDataLoading(true);
        try {
            const [leavesRes, annRes, expRes, attRes] = await Promise.allSettled([
                client.get('/leave'),
                client.get('/announcements'),
                client.get('/expenses'),
                client.get('/attendance'),
            ]);
            if (leavesRes.status === 'fulfilled') setRecentLeaves(leavesRes.value.data);
            if (annRes.status === 'fulfilled') setRecentAnnouncements(annRes.value.data);
            if (expRes.status === 'fulfilled') setExpenses(expRes.value.data);
            if (attRes.status === 'fulfilled') setAttendance(attRes.value.data);
        } catch { /* silent */ }
        finally { setDataLoading(false); }
    };

    const timeAgo = (date) => {
        if (!date) return '';
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return days === 1 ? 'Yesterday' : `${days}d ago`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    /* ─── Derived data ─── */
    const hour = currentTime.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    // Department breakdown
    const deptCounts = {};
    employees.forEach(e => { deptCounts[e.department || 'Other'] = (deptCounts[e.department || 'Other'] || 0) + 1; });
    const deptEntries = Object.entries(deptCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const deptColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

    // Attendance Today
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date && a.date.startsWith(todayStr));
    const presentToday = todayAttendance.filter(a => a.checkIn).length;
    const totalEmp = employees.length || 1;
    const presentPct = Math.round((presentToday / totalEmp) * 100);

    // Expense summary (current month)
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const monthExpenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });
    const totalExpenseMonth = monthExpenses.reduce((s, e) => s + (e.amount || 0), 0);
    const pendingExpenses = monthExpenses.filter(e => e.status === 'Pending').length;

    // Pending leaves
    const pendingLeaves = recentLeaves.filter(l => l.status === 'Pending');

    // Activity feed
    const activityItems = [
        ...recentLeaves.slice(0, 4).map(l => ({
            id: `leave-${l._id}`,
            user: l.employee?.name || 'Employee',
            action: `applied for ${l.type}`,
            time: timeAgo(l.appliedOn || l.createdAt),
            icon: Calendar,
            color: 'text-blue-500 bg-blue-50',
        })),
        ...recentAnnouncements.slice(0, 3).map(a => ({
            id: `ann-${a._id}`,
            user: a.author?.name || 'Admin',
            action: `posted "${a.title}"`,
            time: timeAgo(a.createdAt),
            icon: Bell,
            color: 'text-purple-500 bg-purple-50',
        })),
    ].slice(0, 6);

    if (activityItems.length === 0) {
        activityItems.push({
            id: 'welcome', user: user.name || 'You', action: 'joined the team 🎉',
            time: 'Just now', icon: UserPlus, color: 'text-green-500 bg-green-50',
        });
    }

    // Weekly attendance sparkline (last 7 days)
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const ds = d.toISOString().split('T')[0];
        const count = attendance.filter(a => a.date && a.date.startsWith(ds) && a.checkIn).length;
        weekData.push({ day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()], count });
    }
    const maxWeek = Math.max(...weekData.map(w => w.count), 1);

    const formatCurrency = (n) => `₹${n.toLocaleString('en-IN')}`;

    return (
        <div className="space-y-6">
            {/* ─── Welcome Header ─── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        {greeting}, {(user.name || 'User').split(' ')[0]} 👋
                    </h1>
                    <p className="text-slate-500 mt-1">Here's what's happening across your organization today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary-500" />
                        <span className="font-mono text-sm font-bold text-slate-900">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary-500" />
                        <span className="text-sm font-medium text-slate-700">
                            {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* ─── Stat Cards ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard icon={Users} label="Total Employees" value={stats.total}
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
                <StatCard icon={UserCheck} label="Active Now" value={stats.active} trend={stats.total ? Math.round((stats.active / stats.total) * 100) : 0}
                    gradient="bg-gradient-to-br from-emerald-500 to-emerald-600" />
                <StatCard icon={UserMinus} label="On Leave" value={stats.onLeave}
                    gradient="bg-gradient-to-br from-amber-500 to-orange-500" />
                <StatCard icon={UserPlus} label="New Hires (30d)" value={stats.newHires} trend={stats.newHires > 0 ? 100 : 0}
                    gradient="bg-gradient-to-br from-violet-500 to-purple-600" />
            </div>

            {/* ─── Middle Row: Attendance + Department + Expenses ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Attendance Overview */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary-500" />
                            Attendance Today
                        </h2>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Live</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative flex items-center justify-center">
                            <RingChart percentage={presentPct} color="#3b82f6" size={80} strokeWidth={7} />
                            <span className="absolute text-lg font-extrabold text-slate-900">{presentPct}%</span>
                        </div>
                        <div className="space-y-2 flex-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Present</span>
                                <span className="font-bold text-slate-900">{presentToday}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">On Leave</span>
                                <span className="font-bold text-slate-900">{stats.onLeave}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Absent</span>
                                <span className="font-bold text-slate-900">{Math.max(0, totalEmp - presentToday - stats.onLeave)}</span>
                            </div>
                        </div>
                    </div>
                    {/* Weekly sparkline */}
                    <div className="mt-5 pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-400 mb-3 font-medium">Last 7 Days</p>
                        <div className="flex items-end justify-between gap-1.5 h-16">
                            {weekData.map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <div className="w-full rounded-t-md bg-primary-100 relative" style={{ height: '100%' }}>
                                        <div
                                            className="absolute bottom-0 w-full rounded-t-md bg-primary-500 transition-all duration-700"
                                            style={{ height: `${(d.count / maxWeek) * 100}%`, minHeight: d.count > 0 ? '4px' : '0px' }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium">{d.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Department Distribution */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-purple-500" />
                        Department Breakdown
                    </h2>
                    <div className="space-y-4">
                        {deptEntries.map(([dept, count], i) => {
                            const pct = Math.round((count / totalEmp) * 100);
                            return (
                                <div key={dept}>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-sm font-medium text-slate-700">{dept}</span>
                                        <span className="text-xs font-semibold text-slate-500">{count} ({pct}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all duration-700"
                                            style={{ width: `${pct}%`, backgroundColor: deptColors[i] || '#94a3b8' }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                        {deptEntries.length === 0 && (
                            <p className="text-sm text-slate-400 text-center py-4">No department data yet</p>
                        )}
                    </div>
                </div>

                {/* Expenses Summary */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-emerald-500" />
                        Expenses This Month
                    </h2>
                    <div className="text-center mb-4">
                        <p className="text-3xl font-extrabold text-slate-900">{formatCurrency(totalExpenseMonth)}</p>
                        <p className="text-sm text-slate-500 mt-1">{monthExpenses.length} claims filed</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-amber-50 rounded-xl p-3 text-center">
                            <p className="text-2xl font-bold text-amber-600">{pendingExpenses}</p>
                            <p className="text-xs text-amber-700 font-medium">Pending</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-3 text-center">
                            <p className="text-2xl font-bold text-green-600">{monthExpenses.length - pendingExpenses}</p>
                            <p className="text-xs text-green-700 font-medium">Processed</p>
                        </div>
                    </div>
                    {/* Pending Leave Requests */}
                    <div className="mt-5 pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Pending Leave Requests</p>
                        {pendingLeaves.length === 0 ? (
                            <p className="text-sm text-slate-400">No pending requests</p>
                        ) : (
                            <div className="space-y-2">
                                {pendingLeaves.slice(0, 3).map(l => (
                                    <div key={l._id} className="flex items-center justify-between py-1.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                                                <AlertCircle className="w-3 h-3 text-orange-500" />
                                            </div>
                                            <span className="text-sm text-slate-700 font-medium">{l.employee?.name || 'Employee'}</span>
                                        </div>
                                        <span className="text-xs text-slate-400">{l.type}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── Bottom Row: Activity Feed + Quick Actions ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-primary-500" />
                            Recent Activity
                        </h2>
                        <span className="text-xs text-slate-400 font-medium">Latest updates</span>
                    </div>
                    {dataLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {activityItems.map((item) => {
                                const ItemIcon = item.icon;
                                return (
                                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                        <div className={`p-2 rounded-lg ${item.color}`}>
                                            <ItemIcon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-slate-800 truncate">
                                                <span className="font-semibold">{item.user}</span>{' '}{item.action}
                                            </p>
                                        </div>
                                        <span className="text-xs text-slate-400 flex-shrink-0">{item.time}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="space-y-5">
                    <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6"></div>
                        <div className="relative z-10">
                            <h2 className="text-lg font-bold mb-1">Quick Overview</h2>
                            <p className="text-blue-200 text-sm mb-5">Today's snapshot</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                                    <p className="text-2xl font-extrabold">{presentToday}</p>
                                    <p className="text-blue-200 text-xs font-medium">Checked In</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                                    <p className="text-2xl font-extrabold">{pendingLeaves.length}</p>
                                    <p className="text-blue-200 text-xs font-medium">Leave Pending</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                                    <p className="text-2xl font-extrabold">{pendingExpenses}</p>
                                    <p className="text-blue-200 text-xs font-medium">Exp. Pending</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                                    <p className="text-2xl font-extrabold">{recentAnnouncements.length}</p>
                                    <p className="text-blue-200 text-xs font-medium">Announcements</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Announcements Preview */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                            <Bell className="w-4 h-4 text-purple-500" />
                            Latest Announcements
                        </h3>
                        {recentAnnouncements.length === 0 ? (
                            <p className="text-sm text-slate-400">No announcements</p>
                        ) : (
                            <div className="space-y-3">
                                {recentAnnouncements.slice(0, 2).map(a => (
                                    <div key={a._id} className="group cursor-pointer">
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-primary-600 transition-colors">{a.title}</p>
                                                <p className="text-xs text-slate-400">{timeAgo(a.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
