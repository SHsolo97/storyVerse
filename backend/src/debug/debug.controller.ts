import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from 'typeorm';
import { Model } from 'mongoose';
import { Story } from '../common/entities/story.entity';
import { Chapter } from '../common/entities/chapter.entity';
import { User } from '../common/entities/user.entity';
import { StoryContent, StoryContentDocument } from '../common/entities/story-content.schema';
import { PlayerProgress, PlayerProgressDocument } from '../common/entities/player-progress.schema';
import { Public } from '../common/decorators/public.decorator';

@Controller('debug')
export class DebugController {
  constructor(
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectModel(StoryContent.name)
    private storyContentModel: Model<StoryContentDocument>,
    @InjectModel(PlayerProgress.name)
    private playerProgressModel: Model<PlayerProgressDocument>,
  ) {}

  @Public()
  @Post('add-romance-story')
  async addRomanceStory() {
    try {
      // Check if Hearts of Steel Academy already exists
      const existingStory = await this.storyRepository.findOne({ 
        where: { title: 'Hearts of Steel Academy' } 
      });
      
      let story;
      if (existingStory) {
        story = existingStory;
      } else {
        // Create story
        story = this.storyRepository.create({
          title: 'Hearts of Steel Academy',
          description: 'At an elite military academy, you must navigate dangerous training, dark conspiracies, and two irresistible romantic interests who will stop at nothing to win your heart.',
          coverImageUrl: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Hearts+of+Steel',
          genre: 'Romance',
          isPublished: true,
        });
        story = await this.storyRepository.save(story);
      }

      // Create chapter 1
      const chapter1 = this.chapterRepository.create({
        storyId: story.id,
        chapterNumber: 1,
        title: 'Welcome to Hell',
        isPublished: true,
      });
      const savedChapter1 = await this.chapterRepository.save(chapter1);

      // Create chapter 2
      const chapter2 = this.chapterRepository.create({
        storyId: story.id,
        chapterNumber: 2,
        title: 'Dangerous Alliances',
        isPublished: true,
      });
      const savedChapter2 = await this.chapterRepository.save(chapter2);

      // Create story content for Chapter 1 (simplified version for testing)
      const storyContent1 = new this.storyContentModel({
        chapterId: savedChapter1.id,
        storyId: story.id,
        chapterNumber: 1,
        scenes: {
          scene_1: {
            background: 'https://via.placeholder.com/800x400/1f2937/ffffff?text=Military+Academy+Gates',
            music: 'https://example.com/music/intense.mp3',
            timeline: [
              {
                type: 'narrative',
                text: 'The iron gates of Hearts of Steel Academy close behind you with a thunderous clang. There is no turning back now.',
              },
              {
                type: 'dialogue',
                character: 'Drill Sergeant',
                text: 'Welcome to hell, recruits! Only the strongest survive here. The weak get shipped home in body bags.',
                characterImage: 'https://via.placeholder.com/150x150/374151/ffffff?text=Sergeant',
              },
            ],
            choice: {
              prompt: 'How do you respond to this intimidation?',
              options: [
                {
                  id: 'defiant',
                  text: 'Stand tall and meet his gaze defiantly',
                  nextSceneId: 'scene_2',
                  relationshipEffect: {
                    character: 'Drake',
                    change: 2,
                  },
                },
                {
                  id: 'respectful',
                  text: 'Nod respectfully and stay silent',
                  nextSceneId: 'scene_2',
                  relationshipEffect: {
                    character: 'Phoenix',
                    change: 2,
                  },
                },
              ],
            },
          },
          scene_2: {
            background: 'https://via.placeholder.com/800x400/1f2937/ffffff?text=Academy+Courtyard',
            timeline: [
              {
                type: 'dialogue',
                character: 'Captain Drake',
                text: 'I am Captain Drake, your squad leader. I do not coddle weaklings, but I protect those who prove their worth.',
                characterImage: 'https://via.placeholder.com/150x150/dc2626/ffffff?text=Drake',
              },
              {
                type: 'dialogue',
                character: 'Lieutenant Phoenix',
                text: 'Do not listen to Drake intimidation tactics. I am Phoenix, and I believe strength comes from unity, not fear.',
                characterImage: 'https://via.placeholder.com/150x150/059669/ffffff?text=Phoenix',
              },
            ],
            choice: {
              prompt: 'Both officers are watching you. Your response?',
              options: [
                {
                  id: 'choose_drake',
                  text: 'I respect strength and discipline',
                  nextSceneId: 'scene_3',
                  relationshipEffect: {
                    character: 'Drake',
                    change: 3,
                  },
                },
                {
                  id: 'choose_phoenix',
                  text: 'Unity makes us stronger together',
                  nextSceneId: 'scene_3',
                  relationshipEffect: {
                    character: 'Phoenix',
                    change: 3,
                  },
                },
              ],
            },
          },
          scene_3: {
            background: 'https://via.placeholder.com/800x400/374151/ffffff?text=Academy+Barracks',
            timeline: [
              {
                type: 'narrative',
                text: 'Your first day at the academy comes to an end. The choices you made have already started to shape your relationships.',
              },
              {
                type: 'narrative',
                text: 'Tomorrow brings new challenges and deeper connections. Who will you trust with your heart?',
              },
            ],
            choice: {
              prompt: 'Ready for Chapter 2?',
              options: [
                {
                  id: 'continue',
                  text: 'Continue to Chapter 2',
                  nextSceneId: 'redirect_to_chapter_2',
                },
              ],
            },
          },
          redirect_to_chapter_2: {
            background: 'https://via.placeholder.com/800x400/7c2d12/ffffff?text=Loading',
            timeline: [
              {
                type: 'narrative',
                text: 'Loading Chapter 2...',
              },
            ],
          },
        },
      });

      await storyContent1.save();
      
      return { 
        success: true, 
        message: 'Hearts of Steel Academy story added successfully!',
        storyId: story.id,
        chapters: [savedChapter1.id, savedChapter2.id]
      };

    } catch (error) {
      console.error('Error adding romance story:', error);
      return { success: false, error: error.message };
    }
  }

  @Public()
  @Get('stories')
  async listStories() {
    const stories = await this.storyRepository.find({
      relations: ['chapters']
    });
    return { stories };
  }

  @Public()
  @Post('test-chapter')
  async testChapter(@Body() body: { storyId: string; chapterNumber: number }) {
    try {
      // Find the chapter
      const chapter = await this.chapterRepository.findOne({
        where: {
          storyId: body.storyId,
          chapterNumber: body.chapterNumber
        }
      });

      if (!chapter) {
        return { success: false, error: `Chapter ${body.chapterNumber} not found for story ${body.storyId}` };
      }

      // Find the story content
      const storyContent = await this.storyContentModel.findOne({
        chapterId: chapter.id
      });

      if (!storyContent) {
        return { success: false, error: `Story content not found for chapter ${chapter.id}` };
      }

      return { 
        success: true, 
        chapter: {
          id: chapter.id,
          title: chapter.title,
          chapterNumber: chapter.chapterNumber
        },
        hasContent: !!storyContent,
        scenesCount: storyContent?.scenes ? Object.keys(storyContent.scenes).length : 0
      };
    } catch (error) {
      console.error('Error testing chapter:', error);
      return { success: false, error: error.message };
    }
  }

  @Public()
  @Post('force-seed')
  async forceSeed() {
    try {
      console.log('🗑️ Force clearing all data...');
      // Clear existing data
      await this.storyContentModel.deleteMany({});
      await this.chapterRepository.delete({});
      await this.storyRepository.delete({});

      console.log('🌱 Force seeding data...');
      // Re-seed data (you'll need to import and call the seed methods)
      // For now, let's just return success and the user can restart the backend
      return { 
        success: true, 
        message: 'Data cleared. Please restart the backend to trigger full seed.' 
      };
    } catch (error) {
      console.error('Error force seeding:', error);
      return { success: false, error: error.message };
    }
  }

  @Public()
  @Post('populate-hearts-content')
  async populateHeartsContent() {
    try {
      // Find Hearts of Steel Academy story and chapters
      const story = await this.storyRepository.findOne({
        where: { title: 'Hearts of Steel Academy' }
      });
      
      if (!story) {
        return { success: false, error: 'Hearts of Steel Academy story not found' };
      }
      
      const chapters = await this.chapterRepository.find({
        where: { storyId: story.id },
        order: { chapterNumber: 'ASC' }
      });
      
      if (chapters.length < 2) {
        return { success: false, error: 'Not enough chapters found' };
      }
      
      const chapter1 = chapters.find(c => c.chapterNumber === 1);
      const chapter2 = chapters.find(c => c.chapterNumber === 2);
      
      if (!chapter1 || !chapter2) {
        return { success: false, error: 'Could not find both Chapter 1 and Chapter 2' };
      }
      
      // Delete existing content for this story
      await this.storyContentModel.deleteMany({ storyId: story.id });
      
      // Create Chapter 1 content
      const storyContent1 = new this.storyContentModel({
        chapterId: chapter1.id,
        storyId: story.id,
        chapterNumber: 1,
        scenes: {
          scene_1: {
            background: 'https://via.placeholder.com/800x400/1f2937/ffffff?text=Military+Academy+Gates',
            music: 'https://example.com/music/intense.mp3',
            timeline: [
              {
                type: 'narrative',
                text: 'The iron gates of Hearts of Steel Academy close behind you with a thunderous clang. There is no turning back now.',
              },
              {
                type: 'dialogue',
                character: 'Drill Sergeant',
                text: 'Welcome to hell, recruits! Only the strongest survive here. The weak get shipped home in body bags.',
                characterImage: 'https://via.placeholder.com/150x150/374151/ffffff?text=Sergeant',
              },
              {
                type: 'narrative',
                text: 'Your heart pounds as you look around at your fellow cadets. Two figures immediately catch your attention...',
              },
            ],
            nextSceneId: 'scene_2',
          },
          scene_2: {
            background: 'https://via.placeholder.com/800x400/1f2937/ffffff?text=Academy+Courtyard',
            timeline: [
              {
                type: 'dialogue',
                character: 'Captain Drake',
                text: 'I am Captain Drake, your squad leader. I do not coddle weaklings, but I protect those who prove their worth.',
                characterImage: 'https://via.placeholder.com/150x150/dc2626/ffffff?text=Drake',
              },
              {
                type: 'narrative',
                text: 'Captain Drakes piercing green eyes seem to see right through you. His reputation as both a brilliant tactician and a heartbreaker precedes him.',
              },
              {
                type: 'dialogue',
                character: 'Lieutenant Phoenix',
                text: 'Do not listen to Drakes intimidation tactics. I am Phoenix, and I believe strength comes from unity, not fear.',
                characterImage: 'https://via.placeholder.com/150x150/059669/ffffff?text=Phoenix',
              },
              {
                type: 'narrative',
                text: 'Lieutenant Phoenix steps forward with a warm smile that contrasts sharply with Drakes cold demeanor. The tension between them is palpable.',
              },
            ],
            choice: {
              prompt: 'Both officers are watching you intently. How do you respond?',
              options: [
                {
                  id: 'challenge_drake',
                  text: 'Look Drake directly in the eyes: "I did not come here to be coddled."',
                  nextSceneId: 'scene_3a',
                  relationshipEffect: {
                    character: 'Drake',
                    change: 3,
                  },
                },
                {
                  id: 'support_phoenix',
                  text: 'Nod to Phoenix: "Unity and strength are not mutually exclusive."',
                  nextSceneId: 'scene_3b',
                  relationshipEffect: {
                    character: 'Phoenix',
                    change: 3,
                  },
                },
                {
                  id: 'diplomatic',
                  text: 'Address both: "I am here to learn from everyone, including both of you."',
                  nextSceneId: 'scene_3c',
                  relationshipEffect: {
                    character: 'Drake',
                    change: 1,
                  },
                },
              ],
            },
          },
          scene_3a: {
            background: 'https://via.placeholder.com/800x400/1f2937/ffffff?text=Academy+Courtyard',
            timeline: [
              {
                type: 'dialogue',
                character: 'Captain Drake',
                text: 'A slow smile spreads across his face. Interesting. You have got fire in you. I like that.',
              },
              {
                type: 'narrative',
                text: 'Drake steps closer, his intense gaze never leaving yours. You can feel Phoenix watching with obvious concern.',
              },
              {
                type: 'dialogue',
                character: 'Lieutenant Phoenix',
                text: 'Quietly to you: Be careful. Drakes attention can be... dangerous.',
              },
            ],
            nextSceneId: 'scene_4',
          },
          scene_3b: {
            background: 'https://via.placeholder.com/800x400/1f2937/ffffff?text=Academy+Courtyard',
            timeline: [
              {
                type: 'dialogue',
                character: 'Lieutenant Phoenix',
                text: 'Eyes lighting up: Exactly! Someone who understands true strength. I knew you were different.',
              },
              {
                type: 'narrative',
                text: 'Phoenix genuine warmth makes your heart flutter. In the corner of your eye, you see Drakes jaw clench.',
              },
              {
                type: 'dialogue',
                character: 'Captain Drake',
                text: 'Coldly: Pretty words will not stop bullets, Phoenix. Do not fill their head with fairy tales.',
              },
            ],
            nextSceneId: 'scene_4',
          },
          scene_3c: {
            background: 'https://via.placeholder.com/800x400/1f2937/ffffff?text=Academy+Courtyard',
            timeline: [
              {
                type: 'dialogue',
                character: 'Captain Drake',
                text: 'Slightly impressed: Diplomatic. That is... unexpected here.',
              },
              {
                type: 'dialogue',
                character: 'Lieutenant Phoenix',
                text: 'Smiling: And wise. It takes courage to seek middle ground.',
              },
              {
                type: 'narrative',
                text: 'Both officers seem intrigued by your balanced approach, but you sense this neutrality will not last long in this place.',
              },
            ],
            nextSceneId: 'scene_4',
          },
          scene_4: {
            background: 'https://via.placeholder.com/800x400/374151/ffffff?text=Academy+Barracks',
            timeline: [
              {
                type: 'narrative',
                text: 'Later that evening in the barracks, you are exhausted from your first day of brutal training. A knock on your door interrupts your thoughts.',
              },
              {
                type: 'dialogue',
                character: 'Phoenix',
                text: 'Speaking quietly: Hey, can I come in? I wanted to check on you after today.',
              },
              {
                type: 'narrative',
                text: 'Phoenix enters with two cups of hot coffee, their concern genuine and touching.',
              },
              {
                type: 'dialogue',
                character: 'Phoenix',
                text: 'Drake was harder on you than usual today. Do not take it personally - he tests everyone he sees potential in.',
              },
            ],
            choice: {
              prompt: 'Phoenix is being incredibly kind. How do you respond?',
              options: [
                {
                  id: 'vulnerable',
                  text: '"Thank you... I really needed this kindness today."',
                  nextSceneId: 'end_chapter_1',
                  relationshipEffect: {
                    character: 'Phoenix',
                    change: 2,
                  },
                },
                {
                  id: 'strong',
                  text: '"I can handle Drake. But I appreciate you looking out for me."',
                  nextSceneId: 'end_chapter_1',
                  relationshipEffect: {
                    character: 'Phoenix',
                    change: 1,
                  },
                },
              ],
            },
          },
          end_chapter_1: {
            background: 'https://via.placeholder.com/800x400/374151/ffffff?text=Academy+Barracks',
            timeline: [
              {
                type: 'narrative',
                text: 'As you share this quiet moment with Phoenix, you realize that Hearts of Steel Academy will test more than just your physical strength. Your heart is already being pulled in dangerous directions...',
              },
              {
                type: 'narrative',
                text: 'Chapter 1 Complete. Continue to Chapter 2 to face the Crucible...',
              },
            ],
          },
        },
      });
      
      await storyContent1.save();
      
      // Create Chapter 2 content
      const storyContent2 = new this.storyContentModel({
        chapterId: chapter2.id,
        storyId: story.id,
        chapterNumber: 2,
        scenes: {
          scene_1: {
            background: 'https://via.placeholder.com/800x400/7c2d12/ffffff?text=Training+Grounds',
            music: 'https://example.com/music/tension.mp3',
            timeline: [
              {
                type: 'narrative',
                text: 'Dawn breaks blood-red over the training grounds. Today test will determine more than your military ranking - it will decide who lives and who dies.',
              },
              {
                type: 'dialogue',
                character: 'Captain Drake',
                text: 'Today you face the Crucible. A simulation so real, so brutal, that some cadets never recover from the psychological trauma.',
                characterImage: 'https://via.placeholder.com/150x150/dc2626/ffffff?text=Drake',
              },
              {
                type: 'narrative',
                text: 'Drake eyes find yours across the formation. Is that concern flickering behind his cold facade?',
              },
            ],
            nextSceneId: 'scene_2',
          },
          scene_2: {
            background: 'https://via.placeholder.com/800x400/7c2d12/ffffff?text=Simulation+Chamber',
            timeline: [
              {
                type: 'dialogue',
                character: 'Phoenix',
                text: 'Whispering urgently: The simulation will try to break you psychologically. Whatever you see, remember - I believe in you.',
              },
              {
                type: 'narrative',
                text: 'As Phoenix speaks, you notice Drake watching your interaction with an unreadable expression.',
              },
              {
                type: 'dialogue',
                character: 'System Voice',
                text: 'Simulation initiating. Scenario: Hostage rescue. Civilian casualties will result in immediate failure.',
              },
              {
                type: 'narrative',
                text: 'The world around you shifts and warps. Suddenly you are in a war-torn city, gunfire echoing from all directions.',
              },
            ],
            choice: {
              prompt: 'The simulation has begun. Enemy snipers have Phoenix pinned down. Drake is injured but still fighting. Who do you save first?',
              options: [
                {
                  id: 'save_phoenix',
                  text: 'Rush to Phoenix aid, risking everything for love',
                  nextSceneId: 'scene_3a',
                  relationshipEffect: {
                    character: 'Phoenix',
                    change: 6,
                  },
                },
                {
                  id: 'save_drake',
                  text: 'Help Drake - duty over heart',
                  nextSceneId: 'scene_3b',
                  relationshipEffect: {
                    character: 'Drake',
                    change: 6,
                  },
                },
                {
                  id: 'tactical_solution',
                  text: 'Use strategy to save both (Requires premium romance flag)',
                  nextSceneId: 'scene_3c',
                  cost: 0,
                  currency: 'diamonds',
                  flag: 'tactical_genius',
                },
              ],
            },
          },
          scene_3a: {
            background: 'https://via.placeholder.com/800x400/dc2626/ffffff?text=Under+Fire',
            timeline: [
              {
                type: 'narrative',
                text: 'You sprint across the battlefield, bullets whizzing past your head. Phoenix eyes widen as you reach them.',
              },
              {
                type: 'dialogue',
                character: 'Phoenix',
                text: 'You came for me... I knew you cared.',
              },
              {
                type: 'narrative',
                text: 'As you help Phoenix to safety, you hear Drake cursing in the distance. The choice has been made.',
              },
            ],
            nextSceneId: 'scene_4',
          },
          scene_3b: {
            background: 'https://via.placeholder.com/800x400/dc2626/ffffff?text=Under+Fire',
            timeline: [
              {
                type: 'narrative',
                text: 'You rush to Drakes position, providing covering fire as he tends to his wounds.',
              },
              {
                type: 'dialogue',
                character: 'Captain Drake',
                text: 'Smart choice. Duty first. I respect that.',
              },
              {
                type: 'narrative',
                text: 'You see Phoenix looking hurt in the distance, not just from enemy fire.',
              },
            ],
            nextSceneId: 'scene_4',
          },
          scene_3c: {
            background: 'https://via.placeholder.com/800x400/dc2626/ffffff?text=Under+Fire',
            timeline: [
              {
                type: 'narrative',
                text: 'You use a tactical flanking maneuver to neutralize the snipers, saving both Drake and Phoenix.',
              },
              {
                type: 'dialogue',
                character: 'Captain Drake',
                text: 'Brilliant tactical thinking. You have the mind of a true leader.',
              },
              {
                type: 'dialogue',
                character: 'Phoenix',
                text: 'And the heart to save everyone. That is what makes you special.',
              },
            ],
            nextSceneId: 'scene_4',
          },
          scene_4: {
            background: 'https://via.placeholder.com/800x400/374151/ffffff?text=Simulation+End',
            timeline: [
              {
                type: 'narrative',
                text: 'The simulation ends abruptly. You have passed the Crucible, but the real test is just beginning...',
              },
              {
                type: 'dialogue',
                character: 'Captain Drake',
                text: 'Meet me in my office tonight. We need to discuss your... performance.',
              },
              {
                type: 'dialogue',
                character: 'Phoenix',
                text: 'Whatever Drake wants, be careful. There are things about this academy you do not know yet.',
              },
              {
                type: 'narrative',
                text: 'Chapter 2 Complete. The academy holds darker secrets than you imagined...',
              },
            ],
          },
        },
      });
      
      await storyContent2.save();
      
      return {
        success: true,
        message: 'Hearts of Steel Academy content populated successfully',
        storyId: story.id,
        chaptersCreated: 2,
        chapter1Scenes: Object.keys(storyContent1.scenes).length,
        chapter2Scenes: Object.keys(storyContent2.scenes).length
      };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Public()
  @Post('reset-user-progress')
  async resetUserProgress(@Body() body: { userId: string, storyId?: string }) {
    try {
      const { userId, storyId } = body;
      
      if (!userId) {
        return { success: false, error: 'userId is required' };
      }

      const query = storyId ? { userId, storyId } : { userId };
      const result = await this.playerProgressModel.deleteMany(query);
      
      return {
        success: true,
        message: `Reset ${result.deletedCount} progress records for user ${userId}${storyId ? ` in story ${storyId}` : ''}`,
        deletedCount: result.deletedCount
      };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Public()
  @Get('check-content-keys')
  async checkContentKeys() {
    try {
      const stories = await this.storyRepository.find({ relations: ['chapters'] });
      const results = [];

      for (const story of stories) {
        for (const chapter of story.chapters) {
          const content = await this.storyContentModel.findOne({
            chapterId: chapter.id,
            storyId: story.id
          });

          if (!content) {
            results.push({
              storyId: story.id,
              storyTitle: story.title,
              chapterId: chapter.id,
              chapterNumber: chapter.chapterNumber,
              chapterTitle: chapter.title,
              issue: 'No content found',
              hasScenes: false,
              sceneCount: 0
            });
          } else {
            const sceneKeys = Object.keys(content.scenes || {});
            results.push({
              storyId: story.id,
              storyTitle: story.title,
              chapterId: chapter.id,
              chapterNumber: chapter.chapterNumber,
              chapterTitle: chapter.title,
              issue: sceneKeys.length === 0 ? 'No scenes in content' : null,
              hasScenes: sceneKeys.length > 0,
              sceneCount: sceneKeys.length,
              sceneKeys
            });
          }
        }
      }

      return {
        success: true,
        message: 'Content key check completed',
        results,
        summary: {
          totalChapters: results.length,
          chaptersWithContent: results.filter(r => r.hasScenes).length,
          chaptersWithIssues: results.filter(r => r.issue).length
        }
      };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Public()
  @Get('check-user-progress/:userId')
  async checkUserProgress(@Param('userId') userId: string): Promise<any> {
    try {
      const progressRecords = await this.playerProgressModel.find({ userId });
      
      return {
        success: true,
        message: `Found ${progressRecords.length} progress records for user ${userId}`,
        progressRecords: progressRecords.map((record: any) => ({
          storyId: record.storyId,
          currentChapterId: record.currentChapterId,
          currentSceneId: record.currentSceneId,
          relationshipScores: record.relationshipScores,
          choicesMade: record.choicesMade,
          lastPlayedAt: record.lastPlayedAt
        }))
      };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Public()
  @Post('handle-duplicate-signup')
  async handleDuplicateSignup(@Body() body: { email: string }) {
    try {
      const { email } = body;
      
      if (!email) {
        return { success: false, error: 'email is required' };
      }

      // Check for existing users (User entity only has email, not username)
      const existingByEmail = await this.userRepository.findOne({ where: { email } });

      const conflicts = [];
      if (existingByEmail) conflicts.push({ field: 'email', value: email, userId: existingByEmail.id });

      return {
        success: true,
        message: `Found ${conflicts.length} existing user conflicts`,
        conflicts,
        canSignup: conflicts.length === 0,
        recommendations: conflicts.length > 0 ? [
          'Try different email',
          'Use login instead if this is your account',
          'Reset password if you forgot credentials'
        ] : ['Signup should succeed with this email']
      };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}