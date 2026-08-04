import bcrypt from 'bcrypt';

import { prisma } from '../src/database/prisma';

async function main() {
  const password = await bcrypt.hash('Admin@123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@revendacarros.com' },
    update: {
      name: 'Administrador',
      password,
      profile: 'ADMIN',
    },
    create: {
      name: 'Administrador',
      email: 'admin@revendacarros.com',
      password,
      profile: 'ADMIN',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
