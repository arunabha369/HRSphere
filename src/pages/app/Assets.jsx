import React from 'react';
import { Monitor, Smartphone, HardDrive, Plus, Search } from 'lucide-react';

const Assets = () => {
    const assets = [
        { id: 'AST-001', name: 'MacBook Pro M2', type: 'Laptop', assignedTo: 'Aarav Sharma', assignedDate: '2023-01-15', status: 'In Use' },
        { id: 'AST-002', name: 'Dell UltraSharp 27"', type: 'Monitor', assignedTo: 'Diya Patel', assignedDate: '2023-02-20', status: 'In Use' },
        { id: 'AST-003', name: 'iPhone 14', type: 'Mobile', assignedTo: 'Vihaan Gupta', assignedDate: '2022-11-10', status: 'In Use' },
        { id: 'AST-004', name: 'Logitech MX Master 3', type: 'Peripheral', assignedTo: 'Aarav Sharma', assignedDate: '2023-01-15', status: 'In Use' },
        { id: 'AST-005', name: 'MacBook Air M1', type: 'Laptop', assignedTo: null, assignedDate: null, status: 'Available' },
    ];

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
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Asset
                </button>
            </div>

            {/* Filters */}
            <div className="flex space-x-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <select className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                    <option>All Types</option>
                    <option>Laptop</option>
                    <option>Monitor</option>
                    <option>Mobile</option>
                </select>
                <select className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                    <option>All Status</option>
                    <option>In Use</option>
                    <option>Available</option>
                    <option>Maintenance</option>
                </select>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map((asset) => (
                    <div key={asset.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-100 rounded-lg text-slate-600">
                                {getIcon(asset.type)}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${asset.status === 'Available' ? 'bg-green-100 text-green-700' :
                                    asset.status === 'In Use' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                {asset.status}
                            </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">{asset.name}</h3>
                        <p className="text-xs text-slate-400 mb-4">{asset.id}</p>

                        <div className="pt-4 border-t border-slate-100 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Type</span>
                                <span className="font-medium text-slate-900">{asset.type}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Assigned To</span>
                                <span className="font-medium text-slate-900">{asset.assignedTo || '-'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Date</span>
                                <span className="font-medium text-slate-900">{asset.assignedDate || '-'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Assets;
