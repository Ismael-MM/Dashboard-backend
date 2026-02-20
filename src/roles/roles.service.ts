import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';
import { InstanceLinksHost } from '@nestjs/core/injector/instance-links-host';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const { permissions, ...roleData } = createRoleDto;

    return await this.prisma.role.create({
      data: {
        ...roleData,
        permissions: {
          connect: permissions?.map((permName) => ({
            name: permName,
          })),
        },
      },
      include: { permissions: true },
    });
  }

  async findAll() {
    return await this.prisma.role.findMany({
      include: { permissions: true },
    });
  }

  async findOne(id: string): Promise<Role | null> {
    return await this.prisma.role.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const { permissions, ...roleData } = updateRoleDto;

    try {
      return await this.prisma.role.update({
        where: { id },
        data: {
          ...roleData,
          permissions: permissions
            ? {
                set: permissions.map((permName) => ({ name: permName })),
              }
            : undefined,
        },
        include: { permissions: true },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe un rol con ese nombre');
      }

      throw error;
    }
  }

  async remove(id: string) {
    return await this.prisma.role.delete({
      where: { id },
    });
  }
}
