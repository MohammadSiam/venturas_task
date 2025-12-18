import { murmursAPI } from "./api";
import type { Murmur } from "../types";

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MurmurResponse {
  murmurs: Murmur[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Simple functional service for murmur operations
export const murmurService = {
  async fetchMurmurs(page = 1, limit = 10): Promise<MurmurResponse> {
    try {
      return await murmursAPI.getAll(page, limit);
    } catch (error) {
      console.error("Failed to fetch murmurs:", error);
      throw error;
    }
  },

  async fetchTimeline(page = 1, limit = 10): Promise<MurmurResponse> {
    try {
      return await murmursAPI.getTimeline(page, limit);
    } catch (error) {
      console.error("Failed to fetch timeline:", error);
      throw error;
    }
  },

  async getMurmurById(id: number): Promise<Murmur> {
    try {
      return await murmursAPI.getById(id);
    } catch (error) {
      console.error(`Failed to fetch murmur ${id}:`, error);
      throw error;
    }
  },

  async getUserMurmurs(
    userId: number,
    page = 1,
    limit = 10
  ): Promise<MurmurResponse> {
    try {
      return await murmursAPI.getByUser(userId, page, limit);
    } catch (error) {
      console.error(`Failed to fetch murmurs for user ${userId}:`, error);
      throw error;
    }
  },

  async createMurmur(content: string): Promise<Murmur> {
    try {
      return await murmursAPI.create(content);
    } catch (error) {
      console.error("Failed to create murmur:", error);
      throw error;
    }
  },

  async deleteMurmur(murmurId: number): Promise<void> {
    try {
      await murmursAPI.delete(murmurId);
    } catch (error) {
      console.error(`Failed to delete murmur ${murmurId}:`, error);
      throw error;
    }
  },

  async toggleLike(murmurId: number): Promise<void> {
    try {
      await murmursAPI.toggleLike(murmurId);
    } catch (error) {
      console.error(`Failed to toggle like for murmur ${murmurId}:`, error);
      throw error;
    }
  },
};
