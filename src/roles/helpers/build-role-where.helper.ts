import { Prisma } from '@prisma/client';
import { createWhereBuilder } from 'src/common/helpers/build-where.helper';
import { RoleFiltersDto } from '../dto/filter-role.dto';

export const buildRoleWhere = createWhereBuilder<
  RoleFiltersDto,
  Prisma.RoleWhereInput
>({
  textFields: ['name'],
  exactFields: [],
});
