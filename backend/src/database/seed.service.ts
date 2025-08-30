import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from 'typeorm';
import { Model } from 'mongoose';
import { Story } from '../common/entities/story.entity';
import { Chapter } from '../common/entities/chapter.entity';
import { StoryContent, StoryContentDocument } from '../common/entities/story-content.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
    @InjectModel(StoryContent.name)
    private storyContentModel: Model<StoryContentDocument>,
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'development') {
      await this.seedData();
    }
  }

  async seedData() {
    // Check if data already exists
    const existingStories = await this.storyRepository.count();
    if (existingStories > 0) {
      console.log('📚 Sample data already exists, skipping seed...');
      return;
    }

    console.log('🌱 Seeding sample data...');

    // Create sample stories
    const story1 = await this.createSampleStory1();
    const story2 = await this.createSampleStory2();

    console.log('✅ Sample data seeded successfully!');
  }

  private async createSampleStory1() {
    // Create story
    const story = this.storyRepository.create({
      title: 'The Royal Academy',
      description: 'A prestigious academy where you must navigate politics, romance, and magic to uncover dark secrets.',
      coverImageUrl: 'https://example.com/covers/royal-academy.jpg',
      genre: 'Romance',
      isPublished: true,
    });
    const savedStory = await this.storyRepository.save(story);

    // Create chapter
    const chapter = this.chapterRepository.create({
      storyId: savedStory.id,
      chapterNumber: 1,
      title: 'Arrival at the Academy',
      isPublished: true,
    });
    const savedChapter = await this.chapterRepository.save(chapter);

    // Create story content
    const storyContent = new this.storyContentModel({
      chapterId: savedChapter.id,
      storyId: savedStory.id,
      chapterNumber: 1,
      scenes: {
        scene_1: {
          background: 'https://example.com/backgrounds/academy_gates.jpg',
          music: 'https://example.com/music/mysterious.mp3',
          timeline: [
            {
              type: 'narrative',
              text: 'The towering gates of the Royal Academy loom before you, their ornate iron work gleaming in the morning sun.',
            },
            {
              type: 'dialogue',
              character: 'Guard',
              text: 'Welcome to the Royal Academy. Your papers, please.',
              characterImage: 'https://example.com/characters/guard.png',
            },
          ],
          nextSceneId: 'scene_2',
        },
        scene_2: {
          background: 'https://example.com/backgrounds/academy_gates.jpg',
          timeline: [
            {
              type: 'narrative',
              text: 'The guard examines your documents carefully. You notice other students watching you curiously.',
            },
            {
              type: 'dialogue',
              character: 'Guard',
              text: 'Everything seems to be in order. How would you like to make your entrance?',
            },
          ],
          choice: {
            prompt: 'How do you enter the academy?',
            options: [
              {
                id: 'confident',
                text: 'Walk in confidently with your head held high',
                nextSceneId: 'scene_3a',
                relationshipEffect: {
                  character: 'classmates',
                  change: 2,
                },
              },
              {
                id: 'modest',
                text: 'Enter quietly and try to blend in',
                nextSceneId: 'scene_3b',
                relationshipEffect: {
                  character: 'classmates',
                  change: 1,
                },
              },
              {
                id: 'premium_carriage',
                text: 'Arrive in a golden carriage (50 Diamonds)',
                cost: 50,
                currency: 'diamonds',
                nextSceneId: 'scene_3c',
                flag: 'grand_entrance',
                relationshipEffect: {
                  character: 'nobles',
                  change: 5,
                },
              },
            ],
          },
        },
        scene_3a: {
          background: 'https://example.com/backgrounds/academy_courtyard.jpg',
          timeline: [
            {
              type: 'narrative',
              text: 'You stride through the courtyard with confidence. Several students nod approvingly at your composure.',
            },
            {
              type: 'dialogue',
              character: 'Student',
              text: 'Now that\'s someone who knows their worth. I like that.',
            },
          ],
        },
        scene_3b: {
          background: 'https://example.com/backgrounds/academy_courtyard.jpg',
          timeline: [
            {
              type: 'narrative',
              text: 'You slip quietly into the courtyard, observing the other students and getting a feel for the academy\'s atmosphere.',
            },
            {
              type: 'dialogue',
              character: 'Student',
              text: 'A wise approach. Sometimes it\'s better to watch and learn first.',
            },
          ],
        },
        scene_3c: {
          background: 'https://example.com/backgrounds/academy_courtyard.jpg',
          timeline: [
            {
              type: 'narrative',
              text: 'Your golden carriage draws gasps from the crowd. The noble students immediately take notice of your grand entrance.',
            },
            {
              type: 'dialogue',
              character: 'Noble Student',
              text: 'Impressive! Clearly you understand the importance of making a statement. We should be friends.',
            },
          ],
        },
      },
    });

    await storyContent.save();
    return savedStory;
  }

  private async createSampleStory2() {
    // Create story
    const story = this.storyRepository.create({
      title: 'Mystery of the Lost City',
      description: 'An archaeological adventure where ancient secrets and modern dangers collide.',
      coverImageUrl: 'https://example.com/covers/lost-city.jpg',
      genre: 'Adventure',
      isPublished: true,
    });
    const savedStory = await this.storyRepository.save(story);

    // Create chapter
    const chapter = this.chapterRepository.create({
      storyId: savedStory.id,
      chapterNumber: 1,
      title: 'The Ancient Map',
      isPublished: true,
    });
    const savedChapter = await this.chapterRepository.save(chapter);

    // Create story content
    const storyContent = new this.storyContentModel({
      chapterId: savedChapter.id,
      storyId: savedStory.id,
      chapterNumber: 1,
      scenes: {
        scene_1: {
          background: 'https://example.com/backgrounds/university_library.jpg',
          music: 'https://example.com/music/adventure.mp3',
          timeline: [
            {
              type: 'narrative',
              text: 'In the dusty archives of the university library, you\'ve discovered an ancient map that could change everything.',
            },
            {
              type: 'dialogue',
              character: 'Professor',
              text: 'This map... it could lead to the lost city of Atlantara. But the journey would be incredibly dangerous.',
            },
          ],
          choice: {
            prompt: 'What do you decide?',
            options: [
              {
                id: 'accept_quest',
                text: 'Accept the quest immediately',
                nextSceneId: 'scene_2a',
                flag: 'brave_choice',
              },
              {
                id: 'research_first',
                text: 'Research the dangers first',
                nextSceneId: 'scene_2b',
                flag: 'cautious_choice',
              },
            ],
          },
        },
        scene_2a: {
          background: 'https://example.com/backgrounds/university_library.jpg',
          timeline: [
            {
              type: 'dialogue',
              character: 'Professor',
              text: 'Your courage is admirable! But courage without preparation can be deadly...',
            },
          ],
        },
        scene_2b: {
          background: 'https://example.com/backgrounds/university_library.jpg',
          timeline: [
            {
              type: 'dialogue',
              character: 'Professor',
              text: 'Wise choice. Knowledge is the greatest weapon an explorer can have.',
            },
          ],
        },
      },
    });

    await storyContent.save();
    return savedStory;
  }
}
