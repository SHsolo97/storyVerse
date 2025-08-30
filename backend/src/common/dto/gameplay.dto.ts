import { IsUUID, IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartChapterDto {
  @ApiProperty({
    description: 'UUID of the chapter to start playing',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid'
  })
  @IsUUID()
  chapterId: string;
}

export class MakeChoiceDto {
  @ApiProperty({
    description: 'UUID of the story being played',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid'
  })
  @IsUUID()
  storyId: string;

  @ApiProperty({
    description: 'ID of the current scene where the choice is being made',
    example: 'scene_1'
  })
  @IsString()
  sceneId: string;

  @ApiProperty({
    description: 'ID of the choice option selected by the player',
    example: 'accept_quest'
  })
  @IsString()
  choiceId: string;
}

export class GameplayResponseDto {
  sceneData: any;
  nextSceneId?: string;
  playerProgress: {
    currentSceneId: string;
    relationshipScores: Record<string, number>;
    flags: Record<string, any>;
  };
}

export class SaveProgressDto {
  @ApiProperty({
    description: 'UUID of the story to save progress for',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid'
  })
  @IsUUID()
  storyId: string;

  @ApiProperty({
    description: 'UUID of the current chapter',
    example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012'
  })
  @IsString()
  currentChapterId: string;

  @ApiProperty({
    description: 'ID of the current scene within the chapter',
    example: 'scene_3'
  })
  @IsString()
  currentSceneId: string;

  @ApiProperty({
    description: 'Array of unlocked outfit IDs',
    example: ['royal_dress', 'casual_outfit'],
    required: false,
    isArray: true,
    type: String
  })
  @IsOptional()
  @IsArray()
  unlockedOutfits?: string[];

  @ApiProperty({
    description: 'Relationship scores with different characters',
    example: { 'Character1': 15, 'Character2': -5 },
    required: false,
    additionalProperties: { type: 'number' }
  })
  @IsOptional()
  relationshipScores?: Record<string, number>;

  @ApiProperty({
    description: 'Story flags and their values set by player choices',
    example: { 'brave_choice': true, 'found_treasure': true },
    required: false,
    additionalProperties: { type: 'boolean' }
  })
  @IsOptional()
  flags?: Record<string, any>;
}
