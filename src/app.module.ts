import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { config } from './database/orm.config';
import { ProductsModule } from './products/products.module';
import { SeedService } from './seeds/seeds.service';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './imageUpload/upload.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the config globally available
      envFilePath: `.env`, // Path to your .env file
    }),
    TypeOrmModule.forRoot(config),
    ProductsModule,
    UsersModule,
    MulterModule.register({
      dest: './uploads', // Set the destination folder for uploaded files
    }),
  ],

  providers: [SeedService],

  controllers: [UploadController],
})
export class AppModule {}
