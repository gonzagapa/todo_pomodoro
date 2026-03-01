import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TaskModule,
    ConfigModule.forRoot(),
     TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        database: configService.get('DB_NAME'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        port: +configService.get('DB_PORT'),
        autoLoadEntities:true,
        synchronize: true,
      })
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
