export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  genre: string;
  isPublished: boolean;
  viewCount: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  storyId: string;
  chapterNumber: number;
  title: string;
  isPublished: boolean;
  createdAt?: string;
}

export interface StoryListResponse {
  stories: Story[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GenresResponse {
  genres: string[];
}

export interface SceneData {
  background: string;
  timeline: Array<{
    type: string;
    text: string;
  }>;
  choice?: {
    prompt: string;
    options: Array<{
      id: string;
      text: string;
      nextSceneId?: string;
    }>;
  };
}

export interface PlayerProgress {
  userId: string;
  chapterId: string;
  currentSceneId: string;
  progress: number;
  choices: Array<{
    sceneId: string;
    choiceId: string;
    timestamp: string;
  }>;
  startedAt: string;
  lastPlayedAt: string;
}

export interface GameplayResponse {
  sceneData: SceneData;
  playerProgress: PlayerProgress;
  nextSceneId?: string;
}

export interface UserInventory {
  userId: string;
  totalKeys: number;
  usedKeys: number;
  remainingKeys: number;
  transactions: Array<{
    type: 'earned' | 'spent' | 'purchased';
    amount: number;
    reason: string;
    timestamp: string;
  }>;
}
