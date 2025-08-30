import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async getInventory(@Request() req: any) {
    const inventory = await this.inventoryService.getUserInventory(req.user.sub);
    const timeUntilNextKey = await this.inventoryService.getTimeUntilNextKey(req.user.sub);
    
    return {
      ...inventory,
      timeUntilNextKey,
    };
  }
}
