import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seeds/seeds.service';
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  await seedService.seed();
  await app.close();
}

bootstrap()
  .then(() => console.log('Seeding completed successfully.'))
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
