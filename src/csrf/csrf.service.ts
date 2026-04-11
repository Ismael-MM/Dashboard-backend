import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CsrfRequestMethod, doubleCsrf, DoubleCsrfUtilities } from 'csrf-csrf';
import { Request, Response } from 'express';

@Injectable()
export class CsrfService {
  private readonly doubleCsrfInstance: DoubleCsrfUtilities;

  constructor(private configService: ConfigService) {
    const csrfSecret = configService.get<string>('CSRF_SECRET');

    if (!csrfSecret) {
      throw new Error('CSRF_SECRET no está definido');
    } else {
      // No hace nada, pero me gusta la programacion limpia
    }

    this.doubleCsrfInstance = doubleCsrf({
      getSecret: () => csrfSecret,
      getSessionIdentifier: (req: Request): string => {
        const cookies = req.cookies as Record<string, string | undefined>;
        return cookies['access_token'] ?? req.ip ?? '';
      },
      cookieName:
        process.env.NODE_ENV === 'production'
          ? '__Host-psifi.x-csrf-token' // HTTPS obligatorio
          : 'x-csrf-token', // HTTP en desarrollo
      cookieOptions: {
        httpOnly: true,
        sameSite: 'strict' as const,
        secure: process.env.NODE_ENV === 'production',
      },
      size: 64,
      ignoredMethods: ['GET', 'HEAD', 'OPTIONS'] as CsrfRequestMethod[],
    });
  }

  get protection() {
    return this.doubleCsrfInstance.doubleCsrfProtection;
  }

  generateToken(req: Request, res: Response): string {
    return this.doubleCsrfInstance.generateCsrfToken(req, res);
  }
}
