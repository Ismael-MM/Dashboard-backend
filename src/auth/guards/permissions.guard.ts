import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.userId) {
      throw new ForbiddenException('Usuario no Identificado');
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId},
      include: {
        role: {
          include: {
            permissions: true,
          }
        }
      }
    });

    if (!dbUser || !dbUser.role) {
      throw new ForbiddenException('El usuario no tiene un rol asignado');
    }

    const userPermissions = dbUser.role.permissions.map((p) => p.name);

    const hasPermission = requiredPermissions.every((permission) => userPermissions.includes(permission))

    if (!hasPermission) {
      throw new ForbiddenException(
        'No tienes permisos suficientes (Falta: ' + requiredPermissions + ')',
      );
    }

    return true;
  }
}
