import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const DEMO_USER_ID = '112c9068-a834-4f5c-bb90-4c7e6a69fee2';

async function main() {
  const user = await prisma.user.upsert({
    where: {
      id: DEMO_USER_ID,
    },
    update: {
      email: 'demo@lifeos.local',
      name: 'Demo User',
    },
    create: {
      id: DEMO_USER_ID,
      email: 'demo@lifeos.local',
      name: 'Demo User',
    },
  });

  console.log('Seeded demo user:', user.id, user.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
