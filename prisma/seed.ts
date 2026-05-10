import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcrypt'; // Descomenta si usas bcrypt
import { PermissionsList } from 'src/permissions/types/permissions-list';

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🌱 Iniciando seeding...');

  // 1. Crear Permisos
  const allPermissions = Object.values(PermissionsList);

  const permissionData: Record<string, { label: string; group: string }> = {
    USERS_READ: { label: 'Ver Usuarios', group: 'Usuarios' },
    USERS_CREATE: { label: 'Crear Usuarios', group: 'Usuarios' },
    USERS_UPDATE: { label: 'Editar Usuarios', group: 'Usuarios' },
    USERS_DELETE: { label: 'Eliminar Usuarios', group: 'Usuarios' },

    ROLES_READ: { label: 'Ver Roles', group: 'Roles' },
    ROLES_CREATE: { label: 'Crear Roles', group: 'Roles' },
    ROLES_UPDATE: { label: 'Editar Roles', group: 'Roles' },
    ROLES_DELETE: { label: 'Eliminar Roles', group: 'Roles' },

    PERMISSIONS_READ: { label: 'Ver Permisos', group: 'Admin' },
    PERMISSIONS_CREATE: { label: 'Crear Permisos', group: 'Admin' },
    PERMISSIONS_UPDATE: { label: 'Editar Permisos', group: 'Admin' },
    PERMISSIONS_DELETE: { label: 'Eliminar Permisos', group: 'Admin' },
  };

  for (const name of allPermissions) {
    // Si el nombre no está en nuestro mapeo, usamos valores por defecto
    const label = permissionData[name]?.label || name.replace(/_/g, ' ');
    const group = permissionData[name]?.group || 'General';

    await prisma.permission.upsert({
      where: { name },
      update: { label, group }, // Actualiza si ya existe para reflejar cambios de texto
      create: {
        name,
        label,
        group,
      },
    });
  }

  // 2. Crear Rol ADMIN y conectar permisos
  const roleAdmin = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {
      name: 'ADMIN',
      permissions: {
        connect: allPermissions.map((name) => ({ name })),
      },
    },
    create: {
      name: 'ADMIN',
      permissions: {
        connect: allPermissions.map((name) => ({ name })),
      },
    },
  });

  // 3. Crear Usuario Administrador
  // Nota: Si usas bcrypt, genera el hash aquí: const hashedPassword = await bcrypt.hash('admin123', 10);
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' }, // Úsalo como identificador único
    update: {},
    create: {
      email: 'admin@test.com',
      username: 'admin',
      nombre: 'Admin',
      apellido: 'Apellido',
      password: hashedPassword, // ¡Recuerda hashear esto en un proyecto real!
      roleId: roleAdmin.id, // Relacionamos el usuario con el rol ADMIN
    },
  });

  console.log('✅ Seeding completado con éxito:');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
