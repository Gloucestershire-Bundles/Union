import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const mongodbUrl = configService.get<string>('MONGODB_URL');
        if (!mongodbUrl) {
          const logger = new Logger('DatabaseModule');
          logger.warn('MONGODB_URL is not defined. Falling back to the default URI: mongodb://localhost:27017/Union');
        }
        const uri = mongodbUrl || 'mongodb://localhost:27017/Union';
        return { uri: uri };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})

export class DatabaseModule {}