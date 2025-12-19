import axios from "axios";
import type { User, Murmur } from "../types";

const API_BASE_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
  },

  register: async (username: string, name: string, password: string) => {
    const response = await api.post("/auth/register", {
      username,
      name,
      password,
    });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Users API
export const usersAPI = {
  create: async (userData: {
    username: string;
    name: string;
    password: string;
  }) => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  getAll: async (): Promise<User[]> => {
    const response = await api.get("/users");
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  follow: async (id: number) => {
    const response = await api.post(`/users/${id}/follow`);
    return response.data;
  },

  unfollow: async (id: number) => {
    const response = await api.delete(`/users/${id}/follow`);
    return response.data;
  },

  getFollowing: async (id: number): Promise<User[]> => {
    const response = await api.get(`/users/${id}/following`);
    return response.data;
  },

  getFollowers: async (id: number): Promise<User[]> => {
    const response = await api.get(`/users/${id}/followers`);
    return response.data;
  },

  search: async (query: string): Promise<User[]> => {
    const response = await api.get(
      `/users/search/${encodeURIComponent(query)}/with-follow-status`
    );
    return response.data;
  },
};

// Murmurs API
export const murmursAPI = {
  getAll: async (page = 1, limit = 10) => {
    const response = await api.get(`/murmurs?page=${page}&limit=${limit}`);
    return response.data;
  },

  getTimeline: async (page = 1, limit = 10) => {
    const response = await api.get(
      `/murmurs/timeline?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  getById: async (id: number): Promise<Murmur> => {
    const response = await api.get(`/murmurs/${id}`);
    return response.data;
  },

  getByUser: async (userId: number, page = 1, limit = 10) => {
    const response = await api.get(
      `/murmurs/user/${userId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  create: async (content: string): Promise<Murmur> => {
    const response = await api.post("/murmurs", { content });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/murmurs/${id}`);
    return response.data;
  },

  toggleLike: async (id: number) => {
    const response = await api.post(`/murmurs/${id}/like`);
    return response.data;
  },
};

export default api;
