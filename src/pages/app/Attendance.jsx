import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar as CalendarIcon, Clock, CheckCircle, XCircle,
    ChevronLeft, ChevronRight, MapPin, Navigation, Shield,
    ShieldAlert, Loader2, AlertTriangle, Wifi, WifiOff
} from 'lucide-react';
import client from '../../api/client';

const Attendance = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [todayRecord, setTodayRecord] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [markLoading, setMarkLoading] = useState(false);
    const [error, setError] = useState(null);
    const [officeLocation, setOfficeLocation] = useState(null);

    // Geolocation state
    const [geoStatus, setGeoStatus] = useState('idle'); // idle | acquiring | acquired | denied | unavailable
    const [userCoords, setUserCoords] = useState(null);
    const [distanceFromOffice, setDistanceFromOffice] = useState(null);
    const [withinGeofence, setWithinGeofence] = useState(null);
    const [lastGeofenceResult, setLastGeofenceResult] = useState(null);

    // Live clock
    const [liveTime, setLiveTime] = useState(new Date());

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Haversine for client-side preview
    function haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371000;
        const toRad = (deg) => (deg * Math.PI) / 180;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Update live clock every second
    useEffect(() => {
        const timer = setInterval(() => setLiveTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch office location, today's record, and history on mount
    useEffect(() => {
        fetchOfficeLocation();
        if (user._id || user.id) {
            fetchTodayRecord();
            fetchHistory();
        }
    }, []);

    const fetchOfficeLocation = async () => {
        try {
            const { data } = await client.get('/office-location');
            setOfficeLocation(data);
        } catch {
            // No office configured — that's ok
            setOfficeLocation(null);
        }
    };

    const fetchTodayRecord = async () => {
        try {
            const empId = user._id || user.id;
            const { data } = await client.get(`/attendance/today/${empId}`);
            setTodayRecord(data);
        } catch {
            setTodayRecord(null);
        }
    };

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const empId = user._id || user.id;
            const { data } = await client.get(`/attendance/history/${empId}`);
            setHistory(data || []);
        } catch {
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    // Acquire user geolocation
    const acquireLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setGeoStatus('unavailable');
            setError('Geolocation is not supported by your browser.');
            return;
        }

        setGeoStatus('acquiring');
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                };
                setUserCoords(coords);
                setGeoStatus('acquired');

                // Calculate client-side distance from office
                if (officeLocation) {
                    const dist = haversineDistance(
                        coords.latitude, coords.longitude,
                        officeLocation.latitude, officeLocation.longitude
                    );
                    setDistanceFromOffice(Math.round(dist));
                    setWithinGeofence(dist <= officeLocation.radiusMeters);
                }
            },
            (err) => {
                if (err.code === 1) {
                    setGeoStatus('denied');
                    setError('Location permission denied. Please enable location access to check in.');
                } else {
                    setGeoStatus('unavailable');
                    setError('Unable to retrieve your location. Please try again.');
                }
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    }, [officeLocation]);

    // Auto-acquire location on page load
    useEffect(() => {
        acquireLocation();
    }, [acquireLocation]);

    const isCheckedIn = !!todayRecord?.checkIn && !todayRecord?.checkOut;
    const isFullyDone = !!todayRecord?.checkIn && !!todayRecord?.checkOut;

    // Handle check-in / check-out
    const handleMark = async () => {
        if (geoStatus !== 'acquired' || !userCoords) {
            acquireLocation();
            return;
        }

        const empId = user._id || user.id;
        if (!empId) {
            setError('User session not found. Please log in again.');
            return;
        }

        const type = isCheckedIn ? 'checkOut' : 'checkIn';
        setMarkLoading(true);
        setError(null);

        try {
            const { data } = await client.post('/attendance/mark', {
                employeeId: empId,
                type,
                latitude: userCoords.latitude,
                longitude: userCoords.longitude,
            });
            setTodayRecord(data.attendance);
            setLastGeofenceResult(data.geofence);
            fetchHistory();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to mark attendance.');
        } finally {
            setMarkLoading(false);
        }
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const calcHours = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return '-';
        const diff = new Date(checkOut) - new Date(checkIn);
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        return `${h}h ${m}m`;
    };

    // Geo status indicator component
    const GeoStatusIndicator = () => {
        const statusConfig = {
            idle: { color: 'text-slate-400', bg: 'bg-slate-50', ring: 'ring-slate-200', label: 'Waiting...', icon: MapPin },
            acquiring: { color: 'text-amber-500', bg: 'bg-amber-50', ring: 'ring-amber-200', label: 'Acquiring GPS...', icon: Loader2 },
            acquired: withinGeofence
                ? { color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-200', label: 'Within office zone', icon: Shield }
                : { color: 'text-amber-600', bg: 'bg-amber-50', ring: 'ring-amber-200', label: 'Outside office zone', icon: ShieldAlert },
            denied: { color: 'text-red-500', bg: 'bg-red-50', ring: 'ring-red-200', label: 'Location denied', icon: WifiOff },
            unavailable: { color: 'text-red-500', bg: 'bg-red-50', ring: 'ring-red-200', label: 'Location unavailable', icon: AlertTriangle },
        };

        const config = statusConfig[geoStatus] || statusConfig.idle;
        const StatusIcon = config.icon;

        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative overflow-hidden rounded-xl border ${config.ring} ${config.bg} p-4`}
            >
                {/* Pulsing background effect when acquiring */}
                {geoStatus === 'acquiring' && (
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-amber-100/0 via-amber-200/40 to-amber-100/0" />
                )}

                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.bg} ring-1 ${config.ring}`}>
                            <StatusIcon className={`w-5 h-5 ${config.color} ${geoStatus === 'acquiring' ? 'animate-spin' : ''}`} />
                        </div>
                        <div>
                            <p className={`text-sm font-semibold ${config.color}`}>{config.label}</p>
                            {geoStatus === 'acquired' && distanceFromOffice != null && (
                                <p className="text-xs text-slate-500 mt-0.5">
                                    <Navigation className="w-3 h-3 inline mr-1" />
                                    {distanceFromOffice < 1000
                                        ? `${distanceFromOffice}m from office`
                                        : `${(distanceFromOffice / 1000).toFixed(1)}km from office`}
                                </p>
                            )}
                            {geoStatus === 'acquired' && userCoords && (
                                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                                    {userCoords.latitude.toFixed(5)}, {userCoords.longitude.toFixed(5)}
                                    {userCoords.accuracy && ` (±${Math.round(userCoords.accuracy)}m)`}
                                </p>
                            )}
                        </div>
                    </div>

                    {(geoStatus === 'denied' || geoStatus === 'unavailable') && (
                        <button
                            onClick={acquireLocation}
                            className="text-xs font-medium text-primary-600 hover:text-primary-700 bg-white px-3 py-1.5 rounded-lg border border-primary-200 hover:border-primary-300 transition-colors"
                        >
                            Retry
                        </button>
                    )}

                    {geoStatus === 'acquired' && (
                        <button
                            onClick={acquireLocation}
                            className="text-xs font-medium text-slate-500 hover:text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                        >
                            Refresh
                        </button>
                    )}
                </div>
            </motion.div>
        );
    };

    // Calendar month navigation
    const [calMonth, setCalMonth] = useState(new Date().getMonth());
    const [calYear, setCalYear] = useState(new Date().getFullYear());
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
    const monthLabel = new Date(calYear, calMonth).toLocaleDateString([], { month: 'long', year: 'numeric' });

    const prevMonth = () => {
        if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
        else setCalMonth(calMonth - 1);
    };
    const nextMonth = () => {
        if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
        else setCalMonth(calMonth + 1);
    };

    // Check if a specific day has an attendance record
    const getRecordForDay = (day) => {
        const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return history.find(r => {
            const rd = new Date(r.date);
            return rd.getFullYear() === calYear && rd.getMonth() === calMonth && rd.getDate() === day;
        });
    };

    const todayDay = new Date().getDate();
    const isCurrentMonth = calMonth === new Date().getMonth() && calYear === new Date().getFullYear();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
                    <p className="text-slate-500">Track your daily attendance with GPS verification.</p>
                </div>
                <div className="flex items-center space-x-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-right px-2">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Live Time</p>
                        <p className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                            {liveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                        <p className="text-xs text-slate-400">{liveTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                    </div>
                </div>
            </div>

            {/* Geolocation Status */}
            <GeoStatusIndicator />

            {/* Error message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
                    >
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-700">{error}</p>
                        <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
                            <XCircle className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Check-In/Out Card */}
            <motion.div
                layout
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
            >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Today's status */}
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                            isFullyDone
                                ? 'bg-emerald-100'
                                : isCheckedIn
                                    ? 'bg-blue-100'
                                    : 'bg-slate-100'
                        }`}>
                            {isFullyDone ? (
                                <CheckCircle className="w-7 h-7 text-emerald-600" />
                            ) : isCheckedIn ? (
                                <Clock className="w-7 h-7 text-blue-600" />
                            ) : (
                                <MapPin className="w-7 h-7 text-slate-400" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Today's Status</p>
                            <p className="text-lg font-bold text-slate-900">
                                {isFullyDone
                                    ? 'Completed'
                                    : isCheckedIn
                                        ? `Checked in at ${formatTime(todayRecord?.checkIn)}`
                                        : 'Not checked in'}
                            </p>
                            {isFullyDone && todayRecord && (
                                <p className="text-sm text-slate-500">
                                    {formatTime(todayRecord.checkIn)} — {formatTime(todayRecord.checkOut)}
                                    <span className="ml-2 text-emerald-600 font-medium">{calcHours(todayRecord.checkIn, todayRecord.checkOut)}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Check-in / Check-out button */}
                    {!isFullyDone && (
                        <button
                            id="attendance-mark-btn"
                            onClick={handleMark}
                            disabled={markLoading || geoStatus === 'denied' || geoStatus === 'unavailable'}
                            className={`relative px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                                isCheckedIn
                                    ? 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-red-500/30'
                                    : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-emerald-500/30'
                            }`}
                        >
                            {markLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processing...
                                </span>
                            ) : geoStatus === 'acquiring' ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Getting Location...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {isCheckedIn ? 'Check Out' : 'Check In'}
                                </span>
                            )}
                        </button>
                    )}

                    {isFullyDone && (
                        <div className="bg-emerald-50 px-6 py-3 rounded-xl border border-emerald-200">
                            <p className="text-emerald-700 font-semibold flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Day Complete
                            </p>
                        </div>
                    )}
                </div>

                {/* Last geofence result */}
                <AnimatePresence>
                    {lastGeofenceResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                                lastGeofenceResult.withinGeofence
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                        >
                            {lastGeofenceResult.withinGeofence ? (
                                <Shield className="w-4 h-4" />
                            ) : (
                                <ShieldAlert className="w-4 h-4" />
                            )}
                            <span>
                                {lastGeofenceResult.withinGeofence
                                    ? `Verified within office zone (${lastGeofenceResult.distanceMeters}m from office)`
                                    : `Flagged: Outside office zone (${lastGeofenceResult.distanceMeters}m from office)`}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar View */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center">
                            <CalendarIcon className="w-5 h-5 mr-2 text-primary-600" />
                            {monthLabel}
                        </h2>
                        <div className="flex space-x-2">
                            <button onClick={prevMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={nextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-xs font-medium text-slate-400 uppercase py-2">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {/* Empty cells for offset */}
                        {Array.from({ length: firstDayOfMonth }, (_, i) => (
                            <div key={`empty-${i}`} className="h-10 sm:h-14" />
                        ))}
                        {Array.from({ length: daysInMonth }, (_, i) => {
                            const day = i + 1;
                            const record = getRecordForDay(day);
                            const isToday = isCurrentMonth && day === todayDay;
                            const isSunday = new Date(calYear, calMonth, day).getDay() === 0;

                            let cellClasses = 'bg-white text-slate-700 border-slate-100 hover:border-primary-200';
                            if (isToday) {
                                cellClasses = 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/30';
                            } else if (record?.status === 'Present') {
                                cellClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                            } else if (record?.status === 'Absent') {
                                cellClasses = 'bg-red-50 text-red-600 border-red-200';
                            } else if (record?.status === 'Late') {
                                cellClasses = 'bg-amber-50 text-amber-600 border-amber-200';
                            } else if (isSunday) {
                                cellClasses = 'bg-slate-50 text-slate-400 border-transparent';
                            }

                            return (
                                <div
                                    key={day}
                                    className={`h-10 sm:h-14 rounded-lg flex flex-col items-center justify-center text-sm font-medium border relative ${cellClasses}`}
                                >
                                    {day}
                                    {record && record.checkInWithinGeofence === false && !isToday && (
                                        <ShieldAlert className="w-3 h-3 text-amber-500 absolute bottom-0.5 right-0.5" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <div className="w-3 h-3 rounded-sm bg-emerald-200 border border-emerald-300" /> Present
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <div className="w-3 h-3 rounded-sm bg-red-200 border border-red-300" /> Absent
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <div className="w-3 h-3 rounded-sm bg-amber-200 border border-amber-300" /> Late
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <ShieldAlert className="w-3 h-3 text-amber-500" /> Outside geofence
                        </div>
                    </div>
                </div>

                {/* Recent History */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-primary-600" />
                        Recent History
                    </h2>
                    <div className="space-y-3">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                            </div>
                        ) : history.length === 0 ? (
                            <div className="text-center py-8">
                                <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">No attendance records yet.</p>
                            </div>
                        ) : (
                            history.slice(0, 10).map((record) => (
                                <div key={record._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{formatDate(record.date)}</p>
                                        <p className="text-xs text-slate-500">
                                            {formatTime(record.checkIn)} — {formatTime(record.checkOut)}
                                        </p>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                record.status === 'Present' ? 'bg-green-100 text-green-700' :
                                                record.status === 'Late' ? 'bg-amber-100 text-amber-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {record.status === 'Present' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                                {record.status}
                                            </span>
                                            {record.checkInWithinGeofence === false && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-amber-100 text-amber-600" title="Checked in outside geofence">
                                                    <ShieldAlert className="w-3 h-3" />
                                                </span>
                                            )}
                                            {record.checkInWithinGeofence === true && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-600" title="Checked in within geofence">
                                                    <Shield className="w-3 h-3" />
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400">{calcHours(record.checkIn, record.checkOut)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
