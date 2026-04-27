import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PrismaModule } from './prisma/prisma.module';
import { PermissionsGuard } from './auth/guards/permissions.guard';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { CsrfModule } from './csrf/csrf.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short', // Ráfagas rápidas — evita spam de clicks
          ttl: 1000,
          limit: 5,
        },
        {
          name: 'medium', // Uso normal — navegación del dashboard
          ttl: 60000,
          limit: 100,
        },
        {
          name: 'long', // Límite hora — protege contra scraping
          ttl: 3600000,
          limit: 1000,
        },
      ],
    }),
    UsersModule,
    AuthModule,
    PrismaModule,
    RolesModule,
    PermissionsModule,
    CsrfModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
