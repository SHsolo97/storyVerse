import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from 'typeorm';
import { Model } from 'mongoose';
import { Story } from '../common/entities/story.entity';
import { Chapter } from '../common/entities/chapter.entity';
import { StoryContent, StoryContentDocument } from '../common/entities/story-content.schema';

@Injectable()
export class ManualSeedService {
  constructor(
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
    @InjectModel(StoryContent.name)
    private storyContentModel: Model<StoryContentDocument>,
  ) {}

  async addRomanceStory() {
    // Check if Hearts of Steel Academy already exists
    const existingStory = await this.storyRepository.findOne({ 
      where: { title: 'Hearts of Steel Academy' } 
    });
    
    if (existingStory) {
      console.log('Hearts of Steel Academy already exists');
      return existingStory;
    }

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

    // Create story content for Chapter 2 - shortened version
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
          ],
          choice: {
            prompt: 'The simulation begins. How do you approach this deadly test?',
            options: [
              {
                id: 'brave_approach',
                text: 'Charge in with confidence',
                nextSceneId: 'scene_2a',
                relationshipEffect: {
                  character: 'Drake',
                  change: 3,
                },
              },
              {
                id: 'cautious_approach',
                text: 'Observe and plan carefully',
                nextSceneId: 'scene_2b',
                relationshipEffect: {
                  character: 'Phoenix',
                  change: 3,
                },
              },
            ],
          },
        },
        scene_2a: {
          background: 'https://via.placeholder.com/800x400/dc2626/ffffff?text=Combat+Simulation',
          timeline: [
            {
              type: 'narrative',
              text: 'Your bold approach catches the attention of both Drake and Phoenix. The intensity of the simulation is unlike anything you\'ve experienced.',
            },
            {
              type: 'dialogue',
              character: 'Captain Drake',
              text: 'Impressive. But bravery without strategy will get you killed.',
            },
          ],
        },
        scene_2b: {
          background: 'https://via.placeholder.com/800x400/059669/ffffff?text=Strategic+Planning',
          timeline: [
            {
              type: 'narrative',
              text: 'Your careful observation reveals hidden patterns in the simulation. Phoenix nods approvingly at your strategic thinking.',
            },
            {
              type: 'dialogue',
              character: 'Lieutenant Phoenix',
              text: 'Smart thinking. Sometimes the best warriors are the ones who think before they act.',
            },
          ],
        },
      },
    });

    await storyContent1.save();
    await storyContent2.save();
    
    console.log('💕 Hearts of Steel Academy story added successfully!');
    return savedStory;
  }
}
