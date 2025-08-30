import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Story } from './story.entity';

@Entity('chapters')
@Unique(['storyId', 'chapterNumber'])
export class Chapter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  storyId: string;

  @Column()
  chapterNumber: number;

  @Column()
  title: string;

  @Column({ default: false })
  isPublished: boolean;

  @ManyToOne(() => Story, (story) => story.chapters)
  @JoinColumn({ name: 'storyId' })
  story: Story;
}
