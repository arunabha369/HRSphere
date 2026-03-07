import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, HardDrive, Plus, Search, X, Loader2 } from 'lucide-react';
import client from '../../api/client';

const Assets = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ assetId: '', name: '', type: 'Laptop', purchaseDate: '', value: '' });

    useEffect(() => { fetchAssets(); }, []);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const { data } = await client.get('/assets');
            setAssets(data);
        } catch {
            setAssets([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await client.post('/assets', {
                ...formData,
                value: Number(formData.value),
            });
            setIsModalOpen(false);
            setFormData({ assetId: '', name: '', type: 'Laptop', purchaseDate: '', value: '' });
            fetchAssets();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add asset.');
        } finally {
            setSubmitting(false);
        }
    };

    const filtered = assets.filter(a => {
        const matchSearch = a.name?.toLowerCase().includes(searchTerm.toLowerCase()) || a.assetId?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = typeFilter === 'All' || a.type === typeFilter;
        const matchStatus = statusFilter === 'All' || a.status === statusFilter;
        return matchSearch && matchType && matchStatus;
    });

    const getIcon = (type) => {
        switch (type) {
            case 'Laptop': return <Monitor className="w-5 h-5" />;
            case 'Mobile': return <Smartphone className="w-5 h-5" />;
            default: return <HardDrive className="w-5 h-5" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Asset Management</h1>
                    <p className="text-slate-500">Track company assets and assignments.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Asset
                </button>
            </div>

            {/* Filters */}
            <div className="flex space-x-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="text" placeholder="Search assets..." value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
                    className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                    <option value="All">All Types</option>
                    <option>Laptop</option><option>Monitor</option><option>Mobile</option><option>Peripheral</option><option>Furniture</option>
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                    <option value="All">All Status</option>
                    <option>In Use</option><option>Available</option><option>Maintenance</option>
                </select>
            </div>

            {/* Assets Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
                    <Monitor className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p>No assets found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((asset) => (
                        <div key={asset._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-100 rounded-lg text-slate-600">{getIcon(asset.type)}</div>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    asset.status === 'Available' ? 'bg-green-100 text-green-700' :
                                    asset.status === 'In Use' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                }`}>{asset.status}</span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-1">{asset.name}</h3>
                            <p className="text-xs text-slate-400 mb-4">{asset.assetId}</p>
                            <div className="pt-4 border-t border-slate-100 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Type</span>
                                    <span className="font-medium text-slate-900">{asset.type}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Assigned To</span>
                                    <span className="font-medium text-slate-900">{asset.assignedTo?.name || '-'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Date</span>
                                    <span className="font-medium text-slate-900">{asset.assignedDate ? new Date(asset.assignedDate).toLocaleDateString() : '-'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Asset Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-slate-900/75" onClick={() => setIsModalOpen(false)}></div>
                        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-900">Add New Asset</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500"><X className="w-6 h-6" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Asset ID</label>
                                    <input required type="text" value={formData.assetId}
                                        onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="AST-006" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                    <input required type="text" value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                        <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none">
                                            <option>Laptop</option><option>Monitor</option><option>Mobile</option><option>Peripheral</option><option>Furniture</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Value (₹)</label>
                                        <input type="number" value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Cancel</button>
                                    <button type="submit" disabled={submitting}
                                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-lg shadow-primary-500/30 disabled:opacity-50 flex items-center">
                                        {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                        Add Asset
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assets;
