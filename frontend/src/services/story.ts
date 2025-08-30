import api from './api';
import type { Story, StoryListResponse, GenresResponse, Chapter } from '../types';

export const storyService = {
  async getStories(params: {
    genre?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<StoryListResponse> {
    const response = await api.get('/stories', { params });
    return response.data;
  },

  async getGenres(): Promise<GenresResponse> {
    const response = await api.get('/stories/genres');
    return response.data;
  },

  async getStoryDetails(id: string): Promise<Story> {
    const response = await api.get(`/stories/${id}`);
    return response.data;
  },

  async getChapters(storyId: string): Promise<{ chapters: Chapter[] }> {
    const response = await api.get(`/stories/${storyId}/chapters`);
    return response.data;
  },
};
