import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StoryContentDocument = StoryContent & Document;

interface DialogueEntry {
  type: 'dialogue';
  character: string;
  text: string;
  characterImage?: string;
}

interface NarrativeEntry {
  type: 'narrative';
  text: string;
}

interface ChoiceOption {
  id: string;
  text: string;
  nextSceneId: string;
  cost?: number;
  currency?: 'diamonds' | 'keys';
  flag?: string;
  relationshipEffect?: {
    character: string;
    change: number;
  };
}

interface Choice {
  prompt: string;
  options: ChoiceOption[];
}

interface Scene {
  background: string;
  music?: string;
  timeline: (DialogueEntry | NarrativeEntry)[];
  nextSceneId?: string;
  choice?: Choice;
}

interface Scenes {
  [sceneId: string]: Scene;
}

@Schema({ collection: 'story_content' })
export class StoryContent {
  @Prop({ required: true })
  chapterId: string;

  @Prop({ required: true })
  storyId: string;

  @Prop({ required: true })
  chapterNumber: number;

  @Prop({ type: Object, required: true })
  scenes: Scenes;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const StoryContentSchema = SchemaFactory.createForClass(StoryContent);

// Create index for efficient queries
StoryContentSchema.index({ chapterId: 1 }, { unique: true });
StoryContentSchema.index({ storyId: 1, chapterNumber: 1 });
