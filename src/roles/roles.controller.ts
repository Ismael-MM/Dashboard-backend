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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleFiltersDto } from './dto/filter-role.dto';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { PermissionsList } from 'src/permissions/types/permissions-list';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequirePermissions(PermissionsList.ROLES_CREATE)
  create(@Body() createRoleDto: CreateRoleDto) {
    return {
      message: 'Rol Creado Correctamente',
      data: this.rolesService.create(createRoleDto),
    };
  }

  @Get()
  @RequirePermissions(PermissionsList.ROLES_READ)
  findAll(@Query() query: RoleFiltersDto) {
    return this.rolesService.findAll(query);
  }

  @Get('list')
  @RequirePermissions(PermissionsList.USERS_READ)
  findAllList() {
    return this.rolesService.findDropdownMenu();
  }

  @Get(':id')
  @RequirePermissions(PermissionsList.ROLES_READ)
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(PermissionsList.ROLES_UPDATE)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return {
      message: 'Rol Actualizado correctamente',
      data: this.rolesService.update(id, updateRoleDto),
    };
  }

  @Delete(':id')
  @RequirePermissions(PermissionsList.ROLES_DELETE)
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
