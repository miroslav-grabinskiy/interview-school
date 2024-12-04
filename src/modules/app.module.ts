import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './students/student.module';
import { DatabaseModule } from './DatabaseModule';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, StudentModule],
})
export class AppModule {}
