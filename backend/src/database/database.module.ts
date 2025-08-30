import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { Story } from '../common/entities/story.entity';
import { Chapter } from '../common/entities/chapter.entity';
import { StoryContent, StoryContentSchema } from '../common/entities/story-content.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Story, Chapter]),
    MongooseModule.forFeature([
      { name: StoryContent.name, schema: StoryContentSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}
