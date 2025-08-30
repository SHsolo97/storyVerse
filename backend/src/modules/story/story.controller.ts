import { 
  Controller, 
  Get, 
  Post, 
  Put,
  Body, 
  Param, 
  Query,
  UseGuards,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { StoryService } from './story.service';
import { CreateStoryDto, UpdateStoryDto, StoryListDto } from '../../common/dto/story.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Stories')

@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get published stories with optional filtering' })
  @ApiQuery({ name: 'genre', required: false, description: 'Filter by genre' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'List of published stories',
    schema: {
      type: 'object',
      properties: {
        stories: { type: 'array', items: { type: 'object' } },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
          },
        },
      },
    },
  })
  async getStories(@Query() queryDto: StoryListDto) {
    return this.storyService.findPublishedStories(queryDto);
  }

  @Public()
  @Get('genres')
  async getGenres() {
    const genres = await this.storyService.getGenres();
    return { genres };
  }

  @Public()
  @Get(':id')
  async getStoryDetails(@Param('id') id: string) {
    return this.storyService.getStoryDetails(id);
  }

  @Public()
  @Get(':id/chapters')
  @ApiOperation({ 
    summary: 'Get chapters for a story',
    description: 'Retrieve all published chapters for a specific story including chapter IDs needed for gameplay.'
  })
  @ApiParam({ name: 'id', description: 'Story UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Chapters retrieved successfully',
    example: {
      chapters: [
        {
          id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          storyId: "story-uuid-here",
          chapterNumber: 1,
          title: "The Beginning",
          isPublished: true,
          createdAt: "2025-08-31T00:00:00.000Z"
        }
      ]
    }
  })
  @ApiResponse({ status: 404, description: 'Story not found' })
  async getChapters(@Param('id') storyId: string) {
    const chapters = await this.storyService.getChaptersByStory(storyId);
    return { chapters };
  }

  // Admin endpoints (would need proper role-based access control in production)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createStory(@Body() createStoryDto: CreateStoryDto) {
    return this.storyService.createStory(createStoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateStory(
    @Param('id') id: string,
    @Body() updateStoryDto: UpdateStoryDto,
  ) {
    return this.storyService.updateStory(id, updateStoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/chapters')
  async createChapter(
    @Param('id') storyId: string,
    @Body() chapterData: { title: string; chapterNumber: number },
  ) {
    return this.storyService.createChapter(
      storyId,
      chapterData.title,
      chapterData.chapterNumber,
    );
  }
}
