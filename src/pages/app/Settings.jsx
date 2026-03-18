import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Shield, Save, MapPin, Navigation, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import client from '../../api/client';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [globalSaving, setGlobalSaving] = useState(false);
    const [globalMessage, setGlobalMessage] = useState({ type: '', text: '' });
    const [initialLoading, setInitialLoading] = useState(true);

    // Profile & Preferences State
    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        bio: '',
        avatarUrl: '',
        preferences: {
            emailNotifications: true,
            pushNotifications: true,
            weeklyDigest: true,
            newEmployeeAlerts: true,
            twoFactorAuth: false
        }
    });

    const [passwordForm, setPasswordForm] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    // Geofencing state
    const [geoForm, setGeoForm] = useState({ name: 'Headquarters', latitude: '', longitude: '', radiusMeters: 100 });
    const [geoLoading, setGeoLoading] = useState(false);
    const [geoSaving, setGeoSaving] = useState(false);
    const [geoSaved, setGeoSaved] = useState(false);
    const [geoError, setGeoError] = useState(null);

    // Initial load: fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await client.get('/auth/me');
                setUserForm({
                    name: data.name || '',
                    email: data.email || '',
                    bio: data.bio || '',
                    avatarUrl: data.avatarUrl || '',
                    preferences: {
                        emailNotifications: data.preferences?.emailNotifications ?? true,
                        pushNotifications: data.preferences?.pushNotifications ?? true,
                        weeklyDigest: data.preferences?.weeklyDigest ?? true,
                        newEmployeeAlerts: data.preferences?.newEmployeeAlerts ?? true,
                        twoFactorAuth: data.preferences?.twoFactorAuth ?? false,
                    }
                });
            } catch (err) {
                console.error('Failed to load user settings');
            } finally {
                setInitialLoading(false);
            }
        };
        fetchUserData();
    }, []);

    // Fetch existing office location when Geofencing tab is opened
    useEffect(() => {
        if (activeTab === 'geofencing') {
            fetchOfficeLocation();
        }
    }, [activeTab]);

    const fetchOfficeLocation = async () => {
        setGeoLoading(true);
        try {
            const { data } = await client.get('/office-location');
            setGeoForm({
                name: data.name || 'Headquarters',
                latitude: data.latitude || '',
                longitude: data.longitude || '',
                radiusMeters: data.radiusMeters || 100,
            });
        } catch {
            // No location configured yet — use defaults
        } finally {
            setGeoLoading(false);
        }
    };

    const handleGeoSave = async () => {
        if (!geoForm.latitude || !geoForm.longitude) {
            setGeoError('Latitude and Longitude are required.');
            return;
        }
        setGeoSaving(true);
        setGeoError(null);
        setGeoSaved(false);
        try {
            await client.put('/office-location', {
                name: geoForm.name,
                latitude: parseFloat(geoForm.latitude),
                longitude: parseFloat(geoForm.longitude),
                radiusMeters: parseInt(geoForm.radiusMeters) || 100,
            });
            setGeoSaved(true);
            setTimeout(() => setGeoSaved(false), 3000);
        } catch (err) {
            setGeoError(err.response?.data?.message || 'Failed to save office location.');
        } finally {
            setGeoSaving(false);
        }
    };

    const useCurrentLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setGeoForm(prev => ({
                    ...prev,
                    latitude: pos.coords.latitude.toFixed(6),
                    longitude: pos.coords.longitude.toFixed(6),
                }));
            },
            () => setGeoError('Could not retrieve your current location.')
        );
    };

    const showMessage = (type, text) => {
        setGlobalMessage({ type, text });
        setTimeout(() => setGlobalMessage({ type: '', text: '' }), 4000);
    };

    const handleUserSettingsSave = async (e) => {
        e?.preventDefault();

        if (activeTab === 'security' && passwordForm.newPassword) {
            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                showMessage('error', 'Passwords do not match.');
                return;
            }
        }

        setGlobalSaving(true);
        try {
            const payload = {
                name: userForm.name,
                email: userForm.email,
                bio: userForm.bio,
                avatarUrl: userForm.avatarUrl,
                preferences: userForm.preferences
            };
            
            if (passwordForm.newPassword) {
                payload.password = passwordForm.newPassword;
            }

            const { data } = await client.put('/auth/me', payload);
            
            // Update local storage so header re-renders if name changed
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...currentUser, ...data }));
            
            // Dispatch a storage event manually so other tabs/components notice immediately
            window.dispatchEvent(new Event('storage'));

            if (passwordForm.newPassword) {
                 setPasswordForm({ newPassword: '', confirmPassword: '' });
                 showMessage('success', 'Password updated successfully!');
            } else {
                 showMessage('success', 'Settings saved successfully!');
            }
        } catch (err) {
            showMessage('error', err.response?.data?.message || 'Failed to update settings.');
        } finally {
            setGlobalSaving(false);
        }
    };

    const handlePrefToggle = (key) => {
        setUserForm(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [key]: !prev.preferences[key]
            }
        }));
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    const { name, email, bio, preferences } = userForm;
    const names = name.split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';

    // Handle form submission via enter key for non-textareas
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleUserSettingsSave();
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Settings</h1>
                    <p className="text-slate-500">Manage your account settings and preferences.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                {/* Sidebar */}
                <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-4">
                    <nav className="space-y-1">
                        {[
                            { id: 'profile', label: 'My Profile', icon: User },
                            { id: 'notifications', label: 'Notifications', icon: Bell },
                            { id: 'security', label: 'Security', icon: Lock },
                            { id: 'privacy', label: 'Privacy', icon: Shield },
                            { id: 'geofencing', label: 'Geofencing', icon: MapPin },
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
                <div className="flex-1 p-6 md:p-8 flex flex-col">
                    
                    {globalMessage.text && activeTab !== 'geofencing' && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${
                            globalMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                            {globalMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {globalMessage.text}
                        </div>
                    )}

                    <div className="flex-1">
                        {activeTab === 'profile' && (
                            <form onKeyDown={handleKeyDown} className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 mb-1">Profile Information</h2>
                                    <p className="text-sm text-slate-500">Update your photo and personal details.</p>
                                </div>

                                <div className="flex items-center space-x-6">
                                    <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-600 shadow-sm border border-primary-200 overflow-hidden">
                                        {userForm.avatarUrl ? (
                                             <img src={userForm.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            (name.charAt(0) || 'U').toUpperCase()
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <button type="button" onClick={() => {
                                            const url = prompt("Enter image URL:");
                                            if (url) setUserForm(prev => ({ ...prev, avatarUrl: url }));
                                        }} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors block">
                                            Change Photo
                                        </button>
                                        <p className="text-xs text-slate-400">Direct image URL (JPG, PNG)</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                        <input type="text" value={name} onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="Your full name" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                        <input type="email" value={email} onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                                        <textarea rows="4" value={bio} onChange={(e) => setUserForm(prev => ({ ...prev, bio: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="Tell us a little bit about yourself..."></textarea>
                                    </div>
                                </div>
                            </form>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 mb-1">Notification Preferences</h2>
                                    <p className="text-sm text-slate-500">Choose what you want to be notified about.</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { id: 'emailNotifications', label: 'Email Notifications', desc: 'Receive emails about your account activity.' },
                                        { id: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications on your mobile device.' },
                                        { id: 'weeklyDigest', label: 'Weekly Digest', desc: 'Get a weekly summary of your team\'s performance.' },
                                        { id: 'newEmployeeAlerts', label: 'New Employee Alerts', desc: 'Get notified when a new employee joins.' }
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 p-2 rounded-lg transition-colors">
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-900">{item.label}</h3>
                                                <p className="text-sm text-slate-500">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={preferences[item.id]} onChange={() => handlePrefToggle(item.id)} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <form onKeyDown={handleKeyDown} className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 mb-1">Security Settings</h2>
                                    <p className="text-sm text-slate-500">Keep your account secure.</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h3 className="text-md font-bold text-slate-900 mb-4">Change Password</h3>
                                    <div className="space-y-4 max-w-sm">
                                         <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                            <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                        </div>
                                         <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                                            <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h3 className="text-md font-bold text-slate-900 mb-4">Extra Security</h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                                            <p className="text-sm text-slate-500">Require an extra step during login.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={preferences.twoFactorAuth} onChange={() => handlePrefToggle('twoFactorAuth')} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </form>
                        )}
                        
                        {activeTab === 'privacy' && (
                             <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 mb-1">Privacy & Data Requests</h2>
                                    <p className="text-sm text-slate-500">Manage how your data is handled.</p>
                                </div>
                                
                                <div className="space-y-4">
                                     <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h4 className="font-bold text-slate-900">Request Data Export</h4>
                                            <p className="text-sm text-slate-500 mt-1">Download a copy of all your HR records, attendance, and payroll data.</p>
                                        </div>
                                        <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 bg-white shadow-sm whitespace-nowrap">Request Export</button>
                                     </div>
                                     <div className="p-5 border border-red-200 rounded-xl bg-red-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h4 className="font-bold text-red-900">Delete Account</h4>
                                            <p className="text-sm text-red-700 mt-1">Permanently remove your account and all associated data. This action cannot be undone.</p>
                                        </div>
                                        <button className="px-4 py-2 bg-red-600 border border-transparent rounded-lg text-white font-medium hover:bg-red-700 shadow-sm shadow-red-500/20 whitespace-nowrap">Delete Account</button>
                                     </div>
                                </div>
                             </div>
                        )}

                        {activeTab === 'geofencing' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-primary-600" />
                                        Geofencing Configuration
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Set the office location and radius for GPS-verified attendance check-ins.
                                    </p>
                                </div>

                                {geoLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <p className="text-sm text-blue-800">
                                                <strong>How it works:</strong> Employees must share their GPS location when checking in or out. 
                                                If they're outside the configured radius, the check-in is still recorded but flagged for review.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Office Name</label>
                                                <input
                                                    type="text"
                                                    value={geoForm.name}
                                                    onChange={(e) => setGeoForm(prev => ({ ...prev, name: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                                                    placeholder="e.g. Headquarters"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={geoForm.latitude}
                                                        onChange={(e) => setGeoForm(prev => ({ ...prev, latitude: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none font-mono"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={geoForm.longitude}
                                                        onChange={(e) => setGeoForm(prev => ({ ...prev, longitude: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none font-mono"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                onClick={useCurrentLocation}
                                                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium bg-primary-50 px-3 py-2 rounded-lg w-max"
                                            >
                                                <Navigation className="w-4 h-4" />
                                                Locate me automatically
                                            </button>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Allowed Radius (meters)</label>
                                                <input
                                                    type="number"
                                                    value={geoForm.radiusMeters}
                                                    onChange={(e) => setGeoForm(prev => ({ ...prev, radiusMeters: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                                                    placeholder="100"
                                                />
                                            </div>
                                        </div>

                                        {geoError && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-center gap-2 mt-4">
                                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                                {geoError}
                                            </div>
                                        )}

                                        {geoSaved && (
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-700 flex items-center gap-2 mt-4">
                                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                                Office coordinates updated. Geofencing is active.
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Global Save Button (excluding auto-save tabs or non-applicable like privacy) */}
                    {['profile', 'notifications', 'security'].includes(activeTab) && (
                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={handleUserSettingsSave}
                                disabled={globalSaving}
                                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-primary-500/20 disabled:opacity-50"
                            >
                                {globalSaving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                <span>{globalSaving ? 'Saving...' : 'Save Configuration'}</span>
                            </button>
                        </div>
                    )}
                     
                    {/* Geofencing has its own save button */}
                     {activeTab === 'geofencing' && (
                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={handleGeoSave}
                                disabled={geoSaving}
                                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-primary-500/20 disabled:opacity-50"
                            >
                                {geoSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>{geoSaving ? 'Saving map data...' : 'Save Geofence'}</span>
                            </button>
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
