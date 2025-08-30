import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Story } from '../../common/entities/story.entity';
import { Chapter } from '../../common/entities/chapter.entity';
import { CreateStoryDto, UpdateStoryDto, StoryListDto } from '../../common/dto/story.dto';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
  ) {}

  async createStory(createStoryDto: CreateStoryDto): Promise<Story> {
    const story = this.storyRepository.create(createStoryDto);
    return this.storyRepository.save(story);
  }

  async updateStory(id: string, updateStoryDto: UpdateStoryDto): Promise<Story> {
    const story = await this.findStoryById(id);
    Object.assign(story, updateStoryDto);
    return this.storyRepository.save(story);
  }

  async findStoryById(id: string): Promise<Story> {
    const story = await this.storyRepository.findOne({
      where: { id },
      relations: ['chapters'],
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    return story;
  }

  async findPublishedStories(queryDto: StoryListDto) {
    const { genre, search, page = 1, limit = 10, sortBy = 'newest' } = queryDto;
    
    const queryBuilder = this.storyRepository
      .createQueryBuilder('story')
      .where('story.isPublished = :isPublished', { isPublished: true })
      .leftJoinAndSelect('story.chapters', 'chapters');

    if (genre) {
      queryBuilder.andWhere('story.genre = :genre', { genre });
    }

    if (search) {
      queryBuilder.andWhere(
        '(story.title ILIKE :search OR story.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    switch (sortBy) {
      case 'popular':
        queryBuilder.orderBy('story.likes', 'DESC');
        break;
      case 'title':
        queryBuilder.orderBy('story.title', 'ASC');
        break;
      case 'newest':
      default:
        queryBuilder.orderBy('story.createdAt', 'DESC');
        break;
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit);

    const [stories, total] = await queryBuilder.getManyAndCount();

    return {
      stories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStoryDetails(id: string): Promise<Story> {
    const story = await this.storyRepository.findOne({
      where: { id, isPublished: true },
      relations: ['chapters'],
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    // Increment view count
    await this.storyRepository.increment({ id }, 'viewCount', 1);

    return story;
  }

  async createChapter(storyId: string, title: string, chapterNumber: number): Promise<Chapter> {
    const story = await this.findStoryById(storyId);
    
    const chapter = this.chapterRepository.create({
      storyId: story.id,
      title,
      chapterNumber,
    });

    return this.chapterRepository.save(chapter);
  }

  async getChaptersByStory(storyId: string): Promise<Chapter[]> {
    return this.chapterRepository.find({
      where: { storyId, isPublished: true },
      order: { chapterNumber: 'ASC' },
    });
  }

  async getGenres(): Promise<string[]> {
    const result = await this.storyRepository
      .createQueryBuilder('story')
      .select('DISTINCT story.genre', 'genre')
      .where('story.isPublished = :isPublished', { isPublished: true })
      .getRawMany();

    return result.map(row => row.genre);
  }
}
