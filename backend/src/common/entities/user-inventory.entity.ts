import {
  Entity,
  Column,
  PrimaryColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_inventory')
export class UserInventory {
  @PrimaryColumn('uuid')
  userId: string;

  @Column({ default: 0 })
  diamondsBalance: number;

  @Column({ default: 5 })
  keysBalance: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastKeyRefillAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.inventory)
  @JoinColumn({ name: 'userId' })
  user: User;
}
