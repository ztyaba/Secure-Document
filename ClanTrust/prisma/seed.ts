import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { id: 'admin-user' },
    update: {},
    create: {
      id: 'admin-user',
      email: 'admin@clantrust.co.ug',
      role: 'admin',
      profile: {
        create: {
          name: 'Admin ClanTrust',
          phone: '+256700000001',
          clan: 'akasolya'
        }
      }
    }
  });

  await prisma.user.upsert({
    where: { id: 'client-akasolya' },
    update: {},
    create: {
      id: 'client-akasolya',
      email: 'client@clantrust.co.ug',
      role: 'client',
      profile: {
        create: {
          name: 'Jane Akasolya',
          phone: '+256700000002',
          clan: 'akasolya'
        }
      },
      documents: {
        create: [
          {
            filename: 'Demo Will.pdf',
            driveFileId: 'demo-drive-file',
            signatureStatus: 'pending'
          }
        ]
      }
    }
  });

  await prisma.retentionPolicy.upsert({
    where: { documentId: 'demo-doc' },
    update: {},
    create: {
      document: {
        connectOrCreate: {
          where: { id: 'demo-doc' },
          create: {
            id: 'demo-doc',
            ownerUserId: 'client-akasolya',
            driveFileId: 'demo-drive-file',
            filename: 'Demo Trust.pdf',
            signatureStatus: 'draft'
          }
        }
      },
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
