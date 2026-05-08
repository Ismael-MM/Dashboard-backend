import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionFiltersDto } from './dto/filter-permission.dto';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { PermissionsList } from './types/permissions-list';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @RequirePermissions(PermissionsList.PERMISSIONS_CREATE)
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @RequirePermissions(PermissionsList.PERMISSIONS_READ)
  findAll(@Query() query: PermissionFiltersDto) {
    return this.permissionsService.findAll(query);
  }

  @Get('list')
  @RequirePermissions(PermissionsList.ROLES_CREATE)
  findAllList() {
    return this.permissionsService.findDropdownMenu();
  }

  @Get(':id')
  @RequirePermissions(PermissionsList.PERMISSIONS_READ)
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(PermissionsList.PERMISSIONS_UPDATE)
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @RequirePermissions(PermissionsList.PERMISSIONS_DELETE)
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
