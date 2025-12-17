import React, { useState, useEffect } from 'react';
import api from '../api';
import { MurmurCard } from '../components/MurmurCard';
import { useAuth } from '../context/AuthContext';

export const TimelinePage: React.FC = () => {
    const [murmurs, setMurmurs] = useState<any[]>([]);
    const [content, setContent] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useAuth();

    const fetchMurmurs = async (pageNum = 1) => {
        try {
            const res = await api.get(`/murmurs?page=${pageNum}`);
            if (pageNum === 1) {
                setMurmurs(res.data.data);
            } else {
                setMurmurs(prev => [...prev, ...res.data.data]);
            }
            setHasMore(pageNum < res.data.lastPage);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMurmurs(1);
    }, []);

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        try {
            await api.post('/murmurs', { content });
            setContent('');
            fetchMurmurs(1); // Refresh timeline
        } catch (err) {
            console.error(err);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMurmurs(nextPage);
    };

    return (
        <div className="max-w-2xl mx-auto text-black">
            <div className="bg-white p-4 rounded shadow mb-6">
                <form onSubmit={handlePost}>
                    <textarea
                        className="w-full border-gray-200 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none focus:outline-none text-black"
                        placeholder="What's happening?"
                        rows={3}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        maxLength={280}
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50"
                            disabled={!content.trim()}
                        >
                            Murmur
                        </button>
                    </div>
                </form>
            </div>

            <div className="space-y-4">
                {murmurs.map(murmur => (
                    <MurmurCard key={murmur.id} murmur={murmur} onUpdate={() => fetchMurmurs(1)} />
                    // Optimization: onUpdate could update just the item locally, but refreshing page 1 is safer for simplicity
                ))}
            </div>

            {hasMore && (
                <div className="text-center mt-6">
                    <button
                        onClick={handleLoadMore}
                        className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                        Load more
                    </button>
                </div>
            )}
        </div>
    );
};
