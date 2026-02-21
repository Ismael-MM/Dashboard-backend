import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/wasm-compiler-edge';

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
      const { passwordConfirm, ...userData } = createUserDto;

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

  async findAll() {
    return await this.prisma.user.findMany({
      include: { role: true },
    });
  }

  async findOne(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { username },
    });
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
