import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcrypt'; // Descomenta si usas bcrypt

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
  const permissions = ['USERS_CREATE', 'USERS_READ', 'USERS_UPDATE', 'USERS_DELETE'];

  for (const name of permissions) {
    await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // 2. Crear Rol ADMIN y conectar permisos
  const roleAdmin = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      permissions: {
        connect: permissions.map(name => ({ name })),
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
