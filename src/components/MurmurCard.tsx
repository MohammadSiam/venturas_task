import React from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

interface Murmur {
    id: number;
    content: string;
    createdAt: string;
    user: {
        id: number;
        username: string;
    };
    likeCount: number;
    isLiked: boolean;
}

interface Props {
    murmur: Murmur;
    onUpdate: () => void;
}

export const MurmurCard: React.FC<Props> = ({ murmur, onUpdate }) => {
    const { user } = useAuth();

    const handleLike = async () => {
        try {
            await api.post(`/murmurs/${murmur.id}/like`);
            onUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this murmur?')) return;
        try {
            await api.delete(`/murmurs/${murmur.id}`);
            onUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow mb-4 text-black">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                    <div className="font-bold text-gray-900">
                        <Link to={`/user/${murmur.user.id}`} className="hover:underline">{murmur.user.username}</Link>
                    </div>
                    <div className="text-sm text-gray-500">
                        {new Date(murmur.createdAt).toLocaleDateString()}
                    </div>
                </div>
                {user?.id === murmur.user.id && (
                    <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 text-sm">
                        Delete
                    </button>
                )}
            </div>
            <p className="mt-2 text-gray-800 break-words">{murmur.content}</p>
            <div className="mt-3 flex items-center space-x-4">
                <button
                    onClick={handleLike}
                    className={`flex items-center text-sm space-x-1 ${murmur.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                    disabled={murmur.isLiked}
                >
                    <span>{murmur.isLiked ? '❤️' : '🤍'}</span>
                    <span>{murmur.likeCount}</span>
                </button>
            </div>
        </div>
    );
};
