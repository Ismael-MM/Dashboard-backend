import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildPermissionWhere } from './helpers/build-permission-where.helper';
import { PermissionFiltersDto } from './dto/filter-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    return await this.prisma.permission.create({
      data: { ...createPermissionDto },
    });
  }

  async findAll(query: PermissionFiltersDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'desc',
      search,
      ...filters
    } = query;

    const skip = (page - 1) * limit;
    const where = buildPermissionWhere(search, filters);
    const [data, total] = await Promise.all([
      this.prisma.permission.findMany({
        skip,
        take: limit,
        where,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.permission.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findDropdownMenu() {
    return await this.prisma.permission.findMany();
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
