import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateStoryDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  coverImageUrl: string;

  @IsString()
  genre: string;
}

export class UpdateStoryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class StoryListDto {
  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: 'newest' | 'popular' | 'title' = 'newest';
}
