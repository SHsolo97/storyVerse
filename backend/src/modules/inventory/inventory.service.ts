import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInventory } from '../../common/entities/user-inventory.entity';

@Injectable()
export class InventoryService {
  private readonly KEY_REFILL_INTERVAL = 30 * 60 * 1000; // 30 minutes in milliseconds
  private readonly MAX_KEYS = 5;

  constructor(
    @InjectRepository(UserInventory)
    private userInventoryRepository: Repository<UserInventory>,
  ) {}

  async getUserInventory(userId: string): Promise<UserInventory> {
    const inventory = await this.userInventoryRepository.findOne({
      where: { userId },
    });

    if (!inventory) {
      throw new NotFoundException('User inventory not found');
    }

    return this.refillKeys(inventory);
  }

  async canStartChapter(userId: string): Promise<boolean> {
    const inventory = await this.getUserInventory(userId);
    return inventory.keysBalance > 0;
  }

  async consumeKey(userId: string): Promise<void> {
    const inventory = await this.getUserInventory(userId);
    
    if (inventory.keysBalance <= 0) {
      throw new Error('Not enough keys');
    }

    inventory.keysBalance -= 1;
    await this.userInventoryRepository.save(inventory);
  }

  async canAfford(userId: string, cost: number, currency: 'diamonds' | 'keys'): Promise<boolean> {
    const inventory = await this.getUserInventory(userId);
    
    if (currency === 'diamonds') {
      return inventory.diamondsBalance >= cost;
    } else if (currency === 'keys') {
      return inventory.keysBalance >= cost;
    }
    
    return false;
  }

  async deductCurrency(userId: string, cost: number, currency: 'diamonds' | 'keys'): Promise<void> {
    const inventory = await this.getUserInventory(userId);
    
    if (currency === 'diamonds') {
      if (inventory.diamondsBalance < cost) {
        throw new Error('Not enough diamonds');
      }
      inventory.diamondsBalance -= cost;
    } else if (currency === 'keys') {
      if (inventory.keysBalance < cost) {
        throw new Error('Not enough keys');
      }
      inventory.keysBalance -= cost;
    }

    await this.userInventoryRepository.save(inventory);
  }

  async addCurrency(userId: string, amount: number, currency: 'diamonds' | 'keys'): Promise<void> {
    const inventory = await this.getUserInventory(userId);
    
    if (currency === 'diamonds') {
      inventory.diamondsBalance += amount;
    } else if (currency === 'keys') {
      inventory.keysBalance = Math.min(inventory.keysBalance + amount, this.MAX_KEYS);
    }

    await this.userInventoryRepository.save(inventory);
  }

  private async refillKeys(inventory: UserInventory): Promise<UserInventory> {
    const now = new Date();
    const timeSinceLastRefill = now.getTime() - inventory.lastKeyRefillAt.getTime();
    
    if (inventory.keysBalance < this.MAX_KEYS && timeSinceLastRefill >= this.KEY_REFILL_INTERVAL) {
      const keysToAdd = Math.floor(timeSinceLastRefill / this.KEY_REFILL_INTERVAL);
      const newKeyBalance = Math.min(inventory.keysBalance + keysToAdd, this.MAX_KEYS);
      
      if (newKeyBalance > inventory.keysBalance) {
        inventory.keysBalance = newKeyBalance;
        inventory.lastKeyRefillAt = new Date(
          inventory.lastKeyRefillAt.getTime() + (keysToAdd * this.KEY_REFILL_INTERVAL)
        );
        
        await this.userInventoryRepository.save(inventory);
      }
    }

    return inventory;
  }

  async getTimeUntilNextKey(userId: string): Promise<number> {
    const inventory = await this.getUserInventory(userId);
    
    if (inventory.keysBalance >= this.MAX_KEYS) {
      return 0;
    }

    const now = new Date();
    const timeSinceLastRefill = now.getTime() - inventory.lastKeyRefillAt.getTime();
    const timeUntilNext = this.KEY_REFILL_INTERVAL - (timeSinceLastRefill % this.KEY_REFILL_INTERVAL);
    
    return Math.max(0, timeUntilNext);
  }
}
