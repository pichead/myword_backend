import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './v1/user/user.module';
import { AuthModule } from './v1/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { WordModule } from './v1/word/word.module';
import { UserWordModule } from './v1/user-word/user-word.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    WordModule,
    UserWordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
