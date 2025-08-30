import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { DebugController } from './debug.controller';
import { Story } from '../common/entities/story.entity';
import { Chapter } from '../common/entities/chapter.entity';
import { User } from '../common/entities/user.entity';
import { StoryContent, StoryContentSchema } from '../common/entities/story-content.schema';
import { PlayerProgress, PlayerProgressSchema } from '../common/entities/player-progress.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Story, Chapter, User]),
    MongooseModule.forFeature([
      { name: StoryContent.name, schema: StoryContentSchema },
      { name: PlayerProgress.name, schema: PlayerProgressSchema }
    ]),
  ],
  controllers: [DebugController],
})
export class DebugModule {}
