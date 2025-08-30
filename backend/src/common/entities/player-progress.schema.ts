import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerProgressDocument = PlayerProgress & Document;

interface RelationshipScores {
  [characterName: string]: number;
}

interface GameFlags {
  [flagName: string]: boolean | string | number;
}

@Schema({ collection: 'player_progress' })
export class PlayerProgress {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  storyId: string;

  @Prop({ required: true })
  currentChapterId: string;

  @Prop({ required: true })
  currentSceneId: string;

  @Prop({ type: [String], default: [] })
  unlockedOutfits: string[];

  @Prop({ type: Object, default: {} })
  relationshipScores: RelationshipScores;

  @Prop({ type: Object, default: {} })
  flags: GameFlags;

  @Prop({ type: [String], default: [] })
  choicesMade: string[];

  @Prop({ default: Date.now })
  lastPlayedAt: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PlayerProgressSchema = SchemaFactory.createForClass(PlayerProgress);

// Create compound index for efficient queries
PlayerProgressSchema.index({ userId: 1, storyId: 1 }, { unique: true });
