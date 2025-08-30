import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameplayService } from './gameplay.service';
import { GameplayController } from './gameplay.controller';
import { PlayerProgress, PlayerProgressSchema } from '../../common/entities/player-progress.schema';
import { StoryContent, StoryContentSchema } from '../../common/entities/story-content.schema';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlayerProgress.name, schema: PlayerProgressSchema },
      { name: StoryContent.name, schema: StoryContentSchema },
    ]),
    InventoryModule,
  ],
  controllers: [GameplayController],
  providers: [GameplayService],
  exports: [GameplayService],
})
export class GameplayModule {}
