import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create service categories
  const categories = await Promise.all([
    prisma.serviceCategory.upsert({
      where: { name: "House Cleaning" },
      update: {},
      create: { name: "House Cleaning", icon: "broom", description: "Professional house cleaning services" },
    }),
    prisma.serviceCategory.upsert({
      where: { name: "Plumbing" },
      update: {},
      create: { name: "Plumbing", icon: "water", description: "Pipe repairs, installations, and maintenance" },
    }),
    prisma.serviceCategory.upsert({
      where: { name: "Electrician" },
      update: {},
      create: { name: "Electrician", icon: "flash", description: "Electrical repairs and installations" },
    }),
    prisma.serviceCategory.upsert({
      where: { name: "Carpenter" },
      update: {},
      create: { name: "Carpenter", icon: "construct", description: "Woodwork, furniture repair, and custom builds" },
    }),
    prisma.serviceCategory.upsert({
      where: { name: "Painting" },
      update: {},
      create: { name: "Painting", icon: "color-palette", description: "Interior and exterior painting" },
    }),
    prisma.serviceCategory.upsert({
      where: { name: "AC Repair" },
      update: {},
      create: { name: "AC Repair", icon: "snow", description: "AC servicing, repair, and installation" },
    }),
    prisma.serviceCategory.upsert({
      where: { name: "Gardening" },
      update: {},
      create: { name: "Gardening", icon: "leaf", description: "Garden maintenance and landscaping" },
    }),
    prisma.serviceCategory.upsert({
      where: { name: "Pest Control" },
      update: {},
      create: { name: "Pest Control", icon: "bug", description: "Pest removal and prevention" },
    }),
  ]);

  console.log(`✅ Created ${categories.length} service categories`);

  // Create demo providers
  const hashedPassword = await bcrypt.hash("password123", 10);

  const providerData = [
    { name: "Rajesh Kumar", email: "rajesh@demo.com", phone: "9876543210", bio: "Expert plumber with 8 years of experience in residential and commercial plumbing.", skills: "Pipe Repair, Leak Detection, Drain Cleaning", experience: 8, hourlyRate: 350, serviceArea: "Downtown, Midtown", categoryIndices: [1] },
    { name: "Priya Sharma", email: "priya@demo.com", phone: "9876543211", bio: "Professional house cleaner. Deep cleaning specialist with eco-friendly products.", skills: "Deep Cleaning, Carpet Cleaning, Window Cleaning", experience: 5, hourlyRate: 250, serviceArea: "Suburbs, Downtown", categoryIndices: [0] },
    { name: "Amit Verma", email: "amit@demo.com", phone: "9876543212", bio: "Licensed electrician. Specializing in home wiring, panel upgrades and smart home installations.", skills: "Wiring, Panel Upgrades, Smart Home", experience: 10, hourlyRate: 400, serviceArea: "Citywide", categoryIndices: [2] },
    { name: "Sunita Patel", email: "sunita@demo.com", phone: "9876543213", bio: "Skilled carpenter specializing in custom furniture and home renovations.", skills: "Custom Furniture, Renovations, Cabinet Work", experience: 7, hourlyRate: 300, serviceArea: "Downtown, Eastside", categoryIndices: [3] },
    { name: "Vikram Singh", email: "vikram@demo.com", phone: "9876543214", bio: "Professional painter. Interior and exterior painting with premium finishes.", skills: "Interior Painting, Exterior Painting, Wall Textures", experience: 6, hourlyRate: 280, serviceArea: "Suburbs, Westside", categoryIndices: [4] },
    { name: "Meena Devi", email: "meena@demo.com", phone: "9876543215", bio: "AC technician with expertise in all major brands. Installation and repair.", skills: "AC Repair, AC Installation, Servicing", experience: 4, hourlyRate: 320, serviceArea: "Citywide", categoryIndices: [5] },
  ];

  for (const pd of providerData) {
    const existingUser = await prisma.user.findUnique({ where: { email: pd.email } });
    if (existingUser) {
      console.log(`  ⏭ Provider ${pd.name} already exists, skipping`);
      continue;
    }

    const user = await prisma.user.create({
      data: {
        name: pd.name,
        email: pd.email,
        phone: pd.phone,
        password: hashedPassword,
        role: "PROVIDER",
        bio: pd.bio,
        providerProfile: {
          create: {
            skills: pd.skills,
            experience: pd.experience,
            hourlyRate: pd.hourlyRate,
            serviceArea: pd.serviceArea,
            rating: 4.0 + Math.random() * 0.9,
            totalReviews: Math.floor(Math.random() * 30) + 5,
            categories: {
              connect: pd.categoryIndices.map((i) => ({ id: categories[i].id })),
            },
          },
        },
      },
    });
    console.log(`  ✅ Created provider: ${user.name}`);
  }

  // Create a demo homeowner
  const existingHomeowner = await prisma.user.findUnique({ where: { email: "homeowner@demo.com" } });
  if (!existingHomeowner) {
    await prisma.user.create({
      data: {
        name: "Demo Homeowner",
        email: "homeowner@demo.com",
        phone: "9876543200",
        password: hashedPassword,
        role: "HOMEOWNER",
        address: "123 Main Street, Downtown",
      },
    });
    console.log("  ✅ Created demo homeowner (homeowner@demo.com / password123)");
  }

  console.log("\n🎉 Seeding complete!");
  console.log("\n📋 Demo Credentials:");
  console.log("  Homeowner: homeowner@demo.com / password123");
  console.log("  Provider:  rajesh@demo.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
