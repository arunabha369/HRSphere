import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Shield, Save, MapPin, Navigation, Loader2, CheckCircle } from 'lucide-react';
import client from '../../api/client';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');

    // Geofencing state
    const [geoForm, setGeoForm] = useState({ name: 'Headquarters', latitude: '', longitude: '', radiusMeters: 100 });
    const [geoLoading, setGeoLoading] = useState(false);
    const [geoSaving, setGeoSaving] = useState(false);
    const [geoSaved, setGeoSaved] = useState(false);
    const [geoError, setGeoError] = useState(null);

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
                                        <p className="text-sm text-blue-700">
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
                                                    placeholder="e.g. 22.5726"
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
                                                    placeholder="e.g. 88.3639"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={useCurrentLocation}
                                            className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                                        >
                                            <Navigation className="w-4 h-4" />
                                            Use my current location
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
                                            <p className="text-xs text-slate-400 mt-1">
                                                Employees within this radius of the office coordinates will be marked as "within zone".
                                            </p>
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    {geoForm.latitude && geoForm.longitude && (
                                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Preview</h4>
                                            <div className="grid grid-cols-3 gap-4 text-center">
                                                <div>
                                                    <p className="text-xs text-slate-400 uppercase">Latitude</p>
                                                    <p className="font-mono text-sm text-slate-900">{parseFloat(geoForm.latitude).toFixed(6)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400 uppercase">Longitude</p>
                                                    <p className="font-mono text-sm text-slate-900">{parseFloat(geoForm.longitude).toFixed(6)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400 uppercase">Radius</p>
                                                    <p className="font-mono text-sm text-slate-900">{geoForm.radiusMeters}m</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {geoError && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                                            {geoError}
                                        </div>
                                    )}

                                    {geoSaved && (
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-700 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Office location saved successfully!
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={activeTab === 'geofencing' ? handleGeoSave : undefined}
                            disabled={activeTab === 'geofencing' && geoSaving}
                            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-primary-500/30 disabled:opacity-50"
                        >
                            {geoSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            <span>{geoSaving ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
