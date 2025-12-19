import { usersAPI } from "./api";
import type { User } from "../types";

// Simple functional service for user operations
export const userService = {
  async fetchUsers(): Promise<User[]> {
    try {
      return await usersAPI.getAll();
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  },

  async getUserById(id: number): Promise<User> {
    try {
      return await usersAPI.getById(id);
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      throw error;
    }
  },

  async followUser(userId: number): Promise<void> {
    try {
      await usersAPI.follow(userId);
    } catch (error) {
      console.error(`Failed to follow user ${userId}:`, error);
      throw error;
    }
  },

  async unfollowUser(userId: number): Promise<void> {
    try {
      await usersAPI.unfollow(userId);
    } catch (error) {
      console.error(`Failed to unfollow user ${userId}:`, error);
      throw error;
    }
  },

  async searchUsers(query: string): Promise<User[]> {
    try {
      return await usersAPI.search(query);
    } catch (error) {
      console.error(`Failed to search users with query "${query}":`, error);
      throw error;
    }
  },

  async getFollowing(userId: number): Promise<User[]> {
    try {
      return await usersAPI.getFollowing(userId);
    } catch (error) {
      console.error(`Failed to get following for user ${userId}:`, error);
      throw error;
    }
  },

  async getFollowers(userId: number): Promise<User[]> {
    try {
      return await usersAPI.getFollowers(userId);
    } catch (error) {
      console.error(`Failed to get followers for user ${userId}:`, error);
      throw error;
    }
  },
};
