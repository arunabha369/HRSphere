import React, { useState, useEffect } from 'react';
import { useEmployees } from '../../context/EmployeeContext';
import { Users, UserCheck, UserMinus, UserPlus, TrendingUp, Loader2 } from 'lucide-react';
import client from '../../api/client';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            {trend !== undefined && (
                <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {Math.abs(trend)}%
                </span>
            )}
        </div>
        <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
        <p className="text-slate-500 text-sm">{label}</p>
    </div>
);

const Dashboard = () => {
    const { stats, employees, loading } = useEmployees();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [recentLeaves, setRecentLeaves] = useState([]);
    const [recentAnnouncements, setRecentAnnouncements] = useState([]);
    const [activityLoading, setActivityLoading] = useState(true);

    useEffect(() => {
        fetchActivity();
    }, []);

    const fetchActivity = async () => {
        setActivityLoading(true);
        try {
            const [leavesRes, announcementsRes] = await Promise.allSettled([
                client.get('/leave'),
                client.get('/announcements'),
            ]);
            if (leavesRes.status === 'fulfilled') setRecentLeaves(leavesRes.value.data.slice(0, 3));
            if (announcementsRes.status === 'fulfilled') setRecentAnnouncements(announcementsRes.value.data.slice(0, 3));
        } catch {
            // Silent fallback
        } finally {
            setActivityLoading(false);
        }
    };

    const timeAgo = (date) => {
        if (!date) return '';
        const diff = Date.now() - new Date(date).getTime();
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days === 1) return '1 day ago';
        return `${days} days ago`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
            </div>
        );
    }

    // Build activity feed from real data
    const activityItems = [
        ...recentLeaves.map(l => ({
            id: `leave-${l._id}`,
            user: l.employee?.name || 'Employee',
            action: `applied for ${l.type}`,
            time: timeAgo(l.appliedOn || l.createdAt),
        })),
        ...recentAnnouncements.map(a => ({
            id: `ann-${a._id}`,
            user: a.author?.name || 'Admin',
            action: `posted "${a.title}"`,
            time: timeAgo(a.createdAt),
        })),
    ].slice(0, 5);

    // Fallback if no real activity
    if (activityItems.length === 0) {
        activityItems.push({ id: 'welcome', user: user.name || 'You', action: 'joined the team', time: 'Just now' });
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name || 'User'} 👋</h1>
                <p className="text-slate-500">Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Total Employees" value={stats.total} trend={12} color="bg-blue-500" />
                <StatCard icon={UserCheck} label="Active Now" value={stats.active} trend={5} color="bg-green-500" />
                <StatCard icon={UserMinus} label="On Leave" value={stats.onLeave} trend={-2} color="bg-orange-500" />
                <StatCard icon={UserPlus} label="New Hires" value={stats.newHires} trend={8} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h2>
                    {activityLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activityItems.map((activity) => (
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
                    )}
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
