import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayerProgress, PlayerProgressDocument } from '../../common/entities/player-progress.schema';
import { StoryContent, StoryContentDocument } from '../../common/entities/story-content.schema';
import { InventoryService } from '../inventory/inventory.service';
import { StartChapterDto, MakeChoiceDto, GameplayResponseDto, SaveProgressDto } from '../../common/dto/gameplay.dto';

@Injectable()
export class GameplayService {
  constructor(
    @InjectModel(PlayerProgress.name) 
    private playerProgressModel: Model<PlayerProgressDocument>,
    @InjectModel(StoryContent.name) 
    private storyContentModel: Model<StoryContentDocument>,
    private inventoryService: InventoryService,
  ) {}

  async startChapter(userId: string, startChapterDto: StartChapterDto): Promise<GameplayResponseDto> {
    const { chapterId } = startChapterDto;

    // Check if user has enough keys
    const canPlay = await this.inventoryService.canStartChapter(userId);
    if (!canPlay) {
      throw new BadRequestException('Not enough keys to start chapter');
    }

    // Consume a key
    await this.inventoryService.consumeKey(userId);

    // Get chapter content
    const chapterContent = await this.storyContentModel.findOne({ chapterId }).exec();
    if (!chapterContent) {
      throw new NotFoundException('Chapter content not found');
    }

    // Get or create player progress
    const firstSceneId = Object.keys(chapterContent.scenes)[0];
    const playerProgress = await this.playerProgressModel.findOneAndUpdate(
      { userId, storyId: chapterContent.storyId },
      {
        $setOnInsert: {
          userId,
          storyId: chapterContent.storyId,
          relationshipScores: {},
          flags: {},
          choicesMade: [],
          createdAt: new Date(),
        },
        $set: {
          currentChapterId: chapterId,
          currentSceneId: firstSceneId,
          lastPlayedAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { 
        upsert: true, 
        new: true, 
        runValidators: true 
      }
    ).exec();

    const sceneData = chapterContent.scenes[playerProgress.currentSceneId];

    return {
      sceneData,
      nextSceneId: sceneData.nextSceneId,
      playerProgress: {
        currentSceneId: playerProgress.currentSceneId,
        relationshipScores: playerProgress.relationshipScores,
        flags: playerProgress.flags,
      },
    };
  }

  async makeChoice(userId: string, makeChoiceDto: MakeChoiceDto): Promise<GameplayResponseDto> {
    const { storyId, sceneId, choiceId } = makeChoiceDto;

    // Get player progress
    const playerProgress = await this.playerProgressModel.findOne({
      userId,
      storyId,
    }).exec();

    if (!playerProgress) {
      throw new NotFoundException('Player progress not found');
    }

    // Get story content
    const storyContent = await this.storyContentModel.findOne({
      chapterId: playerProgress.currentChapterId,
    }).exec();

    if (!storyContent) {
      throw new NotFoundException('Story content not found');
    }

    const currentScene = storyContent.scenes[sceneId];
    if (!currentScene || !currentScene.choice) {
      throw new BadRequestException('Invalid scene or no choices available');
    }

    const selectedChoice = currentScene.choice.options.find(option => option.id === choiceId);
    if (!selectedChoice) {
      throw new BadRequestException('Invalid choice');
    }

    // Check if choice requires payment
    if (selectedChoice.cost && selectedChoice.currency) {
      const canAfford = await this.inventoryService.canAfford(
        userId,
        selectedChoice.cost,
        selectedChoice.currency,
      );

      if (!canAfford) {
        throw new BadRequestException(`Not enough ${selectedChoice.currency}`);
      }

      // Deduct currency
      await this.inventoryService.deductCurrency(
        userId,
        selectedChoice.cost,
        selectedChoice.currency,
      );
    }

    // Update player progress
    playerProgress.currentSceneId = selectedChoice.nextSceneId;
    playerProgress.choicesMade.push(choiceId);

    // Apply relationship effects
    if (selectedChoice.relationshipEffect) {
      const { character, change } = selectedChoice.relationshipEffect;
      playerProgress.relationshipScores[character] = 
        (playerProgress.relationshipScores[character] || 0) + change;
    }

    // Set flag if specified
    if (selectedChoice.flag) {
      playerProgress.flags[selectedChoice.flag] = true;
    }

    playerProgress.lastPlayedAt = new Date();
    await playerProgress.save();

    // Get next scene data
    const nextSceneData = storyContent.scenes[selectedChoice.nextSceneId];

    return {
      sceneData: nextSceneData,
      nextSceneId: nextSceneData?.nextSceneId,
      playerProgress: {
        currentSceneId: playerProgress.currentSceneId,
        relationshipScores: playerProgress.relationshipScores,
        flags: playerProgress.flags,
      },
    };
  }

  async advanceScene(userId: string, storyId: string, currentSceneId: string): Promise<GameplayResponseDto> {
    // Get player progress
    const playerProgress = await this.playerProgressModel.findOne({
      userId,
      storyId,
    }).exec();

    if (!playerProgress) {
      throw new NotFoundException('Player progress not found');
    }

    // Get story content
    const storyContent = await this.storyContentModel.findOne({
      chapterId: playerProgress.currentChapterId,
    }).exec();

    if (!storyContent) {
      throw new NotFoundException('Story content not found');
    }

    const currentScene = storyContent.scenes[currentSceneId];
    if (!currentScene) {
      throw new BadRequestException('Invalid scene');
    }

    // Check if scene has nextSceneId and no choice (auto-advance scene)
    if (!currentScene.nextSceneId || currentScene.choice) {
      throw new BadRequestException('Scene cannot be auto-advanced');
    }

    // Update player progress to next scene
    playerProgress.currentSceneId = currentScene.nextSceneId;
    playerProgress.lastPlayedAt = new Date();
    await playerProgress.save();

    // Get next scene data
    const nextSceneData = storyContent.scenes[currentScene.nextSceneId];
    if (!nextSceneData) {
      throw new NotFoundException('Next scene not found');
    }

    return {
      sceneData: nextSceneData,
      nextSceneId: nextSceneData?.nextSceneId,
      playerProgress: {
        currentSceneId: playerProgress.currentSceneId,
        relationshipScores: playerProgress.relationshipScores,
        flags: playerProgress.flags,
      },
    };
  }

  async getPlayerProgress(userId: string, storyId: string): Promise<PlayerProgress | null> {
    return this.playerProgressModel.findOne({ userId, storyId }).exec();
  }

  async saveProgress(userId: string, saveProgressDto: SaveProgressDto): Promise<void> {
    const { storyId, ...updateData } = saveProgressDto;

    await this.playerProgressModel.updateOne(
      { userId, storyId },
      { 
        ...updateData,
        lastPlayedAt: new Date(),
        updatedAt: new Date(),
      },
      { upsert: true }
    ).exec();
  }

  async getCurrentScene(userId: string, storyId: string): Promise<any> {
    const playerProgress = await this.getPlayerProgress(userId, storyId);
    if (!playerProgress) {
      throw new NotFoundException('Player progress not found');
    }

    const storyContent = await this.storyContentModel.findOne({
      chapterId: playerProgress.currentChapterId,
    }).exec();

    if (!storyContent) {
      throw new NotFoundException('Story content not found');
    }

    const sceneData = storyContent.scenes[playerProgress.currentSceneId];

    return {
      sceneData,
      nextSceneId: sceneData?.nextSceneId,
      playerProgress: {
        currentSceneId: playerProgress.currentSceneId,
        relationshipScores: playerProgress.relationshipScores,
        flags: playerProgress.flags,
      },
    };
  }
}
