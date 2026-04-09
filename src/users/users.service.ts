import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      },
    });

    if (existing) {
      const isEmail = existing.email === createUserDto.email;
      throw new ConflictException(
        isEmail
          ? 'El correo ya está registrado'
          : 'El nombre de usuario ya está en uso',
      );
    }

    try {
      const { passwordConfirm: _, ...userData } = createUserDto;

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const savedUser = await this.prisma.user.create({
        data: {
          email: userData.email,
          username: userData.username,
          nombre: userData.nombre,
          apellido: userData.apellido,
          password: hashedPassword,
          // Aquí asignamos el rol (por ahora uno fijo para que no de error)
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = savedUser;

      return userWithoutPassword;
    } catch (error) {
      throw new InternalServerErrorException('Error al procesar el registro');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    //Cuantos registro se salta
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          role: true,
        },
        omit: {
          password: true,
        },
      }),
      this.prisma.user.count(),
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

  async findOne(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    } else {
      return user;
    }
  }

  async findOneByIdentifier(
    field: string,
    value: string,
  ): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { [field]: value } as any,
    });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`No existe el usuario`);
    } else {
      return user;
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`No existe un usuario con ese email`);
    } else {
      return user;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
