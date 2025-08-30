import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getProfile(@Request() req: any) {
    const user = await this.userService.getUserWithInventory(req.user.sub);
    
    if (!user) {
      throw new Error('User not found');
    }

    const { passwordHash, refreshToken, ...userProfile } = user;
    
    return {
      ...userProfile,
      inventory: user.inventory,
    };
  }
}
