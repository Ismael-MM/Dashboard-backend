import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    return await this.prisma.permission.create({
      data: { ...createPermissionDto },
    });
  }

  async findAll() {
    return await this.prisma.permission.findMany({});
  }

  async findOne(id: string) {
    return await this.prisma.permission.findUnique({
      where: { id },
    });
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    try {
      return await this.prisma.permission.update({
        where: { id },
        data: { ...updatePermissionDto },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe un rol con ese nombre');
      } else {
        throw error;
      }
    }
  }

  async remove(id: string) {
    return await this.prisma.permission.delete({
      where: { id },
    });
  }
}
