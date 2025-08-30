import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  UseGuards, 
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GameplayService } from './gameplay.service';
import { StartChapterDto, MakeChoiceDto, SaveProgressDto } from '../../common/dto/gameplay.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Gameplay')
@ApiBearerAuth()
@Controller('gameplay')
@UseGuards(JwtAuthGuard)
export class GameplayController {
  constructor(private readonly gameplayService: GameplayService) {}

  @Post('start-chapter')
  @ApiOperation({ 
    summary: 'Start a story chapter',
    description: 'Begin playing a specific chapter by providing the chapter ID. Consumes 1 key from user inventory.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Chapter started successfully, returns scene data and player progress',
    example: {
      sceneData: {
        background: "https://example.com/backgrounds/university_library.jpg",
        timeline: [
          {
            type: "narrative",
            text: "In the dusty archives of the university library..."
          }
        ],
        choice: {
          prompt: "What do you decide?",
          options: [
            {
              id: "accept_quest",
              text: "Accept the quest immediately",
              nextSceneId: "scene_2a"
            }
          ]
        }
      },
      playerProgress: {
        currentSceneId: "scene_1",
        relationshipScores: {},
        flags: {}
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Not enough keys or invalid chapter ID' })
  @ApiResponse({ status: 404, description: 'Chapter content not found' })
  async startChapter(@Request() req: any, @Body() startChapterDto: StartChapterDto) {
    return this.gameplayService.startChapter(req.user.sub, startChapterDto);
  }

  @Post('make-choice')
  @ApiOperation({ 
    summary: 'Make a story choice',
    description: 'Select a choice option in the current scene. May consume diamonds for premium choices.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Choice made successfully, returns next scene data',
    example: {
      sceneData: {
        background: "https://example.com/backgrounds/forest.jpg",
        timeline: [
          {
            type: "dialogue",
            character: "Guide",
            text: "You chose wisely. The path ahead is clearer now."
          }
        ]
      },
      playerProgress: {
        currentSceneId: "scene_2a",
        relationshipScores: { "Guide": 5 },
        flags: { "brave_choice": true }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid choice or insufficient currency' })
  @ApiResponse({ status: 404, description: 'Player progress or story content not found' })
  async makeChoice(@Request() req: any, @Body() makeChoiceDto: MakeChoiceDto) {
    return this.gameplayService.makeChoice(req.user.sub, makeChoiceDto);
  }

  @Get('progress/:storyId')
  @ApiOperation({ 
    summary: 'Get player progress',
    description: 'Retrieve the current progress for a specific story including unlocked scenes, choices made, and relationship scores.'
  })
  @ApiParam({ name: 'storyId', description: 'UUID of the story to get progress for' })
  @ApiResponse({ 
    status: 200, 
    description: 'Player progress retrieved successfully',
    example: {
      userId: "user-uuid",
      storyId: "story-uuid", 
      currentChapterId: "chapter-uuid",
      currentSceneId: "scene_3",
      relationshipScores: { "Character1": 15, "Character2": -5 },
      flags: { "brave_choice": true, "found_treasure": true },
      choicesMade: ["accept_quest", "help_stranger"],
      lastPlayedAt: "2025-08-31T00:30:00.000Z"
    }
  })
  @ApiResponse({ status: 404, description: 'No progress found for this story' })
  async getProgress(@Request() req: any, @Param('storyId') storyId: string) {
    return this.gameplayService.getPlayerProgress(req.user.sub, storyId);
  }

  @Post('save-progress')
  @ApiOperation({ 
    summary: 'Save player progress',
    description: 'Manually save the current game progress including scene position, flags, and relationship scores.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Progress saved successfully',
    example: { message: 'Progress saved successfully' }
  })
  @ApiResponse({ status: 400, description: 'Invalid progress data' })
  async saveProgress(@Request() req: any, @Body() saveProgressDto: SaveProgressDto) {
    await this.gameplayService.saveProgress(req.user.sub, saveProgressDto);
    return { message: 'Progress saved successfully' };
  }

  @Get('current-scene/:storyId')
  @ApiOperation({ 
    summary: 'Get current scene',
    description: 'Retrieve the current scene data for a story based on player progress.'
  })
  @ApiParam({ name: 'storyId', description: 'UUID of the story to get current scene for' })
  @ApiResponse({ 
    status: 200, 
    description: 'Current scene retrieved successfully',
    example: {
      sceneData: {
        background: "https://example.com/backgrounds/throne_room.jpg",
        timeline: [
          {
            type: "narrative", 
            text: "You stand before the grand throne, decision time approaches."
          }
        ],
        choice: {
          prompt: "Your final choice?",
          options: [
            {
              id: "accept_crown",
              text: "Accept the crown and responsibility", 
              nextSceneId: "ending_ruler"
            }
          ]
        }
      },
      playerProgress: {
        currentSceneId: "scene_final",
        relationshipScores: { "Advisor": 20 },
        flags: { "earned_trust": true }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Player progress or story content not found' })
  async getCurrentScene(@Request() req: any, @Param('storyId') storyId: string) {
    return this.gameplayService.getCurrentScene(req.user.sub, storyId);
  }
}
