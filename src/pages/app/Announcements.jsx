import React from 'react';
import { Megaphone, Calendar, Heart, MessageCircle, Share2 } from 'lucide-react';

const Announcements = () => {
    const posts = [
        {
            id: 1,
            author: 'Ananya Singh',
            role: 'HR Manager',
            avatar: 'AS',
            date: '2 hours ago',
            title: 'Annual Company Retreat 2024! 🌴',
            content: 'We are thrilled to announce that this year\'s company retreat will be held in Goa! Get ready for 3 days of fun, team building, and relaxation. Please fill out the preference form sent to your email by Friday.',
            likes: 45,
            comments: 12,
            tag: 'Event'
        },
        {
            id: 2,
            author: 'John Doe',
            role: 'CEO',
            avatar: 'JD',
            date: 'Yesterday',
            title: 'Q1 All-Hands Meeting',
            content: 'Join us tomorrow at 10 AM for our quarterly All-Hands meeting. We will be discussing our roadmap for the year and celebrating our recent wins. Lunch will be provided!',
            likes: 32,
            comments: 5,
            tag: 'Important'
        },
        {
            id: 3,
            author: 'System',
            role: 'Admin',
            avatar: 'SYS',
            date: '2 days ago',
            title: 'Server Maintenance Scheduled',
            content: 'Please be advised that there will be scheduled maintenance on the internal servers this Saturday from 2 AM to 4 AM. Services might be intermittent.',
            likes: 8,
            comments: 0,
            tag: 'Update'
        }
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
                <p className="text-slate-500">Stay updated with the latest company news.</p>
            </div>

            {/* Create Post (Mock) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold flex-shrink-0">
                    JD
                </div>
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Share an update with the team..."
                        className="w-full bg-slate-50 border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 mb-2"
                    />
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                            <button className="text-slate-400 hover:text-primary-600 p-1"><Megaphone className="w-5 h-5" /></button>
                            <button className="text-slate-400 hover:text-primary-600 p-1"><Calendar className="w-5 h-5" /></button>
                        </div>
                        <button className="bg-primary-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-700">Post</button>
                    </div>
                </div>
            </div>

            {/* Feed */}
            <div className="space-y-6">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                                    {post.avatar}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">{post.author}</h3>
                                    <p className="text-xs text-slate-500">{post.role} • {post.date}</p>
                                </div>
                            </div>
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                                {post.tag}
                            </span>
                        </div>

                        <h2 className="text-lg font-bold text-slate-900 mb-2">{post.title}</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">{post.content}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="flex space-x-6">
                                <button className="flex items-center text-slate-500 hover:text-red-500 transition-colors">
                                    <Heart className="w-5 h-5 mr-1.5" />
                                    <span className="text-sm">{post.likes}</span>
                                </button>
                                <button className="flex items-center text-slate-500 hover:text-blue-500 transition-colors">
                                    <MessageCircle className="w-5 h-5 mr-1.5" />
                                    <span className="text-sm">{post.comments}</span>
                                </button>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Announcements;
