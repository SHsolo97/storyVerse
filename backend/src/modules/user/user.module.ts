import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../../common/entities/user.entity';
import { UserInventory } from '../../common/entities/user-inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserInventory])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
