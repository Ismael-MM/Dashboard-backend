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

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return {
      message: 'Rol Creado Correctamente',
      data: this.rolesService.create(createRoleDto),
    };
  }

  @Get()
  findAll(@Query() query: RoleFiltersDto) {
    return this.rolesService.findAll(query);
  }

  @Get('list')
  findAllList() {
    return this.rolesService.findDropdownMenu();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return {
      message: 'Rol Actualizado correctamente',
      data: this.rolesService.update(id, updateRoleDto),
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
