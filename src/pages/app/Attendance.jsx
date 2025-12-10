import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const Attendance = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isCheckedIn, setIsCheckedIn] = useState(false);

    // Mock attendance data
    const attendanceHistory = [
        { id: 1, date: '2024-03-10', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present', hours: '9h 0m' },
        { id: 2, date: '2024-03-09', checkIn: '09:15 AM', checkOut: '06:15 PM', status: 'Present', hours: '9h 0m' },
        { id: 3, date: '2024-03-08', checkIn: '-', checkOut: '-', status: 'Absent', hours: '-' },
        { id: 4, date: '2024-03-07', checkIn: '08:55 AM', checkOut: '05:55 PM', status: 'Present', hours: '9h 0m' },
        { id: 5, date: '2024-03-06', checkIn: '09:05 AM', checkOut: '06:05 PM', status: 'Present', hours: '9h 0m' },
    ];

    const handleCheckIn = () => {
        setIsCheckedIn(!isCheckedIn);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
                    <p className="text-slate-500">Track your daily attendance and work hours.</p>
                </div>
                <div className="flex items-center space-x-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-right px-2">
                        <p className="text-xs text-slate-500 font-medium uppercase">Current Time</p>
                        <p className="text-lg font-bold text-slate-900 font-mono">
                            {currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    <button
                        onClick={handleCheckIn}
                        className={`px-6 py-2 rounded-lg font-bold text-white transition-all shadow-lg ${isCheckedIn
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                                : 'bg-green-500 hover:bg-green-600 shadow-green-500/30'
                            }`}
                    >
                        {isCheckedIn ? 'Check Out' : 'Check In'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar View (Mock) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center">
                            <CalendarIcon className="w-5 h-5 mr-2 text-primary-600" />
                            March 2024
                        </h2>
                        <div className="flex space-x-2">
                            <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-500">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-500">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Simple Calendar Grid Mockup */}
                    <div className="grid grid-cols-7 gap-2 text-center mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-xs font-medium text-slate-400 uppercase py-2">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                            <div
                                key={day}
                                className={`h-10 sm:h-14 rounded-lg flex items-center justify-center text-sm font-medium border ${day === 10
                                        ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/30'
                                        : [3, 17, 24, 31].includes(day) // Sundays
                                            ? 'bg-slate-50 text-slate-400 border-transparent'
                                            : 'bg-white text-slate-700 border-slate-100 hover:border-primary-200'
                                    }`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent History */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-primary-600" />
                        Recent History
                    </h2>
                    <div className="space-y-4">
                        {attendanceHistory.map((record) => (
                            <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{record.date}</p>
                                    <p className="text-xs text-slate-500">
                                        {record.checkIn} - {record.checkOut}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {record.status === 'Present' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                        {record.status}
                                    </span>
                                    <p className="text-xs text-slate-400 mt-1">{record.hours}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
