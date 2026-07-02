import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Removing users and related records with ID > 7...");
  
  // Delete reviews
  await prisma.review.deleteMany({
    where: { OR: [{ authorId: { gt: 7 } }, { providerId: { gt: 7 } }] }
  });

  // Delete bookings
  await prisma.booking.deleteMany({
    where: { OR: [{ homeownerId: { gt: 7 } }, { providerId: { gt: 7 } }] }
  });

  // Delete provider profiles
  await prisma.providerProfile.deleteMany({
    where: { userId: { gt: 7 } }
  });

  const result = await prisma.user.deleteMany({
    where: {
      id: { gt: 7 }
    }
  });

  console.log(`Deleted ${result.count} user(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
