import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const plans = [
    {
        name: 'Starter',
        price: 2999,
        desc: 'Perfect for small teams and startups.',
        features: [
            'Up to 25 Employees',
            'Employee Directory',
            'Leave Management',
            'Basic Reporting',
            'Email Support'
        ],
        notIncluded: ['Payroll', 'Performance Reviews', 'API Access']
    },
    {
        name: 'Business',
        price: 7999,
        popular: true,
        desc: 'For growing companies with more needs.',
        features: [
            'Up to 100 Employees',
            'Everything in Starter',
            'Attendance Tracking',
            'Payroll Processing',
            'Performance Reviews',
            'Priority Support'
        ],
        notIncluded: ['API Access', 'Dedicated Account Manager']
    },
    {
        name: 'Enterprise',
        price: 14999,
        desc: 'Advanced features for large organizations.',
        features: [
            'Unlimited Employees',
            'Everything in Business',
            'Recruitment ATS',
            'Custom API Access',
            'SSO & Advanced Security',
            'Dedicated Account Manager'
        ],
        notIncluded: []
    }
];

const Pricing = () => {
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <div className="pt-20 pb-20 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-slate-600 mb-10">Choose the plan that fits your company's needs. No hidden fees.</p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-semibold ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="w-14 h-8 bg-primary-600 rounded-full relative transition-colors duration-300 focus:outline-none"
                        >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${isAnnual ? 'left-7' : 'left-1'}`} />
                        </button>
                        <span className={`text-sm font-semibold ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
                            Annual <span className="text-green-600 text-xs bg-green-100 px-2 py-0.5 rounded-full ml-1">Save 20%</span>
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative bg-white rounded-2xl p-8 shadow-sm border ${plan.popular ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-50' : 'border-slate-200'} hover:shadow-xl transition-all duration-300 flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                <p className="text-slate-500 text-sm h-10">{plan.desc}</p>
                            </div>
                            <div className="mb-8">
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-bold text-slate-900">₹{isAnnual ? plan.price * 10 : plan.price}</span>
                                    <span className="text-slate-500 ml-2">/{isAnnual ? 'year' : 'month'}</span>
                                </div>
                                {isAnnual && <p className="text-sm text-slate-400 mt-1">Billed annually</p>}
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start text-sm text-slate-600">
                                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                                {plan.notIncluded.map((feature, i) => (
                                    <li key={i} className="flex items-start text-sm text-slate-400">
                                        <X className="w-5 h-5 text-slate-300 mr-3 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section (Optional but good for Pricing pages) */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            { q: 'Can I switch plans later?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.' },
                            { q: 'Is there a free trial?', a: 'Absolutely! We offer a 14-day free trial for all plans. No credit card required.' },
                            { q: 'Do you offer discounts for non-profits?', a: 'Yes, we offer special pricing for non-profit organizations and educational institutions. Contact us for details.' }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                                <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
                                <p className="text-slate-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
