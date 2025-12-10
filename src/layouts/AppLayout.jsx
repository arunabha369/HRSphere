import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, Calendar, Settings, LogOut,
    Menu, X, Bell, Search, Globe, CreditCard, TrendingUp, UserPlus,
    Coffee, Monitor, Receipt, BookOpen, Megaphone, BarChart
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, path, isActive }) => (
    <Link
        to={path}
        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
            ? 'bg-primary-50 text-primary-600 font-medium shadow-sm'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
    >
        <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
        <span>{label}</span>
    </Link>
);

const AppLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
        { icon: Users, label: 'Employees', path: '/app/employees' },
        { icon: Calendar, label: 'Attendance', path: '/app/attendance' },
        { icon: Coffee, label: 'Leave', path: '/app/leave' },
        { icon: CreditCard, label: 'Payroll', path: '/app/payroll' },
        { icon: TrendingUp, label: 'Performance', path: '/app/performance' },
        { icon: UserPlus, label: 'Recruitment', path: '/app/recruitment' },
        { icon: Monitor, label: 'Assets', path: '/app/assets' },
        { icon: Receipt, label: 'Expenses', path: '/app/expenses' },
        { icon: BookOpen, label: 'Training', path: '/app/training' },
        { icon: Megaphone, label: 'Announcements', path: '/app/announcements' },
        { icon: BarChart, label: 'Reports', path: '/app/reports' },
        { icon: Settings, label: 'Settings', path: '/app/settings' },
    ];

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-slate-100">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="bg-primary-600 p-1.5 rounded-lg">
                                <Globe className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">HRSphere</span>
                        </Link>
                    </div>

                    {/* Nav Items */}
                    <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                        {navItems.map((item) => (
                            <SidebarItem
                                key={item.path}
                                {...item}
                                isActive={location.pathname === item.path}
                            />
                        ))}
                    </div>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-slate-100">
                        <div className="flex items-center p-3 rounded-xl bg-slate-50 mb-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                {user.name ? user.name.charAt(0) : 'U'}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-slate-900">{user.name || 'User'}</p>
                                <p className="text-xs text-slate-500">{user.role || 'Employee'}</p>
                            </div>
                        </div>
                        <Link
                            to="/login"
                            className="flex items-center space-x-3 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden text-slate-500 hover:text-slate-700"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex-1 max-w-xl mx-4 lg:mx-8 hidden md:block">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                                placeholder="Search employees, documents..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default AppLayout;
