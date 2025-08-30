import api from './api';
import type { GameplayResponse, UserInventory } from '../types';

export const gameplayService = {
  async startChapter(chapterId: string): Promise<GameplayResponse> {
    const response = await api.post('/gameplay/start-chapter', { chapterId });
    return response.data;
  },

  async makeChoice(data: {
    storyId: string;
    sceneId: string;
    choiceId: string;
  }): Promise<GameplayResponse> {
    const response = await api.post('/gameplay/make-choice', data);
    return response.data;
  },

  async advanceScene(data: {
    storyId: string;
    currentSceneId: string;
  }): Promise<GameplayResponse> {
    const response = await api.post('/gameplay/advance-scene', data);
    return response.data;
  },

  async getProgress(progressId: string): Promise<GameplayResponse> {
    const response = await api.get(`/gameplay/progress/${progressId}`);
    return response.data;
  },

  async saveProgress(data: {
    progressId: string;
    currentSceneId: string;
    choices: Array<{
      sceneId: string;
      choiceId: string;
      timestamp: string;
    }>;
  }): Promise<void> {
    await api.post('/gameplay/save-progress', data);
  },
};

export const inventoryService = {
  async getInventory(): Promise<UserInventory> {
    const response = await api.get('/inventory');
    return response.data;
  },

  async purchaseKeys(amount: number): Promise<UserInventory> {
    const response = await api.post('/inventory/purchase-keys', { amount });
    return response.data;
  },
};
