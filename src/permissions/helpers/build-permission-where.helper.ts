import { Prisma } from '@prisma/client';
import { createWhereBuilder } from 'src/common/helpers/build-where.helper';
import { PermissionFiltersDto } from '../dto/filter-permission.dto';

export const buildPermissionWhere = createWhereBuilder<
  PermissionFiltersDto,
  Prisma.PermissionWhereInput
>({
  textFields: ['name', 'group', 'label'],
  exactFields: [],
});
