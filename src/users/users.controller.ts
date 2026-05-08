import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { UserFiltersDto } from './dto/filter-user.dto';
import { PermissionsList } from 'src/permissions/types/permissions-list';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions(PermissionsList.USERS_CREATE)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @RequirePermissions(PermissionsList.USERS_READ)
  findAll(@Query() query: UserFiltersDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions(PermissionsList.USERS_READ)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions(PermissionsList.USERS_UPDATE)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.usersService.update(+id, updateUserDto)
    return {
      message: 'Usuario actualizado correctamente',
      data,
    };
  }

  @Delete(':id')
  @RequirePermissions(PermissionsList.USERS_DELETE)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
