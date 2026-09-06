import { prisma } from '../src/lib/prisma.js';

async function main() {
  const user = await prisma.user.upsert({
    where: {
      email: 'test@lifeos.local',
    },
    update: {},
    create: {
      email: 'test@lifeos.local',
      name: 'Test User',
    },
  });

  console.log('User created:', user);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
