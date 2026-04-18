import { Prisma } from '@prisma/client';
import { createWhereBuilder } from 'src/common/helpers/build-where.helper';
import { UserFiltersDto } from '../dto/filter-user.dto';

export const buildUserWhere = createWhereBuilder<
  UserFiltersDto,
  Prisma.UserWhereInput
>({
  textFields: ['apellido', 'email', 'nombre', 'username'],
  exactFields: ['roleId'],
});
