import React from 'react';
import { useEmployees } from '../../context/EmployeeContext';
import { Users, UserCheck, UserMinus, UserPlus, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                <TrendingUp className="w-4 h-4 mr-1" />
                {Math.abs(trend)}%
            </span>
        </div>
        <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
        <p className="text-slate-500 text-sm">{label}</p>
    </div>
);

const Dashboard = () => {
    const { stats, employees, loading } = useEmployees();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
    }

    // Mock recent activity based on employees
    const recentActivity = [
        { id: 0, user: user.name || 'You', action: 'joined the team', time: 'Just now' },
        { id: 1, user: 'Alice Johnson', action: 'requested leave', time: '2 hours ago' },
        { id: 2, user: 'Bob Smith', action: 'completed onboarding', time: '4 hours ago' },
        { id: 3, user: 'System', action: 'processed payroll', time: '1 day ago' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name || 'User'} 👋</h1>
                <p className="text-slate-500">Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    label="Total Employees"
                    value={stats.total}
                    trend={12}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={UserCheck}
                    label="Active Now"
                    value={stats.active}
                    trend={5}
                    color="bg-green-500"
                />
                <StatCard
                    icon={UserMinus}
                    label="On Leave"
                    value={stats.onLeave}
                    trend={-2}
                    color="bg-orange-500"
                />
                <StatCard
                    icon={UserPlus}
                    label="New Hires"
                    value={stats.newHires}
                    trend={8}
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold mr-4">
                                    {activity.user.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-900">
                                        <span className="font-medium">{activity.user}</span> {activity.action}
                                    </p>
                                    <p className="text-xs text-slate-500">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions or Info */}
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 rounded-xl text-white shadow-lg">
                    <h2 className="text-lg font-bold mb-2">Upgrade to Pro</h2>
                    <p className="text-blue-100 text-sm mb-6">Unlock advanced analytics and unlimited employee seats.</p>
                    <button className="w-full py-2 bg-white text-primary-700 font-bold rounded-lg hover:bg-blue-50 transition-colors">
                        View Plans
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
