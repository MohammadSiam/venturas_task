import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { MurmurCard } from '../components/MurmurCard';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [profile, setProfile] = useState<any>(null);
    const [murmurs, setMurmurs] = useState<any[]>([]);
    const { user } = useAuth();

    const fetchProfile = async () => {
        try {
            const res = await api.get(`/users/${id}`);
            setProfile(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMurmurs = async () => {
        try {
            const res = await api.get(`/murmurs/user/${id}`);
            setMurmurs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProfile();
            fetchMurmurs();
        }
    }, [id]);

    const handleFollow = async () => {
        try {
            if (profile.isFollowing) {
                await api.post(`/users/${id}/unfollow`);
            } else {
                await api.post(`/users/${id}/follow`);
            }
            fetchProfile();
        } catch (err) {
            console.error(err);
        }
    };

    if (!profile) return <div>Loading...</div>;

    return (
        <div className="text-black">
            <div className="bg-white p-6 rounded shadow mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold">{profile.username}</h1>
                        <div className="flex space-x-4 mt-2 text-gray-600">
                            <span><strong>{profile.followingCount}</strong> Following</span>
                            <span><strong>{profile.followersCount}</strong> Followers</span>
                        </div>
                    </div>
                    {user && user.id !== profile.id && (
                        <button
                            onClick={handleFollow}
                            className={`px-4 py-2 rounded-full font-bold ${profile.isFollowing
                                    ? 'border border-gray-300 hover:bg-red-50 text-black hover:text-red-500'
                                    : 'bg-black text-white hover:bg-gray-800'
                                }`}
                        >
                            {profile.isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Murmurs</h2>
                {murmurs.length === 0 && <p className="text-gray-500">No murmurs yet.</p>}
                {murmurs.map(murmur => (
                    <MurmurCard key={murmur.id} murmur={murmur} onUpdate={fetchMurmurs} />
                ))}
            </div>
        </div>
    );
};
