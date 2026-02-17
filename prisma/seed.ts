import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const permCreateUser = await prisma.permission.upsert({
    where: { name: 'USERS_CREATE' },
    update: {},
    create: { name: 'USERS_CREATE' },
  });

  const permReadUser = await prisma.permission.upsert({
    where: { name: 'USERS_READ' },
    update: {},
    create: { name: 'USERS_READ' },
  });

  const permUpdateUser = await prisma.permission.upsert({
    where: { name: 'USERS_UPDATE' },
    update: {},
    create: { name: 'USERS_UPDATE' },
  });

  const permDeleteUser = await prisma.permission.upsert({
    where: { name: 'USERS_DELETE' },
    update: {},
    create: { name: 'USERS_DELETE' },
  });

  const roleAdmin = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      permissions: {
        connect: [
          { name: 'USERS_CREATE' },
          { name: 'USERS_READ' },
          { name: 'USERS_UPDATE' },
          { name: 'USERS_DELETE' },
        ],
      },
    },
  });

  console.log('Semillas creadas: Rol ADMIN con permisos de usuario');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
