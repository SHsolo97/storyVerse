import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../common/entities/user.entity';
import { UserInventory } from '../../common/entities/user-inventory.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserInventory)
    private userInventoryRepository: Repository<UserInventory>,
  ) {}

  async create(email: string, password: string, firstName?: string, lastName?: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 12);
    
    const user = this.userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
    });

    const savedUser = await this.userRepository.save(user);

    // Create initial inventory for the user
    const inventory = this.userInventoryRepository.create({
      userId: savedUser.id,
      diamondsBalance: 0,
      keysBalance: 5,
      lastKeyRefillAt: new Date(),
    });

    await this.userInventoryRepository.save(inventory);

    return savedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { id },
      relations: ['inventory'],
    });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.userRepository.update(userId, { 
      refreshToken: refreshToken || undefined 
    });
  }

  async getUserWithInventory(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['inventory'],
    });
  }
}
