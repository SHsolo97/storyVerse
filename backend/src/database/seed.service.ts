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
    if (true) {
      console.log('�️  Clearing existing data for reseed...');
      // Clear existing data in development
      await this.storyContentModel.deleteMany({});
      await this.chapterRepository.delete({});
      await this.storyRepository.delete({});
    }

    console.log('🌱 Seeding sample data...');

    // Create sample stories
    const story1 = await this.createSampleStory1();
    const story2 = await this.createSampleStory2();
    const story3 = await this.createRomanceStory();

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

    // Create chapter 1
    const chapter1 = this.chapterRepository.create({
      storyId: savedStory.id,
      chapterNumber: 1,
      title: 'Arrival at the Academy',
      isPublished: true,
    });
    const savedChapter1 = await this.chapterRepository.save(chapter1);

    // Create chapter 2
    const chapter2 = this.chapterRepository.create({
      storyId: savedStory.id,
      chapterNumber: 2,
      title: 'First Day of Classes',
      isPublished: true,
    });
    const savedChapter2 = await this.chapterRepository.save(chapter2);

    // Create story content for Chapter 1
    const storyContent1 = new this.storyContentModel({
      chapterId: savedChapter1.id,
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

    await storyContent1.save();

    // Create story content for Chapter 2
    const storyContent2 = new this.storyContentModel({
      chapterId: savedChapter2.id,
      storyId: savedStory.id,
      chapterNumber: 2,
      scenes: {
        scene_1: {
          background: 'https://example.com/backgrounds/academy_classroom.jpg',
          music: 'https://example.com/music/academic.mp3',
          timeline: [
            {
              type: 'narrative',
              text: 'The morning sun streams through the tall windows of your first classroom. Today marks the beginning of your real education at the Royal Academy.',
            },
            {
              type: 'dialogue',
              character: 'Professor Miriam',
              text: 'Welcome to Advanced Magical Theory. I trust you\'ve all prepared for today\'s practical examination.',
              characterImage: 'https://example.com/characters/professor_miriam.png',
            },
          ],
          nextSceneId: 'scene_2',
        },
        scene_2: {
          background: 'https://example.com/backgrounds/academy_classroom.jpg',
          timeline: [
            {
              type: 'narrative',
              text: 'A magical examination on your first day? You glance around at your fellow students, some looking confident, others nervous.',
            },
            {
              type: 'dialogue',
              character: 'Adrian',
              text: 'Don\'t worry, I can help you if you need it. We\'re all in this together.',
              characterImage: 'https://example.com/characters/adrian.png',
            },
          ],
          choice: {
            prompt: 'How do you approach the examination?',
            options: [
              {
                id: 'accept_help',
                text: 'Accept Adrian\'s help gratefully',
                nextSceneId: 'scene_3a',
                relationshipEffect: {
                  character: 'Adrian',
                  change: 3,
                },
              },
              {
                id: 'go_alone',
                text: 'Politely decline and work independently',
                nextSceneId: 'scene_3b',
                relationshipEffect: {
                  character: 'Adrian',
                  change: 1,
                },
              },
              {
                id: 'premium_tutor',
                text: 'Hire a private tutor (30 Diamonds)',
                cost: 30,
                currency: 'diamonds',
                nextSceneId: 'scene_3c',
                flag: 'academic_advantage',
              },
            ],
          },
        },
        scene_3a: {
          background: 'https://example.com/backgrounds/academy_classroom.jpg',
          timeline: [
            {
              type: 'narrative',
              text: 'Adrian\'s guidance proves invaluable. With his help, you successfully complete the examination and even impress Professor Miriam.',
            },
            {
              type: 'dialogue',
              character: 'Professor Miriam',
              text: 'Excellent teamwork. The Academy values both individual skill and collaborative spirit.',
            },
          ],
        },
        scene_3b: {
          background: 'https://example.com/backgrounds/academy_classroom.jpg',
          timeline: [
            {
              type: 'narrative',
              text: 'Your independent approach shows determination. You struggle at first but eventually find your own path to the solution.',
            },
            {
              type: 'dialogue',
              character: 'Professor Miriam',
              text: 'Impressive self-reliance. You have the makings of a true scholar.',
            },
          ],
        },
        scene_3c: {
          background: 'https://example.com/backgrounds/academy_classroom.jpg',
          timeline: [
            {
              type: 'narrative',
              text: 'The private tutor\'s expert knowledge gives you a significant advantage. You complete the examination flawlessly, earning the admiration of both professor and peers.',
            },
            {
              type: 'dialogue',
              character: 'Professor Miriam',
              text: 'Outstanding work! Such preparation and excellence will take you far in your studies.',
            },
          ],
        },
      },
    });

    await storyContent2.save();
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

  private async createRomanceStory() {
    // Create story
    const story = this.storyRepository.create({
      title: 'Hearts of Steel Academy',
      description: 'At an elite military academy, you must navigate dangerous training, dark conspiracies, and two irresistible romantic interests who will stop at nothing to win your heart.',
      coverImageUrl: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Hearts+of+Steel',
      genre: 'Romance',
      isPublished: true,
    });
    const savedStory = await this.storyRepository.save(story);

    // Create chapter 1
    const chapter1 = this.chapterRepository.create({
      storyId: savedStory.id,
      chapterNumber: 1,
      title: 'Welcome to Hell',
      isPublished: true,
    });
    const savedChapter1 = await this.chapterRepository.save(chapter1);

    // Create chapter 2
    const chapter2 = this.chapterRepository.create({
      storyId: savedStory.id,
      chapterNumber: 2,
      title: 'Dangerous Alliances',
      isPublished: true,
    });
    const savedChapter2 = await this.chapterRepository.save(chapter2);

    // Create story content for Chapter 1
    const storyContent1 = new this.storyContentModel({
      chapterId: savedChapter1.id,
      storyId: savedStory.id,
      chapterNumber: 1,
      scenes: {
        scene_1: {
          background: 'https://via.placeholder.com/800x400/1f2937/ffffff?text=Military+Academy+Gates',
          music: 'https://example.com/music/intense.mp3',
          timeline: [
            {
              type: 'narrative',
              text: 'The iron gates of Hearts of Steel Academy close behind you with a thunderous clang. There\'s no turning back now.',
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
              text: 'I\'m Captain Drake, your squad leader. I don\'t coddle weaklings, but I protect those who prove their worth.',
              characterImage: 'https://via.placeholder.com/150x150/dc2626/ffffff?text=Drake',
            },
            {
              type: 'narrative',
              text: 'Captain Drake\'s piercing green eyes seem to see right through you. His reputation as both a brilliant tactician and a heartbreaker precedes him.',
            },
            {
              type: 'dialogue',
              character: 'Lieutenant Phoenix',
              text: 'Don\'t listen to Drake\'s intimidation tactics. I\'m Phoenix, and I believe strength comes from unity, not fear.',
              characterImage: 'https://via.placeholder.com/150x150/059669/ffffff?text=Phoenix',
            },
            {
              type: 'narrative',
              text: 'Lieutenant Phoenix steps forward with a warm smile that contrasts sharply with Drake\'s cold demeanor. The tension between them is palpable.',
            },
          ],
          choice: {
            prompt: 'Both officers are watching you intently. How do you respond?',
            options: [
              {
                id: 'challenge_drake',
                text: 'Look Drake directly in the eyes: "I didn\'t come here to be coddled."',
                nextSceneId: 'scene_3a',
                relationshipEffect: {
                  character: 'Drake',
                  change: 3,
                },
              },
              {
                id: 'support_phoenix',
                text: 'Nod to Phoenix: "Unity and strength aren\'t mutually exclusive."',
                nextSceneId: 'scene_3b',
                relationshipEffect: {
                  character: 'Phoenix',
                  change: 3,
                },
              },
              {
                id: 'diplomatic',
                text: 'Address both: "I\'m here to learn from everyone, including both of you."',
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
              text: '*A slow smile spreads across his face* Interesting. You\'ve got fire in you. I like that.',
            },
            {
              type: 'narrative',
              text: 'Drake steps closer, his intense gaze never leaving yours. You can feel Phoenix watching with obvious concern.',
            },
            {
              type: 'dialogue',
              character: 'Lieutenant Phoenix',
              text: '*Quietly to you* Be careful. Drake\'s attention can be... dangerous.',
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
              text: '*Eyes lighting up* Exactly! Someone who understands true strength. I knew you were different.',
            },
            {
              type: 'narrative',
              text: 'Phoenix\'s genuine warmth makes your heart flutter. In the corner of your eye, you see Drake\'s jaw clench.',
            },
            {
              type: 'dialogue',
              character: 'Captain Drake',
              text: '*Coldly* Pretty words won\'t stop bullets, Phoenix. Don\'t fill their head with fairy tales.',
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
              text: '*Slightly impressed* Diplomatic. That\'s... unexpected here.',
            },
            {
              type: 'dialogue',
              character: 'Lieutenant Phoenix',
              text: '*Smiling* And wise. It takes courage to seek middle ground.',
            },
            {
              type: 'narrative',
              text: 'Both officers seem intrigued by your balanced approach, but you sense this neutrality won\'t last long in this place.',
            },
          ],
          nextSceneId: 'scene_4',
        },
        scene_4: {
          background: 'https://via.placeholder.com/800x400/374151/ffffff?text=Academy+Barracks',
          timeline: [
            {
              type: 'narrative',
              text: 'Later that evening in the barracks, you\'re exhausted from your first day of brutal training. A knock on your door interrupts your thoughts.',
            },
            {
              type: 'dialogue',
              character: 'Phoenix',
              text: '*Speaking quietly* Hey, can I come in? I wanted to check on you after today.',
            },
            {
              type: 'narrative',
              text: 'Phoenix enters with two cups of hot coffee, their concern genuine and touching.',
            },
            {
              type: 'dialogue',
              character: 'Phoenix',
              text: 'Drake was harder on you than usual today. Don\'t take it personally - he tests everyone he sees potential in.',
            },
          ],
          choice: {
            prompt: 'Phoenix is being incredibly kind. How do you respond?',
            options: [
              {
                id: 'vulnerable',
                text: '"Thank you... I really needed this kindness today."',
                nextSceneId: 'scene_5a',
                relationshipEffect: {
                  character: 'Phoenix',
                  change: 4,
                },
              },
              {
                id: 'curious_about_drake',
                text: '"What\'s the story between you and Drake? The tension is obvious."',
                nextSceneId: 'scene_5b',
                flag: 'learned_history',
              },
              {
                id: 'professional',
                text: '"I can handle Drake. I didn\'t come here for an easy ride."',
                nextSceneId: 'scene_5c',
                relationshipEffect: {
                  character: 'Phoenix',
                  change: 1,
                },
              },
            ],
          },
        },
        scene_5a: {
          background: 'https://via.placeholder.com/800x400/374151/ffffff?text=Barracks+Room',
          timeline: [
            {
              type: 'dialogue',
              character: 'Phoenix',
              text: '*Moving closer* You don\'t have to be strong all the time. Not with me.',
            },
            {
              type: 'narrative',
              text: 'The moment hangs between you, charged with possibility. Phoenix\'s hand almost touches yours...',
            },
            {
              type: 'dialogue',
              character: 'Captain Drake',
              text: '*From the doorway* How touching. Phoenix, we need to talk. Now.',
            },
            {
              type: 'narrative',
              text: 'Drake\'s voice cuts through the intimate moment like a blade. Phoenix reluctantly stands, but their eyes promise this conversation isn\'t over.',
            },
          ],
          nextSceneId: 'scene_6',
        },
        scene_5b: {
          background: 'https://via.placeholder.com/800x400/374151/ffffff?text=Barracks+Room',
          timeline: [
            {
              type: 'dialogue',
              character: 'Phoenix',
              text: '*Hesitating* Drake and I... we have history. We were partners once, before everything changed.',
            },
            {
              type: 'narrative',
              text: 'Phoenix\'s voice carries old pain. There\'s clearly more to this story.',
            },
            {
              type: 'dialogue',
              character: 'Phoenix',
              text: 'He wasn\'t always so cold. But sometimes people build walls to protect themselves from getting hurt again.',
            },
            {
              type: 'dialogue',
              character: 'Captain Drake',
              text: '*Appearing suddenly* Sharing war stories, Phoenix? How... nostalgic.',
            },
          ],
          nextSceneId: 'scene_6',
        },
        scene_5c: {
          background: 'https://via.placeholder.com/800x400/374151/ffffff?text=Barracks+Room',
          timeline: [
            {
              type: 'dialogue',
              character: 'Phoenix',
              text: '*Admiringly* That\'s exactly the attitude that will keep you alive here. I respect that.',
            },
            {
              type: 'narrative',
              text: 'Phoenix\'s respect means more to you than you expected. There\'s something special about earning their approval.',
            },
            {
              type: 'dialogue',
              character: 'Captain Drake',
              text: '*From behind* Good. Because I\'m about to make things much harder.',
            },
          ],
          nextSceneId: 'scene_6',
        },
        scene_6: {
          background: 'https://via.placeholder.com/800x400/374151/ffffff?text=Barracks+Room',
          timeline: [
            {
              type: 'dialogue',
              character: 'Captain Drake',
              text: 'There\'s been a security breach. Someone\'s been feeding information to our enemies. Everyone is a suspect.',
            },
            {
              type: 'narrative',
              text: 'The room suddenly feels cold. Drake\'s eyes move between you and Phoenix with calculating suspicion.',
            },
            {
              type: 'dialogue',
              character: 'Lieutenant Phoenix',
              text: 'You can\'t seriously think it\'s one of us, Drake. We\'re on the same side.',
            },
            {
              type: 'dialogue',
              character: 'Captain Drake',
              text: '*To you* Tomorrow you\'ll be tested. The kind of test that reveals who you really are. Sleep well.',
            },
            {
              type: 'narrative',
              text: 'As Drake leaves, Phoenix moves closer to you, their voice urgent and worried.',
            },
            {
              type: 'dialogue',
              character: 'Phoenix',
              text: 'Whatever Drake has planned, remember - I\'ll always have your back. Always.',
            },
          ],
          choice: {
            prompt: 'The stakes have suddenly escalated. What do you do?',
            options: [
              {
                id: 'trust_phoenix',
                text: '*Take Phoenix\'s hand* "I trust you. We\'ll face this together."',
                nextSceneId: 'chapter_2_preview',
                relationshipEffect: {
                  character: 'Phoenix',
                  change: 5,
                },
                flag: 'phoenix_alliance',
              },
              {
                id: 'investigate_alone',
                text: '"I need to handle this myself. Trust is a luxury I can\'t afford."',
                nextSceneId: 'chapter_2_preview',
                flag: 'lone_wolf',
              },
              {
                id: 'seek_drake',
                text: '"I\'m going to find Drake. There\'s more to this story."',
                nextSceneId: 'chapter_2_preview',
                relationshipEffect: {
                  character: 'Drake',
                  change: 3,
                },
                flag: 'drake_investigation',
              },
            ],
          },
        },
        chapter_2_preview: {
          background: 'https://via.placeholder.com/800x400/7c2d12/ffffff?text=Chapter+2+Coming',
          timeline: [
            {
              type: 'narrative',
              text: '💕 CHAPTER 1 COMPLETE 💕',
            },
            {
              type: 'narrative',
              text: 'Your choices have set dangerous wheels in motion. Drake\'s test will push you to your limits, Phoenix\'s secrets threaten to tear you apart, and someone close to you is lying...',
            },
            {
              type: 'narrative',
              text: 'In Chapter 2: "Dangerous Alliances" - Uncover the traitor, navigate a deadly training mission, and make a choice that will determine not just your survival, but your heart\'s desire.',
            },
            {
              type: 'narrative',
              text: '💎 Continue to Chapter 2 to discover whose arms you\'ll fall into... and whose secrets could destroy you both. 💎',
            },
          ],
          choice: {
            prompt: 'Ready for the next chapter?',
            options: [
              {
                id: 'continue_chapter_2',
                text: '💕 Continue to Chapter 2 (10 Keys)',
                cost: 10,
                currency: 'keys',
                nextSceneId: 'redirect_to_chapter_2',
              },
              {
                id: 'premium_chapter_2',
                text: '💎 Premium Path - Unlock all romance options (25 Diamonds)',
                cost: 25,
                currency: 'diamonds',
                nextSceneId: 'redirect_to_chapter_2',
                flag: 'premium_romance',
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

    // Create story content for Chapter 2
    const storyContent2 = new this.storyContentModel({
      chapterId: savedChapter2.id,
      storyId: savedStory.id,
      chapterNumber: 2,
      scenes: {
        scene_1: {
          background: 'https://via.placeholder.com/800x400/7c2d12/ffffff?text=Training+Grounds',
          music: 'https://example.com/music/tension.mp3',
          timeline: [
            {
              type: 'narrative',
              text: 'Dawn breaks blood-red over the training grounds. Today\'s test will determine more than your military ranking - it will decide who lives and who dies.',
            },
            {
              type: 'dialogue',
              character: 'Captain Drake',
              text: 'Today you face the Crucible. A simulation so real, so brutal, that some cadets never recover from the psychological trauma.',
              characterImage: 'https://via.placeholder.com/150x150/dc2626/ffffff?text=Drake',
            },
            {
              type: 'narrative',
              text: 'Drake\'s eyes find yours across the formation. Is that concern flickering behind his cold facade?',
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
              text: '*Whispering urgently* The simulation will try to break you psychologically. Whatever you see, remember - I believe in you.',
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
              text: 'The world around you shifts and warps. Suddenly you\'re in a war-torn city, gunfire echoing from all directions.',
            },
          ],
          choice: {
            prompt: 'The simulation has begun. Enemy snipers have Phoenix pinned down. Drake is injured but still fighting. Who do you save first?',
            options: [
              {
                id: 'save_phoenix',
                text: 'Rush to Phoenix\'s aid, risking everything for love',
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
              text: 'You sprint across the battlefield, bullets whizzing past your head. Phoenix\'s eyes widen as you reach them.',
            },
            {
              type: 'dialogue',
              character: 'Phoenix',
              text: '*Breathless* You came for me... even though Drake needed help too.',
            },
            {
              type: 'narrative',
              text: 'In the heat of battle, Phoenix pulls you close, their lips almost touching yours.',
            },
            {
              type: 'dialogue',
              character: 'Phoenix',
              text: 'If we don\'t make it out of this simulation... I need you to know that I—',
            },
            {
              type: 'dialogue',
              character: 'Captain Drake',
              text: '*Over comms, weakly* Target... eliminated. You\'re clear to move.',
            },
          ],
          nextSceneId: 'scene_4',
        },
        scene_3b: {
          background: 'https://via.placeholder.com/800x400/dc2626/ffffff?text=Under+Fire',
          timeline: [
            {
              type: 'narrative',
              text: 'You reach Drake just as he\'s about to be overwhelmed. His surprise at your choice is evident.',
            },
            {
              type: 'dialogue',
              character: 'Captain Drake',
              text: '*Grimly* You chose duty. Good. That\'s what I would have done.',
            },
            {
              type: 'narrative',
              text: 'But there\'s something else in his eyes - relief? Gratitude? Something deeper?',
            },
            {
              type: 'dialogue',
              character: 'Captain Drake',
              text: '*Quietly* Phoenix is safe. I made sure of that before you arrived.',
            },
            {
              type: 'narrative',
              text: 'Drake\'s admission reveals he was protecting Phoenix even while injured. The layers of this man run deeper than you thought.',
            },
          ],
          nextSceneId: 'scene_4',
        },
        scene_3c: {
          background: 'https://via.placeholder.com/800x400/059669/ffffff?text=Tactical+Genius',
          timeline: [
            {
              type: 'narrative',
              text: 'Instead of choosing, you quickly analyze the battlefield. There\'s a way to save both - risky, but possible.',
            },
            {
              type: 'dialogue',
              character: 'System Voice',
              text: 'Tactical innovation detected. Calculating probability of success...',
            },
            {
              type: 'narrative',
              text: 'Your plan works perfectly. Both Drake and Phoenix are saved, and you\'ve proven you can think outside conventional parameters.',
            },
            {
              type: 'dialogue',
              character: 'Phoenix',
              text: '*In awe* That was incredible! You found a way to save everyone.',
            },
            {
              type: 'dialogue',
              character: 'Captain Drake',
              text: '*Impressed despite himself* Unconventional, but effective. I... may have underestimated you.',
            },
          ],
          nextSceneId: 'scene_4',
        },
        scene_4: {
          background: 'https://via.placeholder.com/800x400/374151/ffffff?text=Simulation+Complete',
          timeline: [
            {
              type: 'dialogue',
              character: 'System Voice',
              text: 'Simulation complete. All objectives achieved with minimal casualties.',
            },
            {
              type: 'narrative',
              text: 'As the simulation fades, you find yourself back in the chamber with Drake and Phoenix watching you intently.',
            },
            {
              type: 'dialogue',
              character: 'Captain Drake',
              text: 'Impressive performance. But the real test is just beginning.',
            },
            {
              type: 'dialogue',
              character: 'Phoenix',
              text: '*Moving closer* Whatever happens next, remember what we talked about last night.',
            },
            {
              type: 'narrative',
              text: 'Suddenly, alarms begin blaring throughout the academy. This isn\'t a drill.',
            },
          ],
          choice: {
            prompt: 'The academy is under real attack! In the chaos, both Drake and Phoenix grab your hand...',
            options: [
              {
                id: 'go_with_phoenix',
                text: '💕 "Phoenix, I trust you with my life."',
                nextSceneId: 'ending_phoenix',
                relationshipEffect: {
                  character: 'Phoenix',
                  change: 10,
                },
              },
              {
                id: 'go_with_drake',
                text: '🔥 "Drake, lead the way."',
                nextSceneId: 'ending_drake',
                relationshipEffect: {
                  character: 'Drake',
                  change: 10,
                },
              },
              {
                id: 'dramatic_choice',
                text: '💎 "I choose... both of you." (Premium ending)',
                cost: 50,
                currency: 'diamonds',
                nextSceneId: 'ending_poly',
                flag: 'true_ending',
              },
            ],
          },
        },
        ending_phoenix: {
          background: 'https://via.placeholder.com/800x400/059669/ffffff?text=Phoenix+Ending',
          timeline: [
            {
              type: 'narrative',
              text: '💕 PHOENIX ROUTE UNLOCKED 💕',
            },
            {
              type: 'dialogue',
              character: 'Phoenix',
              text: '*Pulling you close as explosions rock the academy* I\'ve been waiting to tell you... I\'m completely in love with you.',
            },
            {
              type: 'narrative',
              text: 'In the midst of chaos, Phoenix\'s confession sends your heart soaring. Their kiss is desperate, passionate, full of promises.',
            },
            {
              type: 'dialogue',
              character: 'Phoenix',
              text: 'We\'ll face whatever comes next together. Always together.',
            },
            {
              type: 'narrative',
              text: '✨ Congratulations! You\'ve unlocked the Phoenix romance route. Continue playing to explore your deepening relationship and uncover the academy\'s darkest secrets together. ✨',
            },
          ],
        },
        ending_drake: {
          background: 'https://via.placeholder.com/800x400/dc2626/ffffff?text=Drake+Ending',
          timeline: [
            {
              type: 'narrative',
              text: '🔥 DRAKE ROUTE UNLOCKED 🔥',
            },
            {
              type: 'dialogue',
              character: 'Captain Drake',
              text: '*His mask finally dropping* I\'ve spent years building walls, but you... you tear them down just by existing.',
            },
            {
              type: 'narrative',
              text: 'Drake\'s vulnerability in this moment of crisis reveals the man beneath the cold exterior. His kiss is fierce, claiming, absolute.',
            },
            {
              type: 'dialogue',
              character: 'Captain Drake',
              text: 'I\'ll protect you with my life. That\'s not just duty talking anymore.',
            },
            {
              type: 'narrative',
              text: '🔥 Congratulations! You\'ve unlocked the Drake romance route. Experience the intense passion of loving someone who\'s willing to break all the rules for you. 🔥',
            },
          ],
        },
        ending_poly: {
          background: 'https://via.placeholder.com/800x400/7c2d12/ffffff?text=True+Ending',
          timeline: [
            {
              type: 'narrative',
              text: '💎 TRUE ENDING UNLOCKED 💎',
            },
            {
              type: 'dialogue',
              character: 'Phoenix',
              text: '*Exchanging a look with Drake* We talked about this possibility...',
            },
            {
              type: 'dialogue',
              character: 'Captain Drake',
              text: '*Nodding slowly* The heart doesn\'t follow military regulations. And neither do we, apparently.',
            },
            {
              type: 'narrative',
              text: 'In a moment that defies all expectations, both Drake and Phoenix step forward, accepting your choice.',
            },
            {
              type: 'dialogue',
              character: 'Phoenix',
              text: 'If this is what you want, we\'ll make it work. The three of us against the world.',
            },
            {
              type: 'dialogue',
              character: 'Captain Drake',
              text: 'Unconventional, but then again... so are you. So are we.',
            },
            {
              type: 'narrative',
              text: '💎✨ ULTIMATE ROMANCE ACHIEVED ✨💎 You\'ve unlocked the exclusive polyamorous route - the most challenging and rewarding path in Hearts of Steel Academy! 💎✨',
            },
          ],
        },
      },
    });

    await storyContent1.save();
    await storyContent2.save();
    return savedStory;
  }
}
