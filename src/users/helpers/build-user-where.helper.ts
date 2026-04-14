import { Prisma } from '@prisma/client';
import { UserFiltersDto } from '../dto/filter-user.dto';

// Campos que usan contains (búsqueda parcial)
const TEXT_FIELDS: (keyof UserFiltersDto)[] = [
  'email',
  'username',
  'nombre',
  'apellido',
  'name',
];

// Campos que usan match exacto. (status, rol)
const EXACT_FIELDS: (keyof UserFiltersDto)[] = ['roleId'];

export function buildUserWhere(
  search?: string,
  filters?: UserFiltersDto,
): Prisma.UserWhereInput {
  const conditions: Prisma.UserWhereInput[] = [];

  // Búsqueda global — OR entre todos los campos de texto
  if (search) {
    conditions.push({
      OR: TEXT_FIELDS.map((field) => ({
        [field]: { contains: search },
      })),
    });
  } else {
    // nada
  }

  // Filtros específicos — cada uno es un AND
  if (filters) {
    for (const field of TEXT_FIELDS) {
      if (filters[field]) {
        conditions.push({
          [field]: { contains: filters[field] },
        });
      }
    }

    for (const field of EXACT_FIELDS) {
      if (filters[field]) {
        conditions.push({ [field]: filters[field] });
      }
    }
  } else {
    // nada
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}
