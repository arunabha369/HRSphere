import React, { useState } from 'react';
import { User, Bell, Lock, Shield, Save } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Settings</h1>
            <p className="text-slate-500 mb-8">Manage your account settings and preferences.</p>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                {/* Sidebar */}
                <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-4">
                    <nav className="space-y-1">
                        {[
                            { id: 'profile', label: 'My Profile', icon: User },
                            { id: 'notifications', label: 'Notifications', icon: Bell },
                            { id: 'security', label: 'Security', icon: Lock },
                            { id: 'privacy', label: 'Privacy', icon: Shield },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                                    ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 md:p-8">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 mb-1">Profile Information</h2>
                                <p className="text-sm text-slate-500">Update your photo and personal details.</p>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-600">
                                    JD
                                </div>
                                <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                    Change Photo
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                                    <input type="text" defaultValue="John" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                                    <input type="text" defaultValue="Doe" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                    <input type="email" defaultValue="john.doe@hrsphere.com" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                                    <textarea rows="4" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" defaultValue="Senior Administrator at HRSphere."></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 mb-1">Notification Preferences</h2>
                                <p className="text-sm text-slate-500">Choose what you want to be notified about.</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { label: 'Email Notifications', desc: 'Receive emails about your account activity.' },
                                    { label: 'Push Notifications', desc: 'Receive push notifications on your mobile device.' },
                                    { label: 'Weekly Digest', desc: 'Get a weekly summary of your team\'s performance.' },
                                    { label: 'New Employee Alerts', desc: 'Get notified when a new employee joins.' }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                                        <div>
                                            <h3 className="text-sm font-medium text-slate-900">{item.label}</h3>
                                            <p className="text-sm text-slate-500">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Password & Authentication</h3>
                                <div className="space-y-4">
                                    <button className="text-primary-600 font-medium hover:underline">Change Password</button>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                                            <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">System Administration</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-slate-900">Roles & Permissions</p>
                                            <p className="text-sm text-slate-500">Manage access levels for employees.</p>
                                        </div>
                                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">Manage Roles</button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-slate-900">Audit Logs</p>
                                            <p className="text-sm text-slate-500">View system activity and security events.</p>
                                        </div>
                                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">View Logs</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <button className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-primary-500/30">
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
