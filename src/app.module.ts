import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerConfig } from '../winston.logger';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [ProjectsModule,WinstonModule.forRoot(winstonLoggerConfig) ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
