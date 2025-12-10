import React from 'react';
import { motion } from 'framer-motion';
import {
    Users, Clock, Calendar, CreditCard, TrendingUp, Shield,
    BookOpen, Monitor, DollarSign, Bell, BarChart, Lock, UserCheck
} from 'lucide-react';

const features = [
    {
        icon: Users,
        title: 'Employee Management',
        desc: 'A complete directory of your workforce with detailed profiles.',
        bullets: ['Digital Onboarding', 'Document Repository', 'Custom Fields', 'Org Chart']
    },
    {
        icon: Clock,
        title: 'Attendance & Time Tracking',
        desc: 'Real-time attendance tracking with biometric integration.',
        bullets: ['Geo-fencing', 'Shift Management', 'Overtime Calculation', 'Timesheets']
    },
    {
        icon: Calendar,
        title: 'Leave Management',
        desc: 'Automated leave requests and approval workflows.',
        bullets: ['Custom Leave Policies', 'Holiday Calendars', 'Balance Tracking', 'Email Notifications']
    },
    {
        icon: CreditCard,
        title: 'Payroll Management',
        desc: 'Error-free payroll processing compliant with local tax laws.',
        bullets: ['Salary Structures', 'Tax Deductions', 'Payslip Generation', 'Bank Integration']
    },
    {
        icon: TrendingUp,
        title: 'Performance Management',
        desc: 'Continuous performance tracking and appraisal systems.',
        bullets: ['360 Feedback', 'Goal Setting (OKRs)', 'Appraisal Cycles', 'Skill Gap Analysis']
    },
    {
        icon: UserCheck,
        title: 'Recruitment & ATS',
        desc: 'Streamline your hiring process from job posting to offer letter.',
        bullets: ['Job Board Integration', 'Resume Parsing', 'Interview Scheduling', 'Offer Management']
    },
    {
        icon: BookOpen,
        title: 'Training & Skill Matrix',
        desc: 'Manage employee learning and development programs.',
        bullets: ['Course Catalog', 'Training Calendar', 'Certification Tracking', 'Skill Matrix']
    },
    {
        icon: Monitor,
        title: 'Asset Management',
        desc: 'Track company assets assigned to employees.',
        bullets: ['Asset Inventory', 'Assignment History', 'Maintenance Logs', 'Return Requests']
    },
    {
        icon: DollarSign,
        title: 'Expense Management',
        desc: 'Simplify employee expense claims and reimbursements.',
        bullets: ['Receipt Scanning', 'Approval Workflows', 'Policy Enforcement', 'Payout Integration']
    },
    {
        icon: Bell,
        title: 'Announcements',
        desc: 'Keep your team informed with company-wide updates.',
        bullets: ['News Feed', 'Email Alerts', 'Polls & Surveys', 'Event Calendar']
    },
    {
        icon: BarChart,
        title: 'Reports & Analytics',
        desc: 'Data-driven insights to make better HR decisions.',
        bullets: ['Custom Reports', 'Visual Dashboards', 'Export to Excel/PDF', 'Trend Analysis']
    },
    {
        icon: Lock,
        title: 'System Administration',
        desc: 'Robust security and access control settings.',
        bullets: ['Role-based Access', 'Audit Logs', 'Data Encryption', 'SSO Integration']
    },
    {
        icon: Shield,
        title: 'Self-Service Portal',
        desc: 'Empower employees to manage their own data.',
        bullets: ['Profile Updates', 'Leave Requests', 'Payslip Download', 'Mobile App Access']
    }
];

const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const Features = () => {
    return (
        <div className="pt-20 pb-20 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="bg-primary-900 text-white py-20 mb-16">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Powerful Modules for <span className="text-blue-300">Modern HR</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-blue-100 max-w-2xl mx-auto"
                    >
                        Explore the comprehensive suite of tools designed to streamline every aspect of your human resources operations.
                    </motion.p>
                </div>
            </div>

            {/* Grid */}
            <div className="container mx-auto px-4">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">{feature.desc}</p>
                            <ul className="space-y-2">
                                {feature.bullets.map((bullet, i) => (
                                    <li key={i} className="flex items-center text-sm text-slate-500">
                                        <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-2" />
                                        {bullet}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Features;
