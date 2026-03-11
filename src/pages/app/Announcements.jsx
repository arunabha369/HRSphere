import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, Heart, MessageCircle, Share2, Loader2 } from 'lucide-react';
import client from '../../api/client';

const Announcements = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [postContent, setPostContent] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => { fetchPosts(); }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const { data } = await client.get('/announcements');
            setPosts(data);
        } catch {
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async () => {
        if (!postTitle.trim() || !postContent.trim()) return;
        setSubmitting(true);
        try {
            await client.post('/announcements', {
                title: postTitle,
                content: postContent,
                tag: 'General',
            });
            setPostTitle('');
            setPostContent('');
            fetchPosts();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to post announcement.');
        } finally {
            setSubmitting(false);
        }
    };

    const timeAgo = (date) => {
        if (!date) return '';
        const diff = Date.now() - new Date(date).getTime();
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days === 1) return 'Yesterday';
        return `${days}d ago`;
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
                <p className="text-slate-500">Stay updated with the latest company news.</p>
            </div>

            {/* Create Post */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold flex-shrink-0">
                        {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div className="flex-1 space-y-2">
                        <input
                            type="text"
                            placeholder="Announcement title..."
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 text-sm font-medium"
                        />
                        <textarea
                            placeholder="Share an update with the team..."
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            rows="2"
                            className="w-full bg-slate-50 border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handlePost}
                        disabled={submitting || !postTitle.trim() || !postContent.trim()}
                        className="bg-primary-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center"
                    >
                        {submitting && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
                        Post
                    </button>
                </div>
            </div>

            {/* Feed */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
                    <Megaphone className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p>No announcements yet. Be the first to post!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <div key={post._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                                        {post.author?.name ? post.author.name.charAt(0) : 'S'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">{post.author?.name || 'System'}</h3>
                                        <p className="text-xs text-slate-500">{post.author?.role || 'Admin'} • {timeAgo(post.createdAt)}</p>
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
                                        <span className="text-sm">{post.likes?.length || 0}</span>
                                    </button>
                                    <button className="flex items-center text-slate-500 hover:text-blue-500 transition-colors">
                                        <MessageCircle className="w-5 h-5 mr-1.5" />
                                        <span className="text-sm">0</span>
                                    </button>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Announcements;
