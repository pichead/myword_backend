import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/database/prisma';
import { AdminAuthGuard } from 'src/common/guard/adminAuth.guard';
import { ClientAuthGuard } from 'src/common/guard/clientAuth.guard';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, AdminAuthGuard, ClientAuthGuard],
})
export class UserModule { }
