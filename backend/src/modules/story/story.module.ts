import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { Story } from '../../common/entities/story.entity';
import { Chapter } from '../../common/entities/chapter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Story, Chapter])],
  controllers: [StoryController],
  providers: [StoryService],
  exports: [StoryService],
})
export class StoryModule {}
