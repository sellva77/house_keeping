import prisma from "../config/db.js";

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        address: true,
        bio: true,
        createdAt: true,
        providerProfile: {
          include: { categories: true },
        },
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (error) {
    console.error("GetProfile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, bio, skills, experience, hourlyRate, serviceArea } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(bio !== undefined && { bio }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        address: true,
        bio: true,
      },
    });

    // Update provider profile if user is a provider
    if (req.user.role === "PROVIDER") {
      await prisma.providerProfile.update({
        where: { userId: req.user.id },
        data: {
          ...(skills !== undefined && { skills }),
          ...(experience !== undefined && { experience: parseInt(experience) }),
          ...(hourlyRate !== undefined && { hourlyRate: parseFloat(hourlyRate) }),
          ...(serviceArea !== undefined && { serviceArea }),
        },
      });
    }

    res.json({ user });
  } catch (error) {
    console.error("UpdateProfile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const completeOnboarding = async (req, res) => {
  try {
    const { skills, experience, hourlyRate, serviceArea, bio, categoryIds } = req.body;

    if (!skills || !hourlyRate || !categoryIds || categoryIds.length === 0) {
      return res.status(400).json({ error: "Skills, hourly rate, and at least one service category are required" });
    }

    // Update user bio
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(bio && { bio }),
      },
    });

    // Update provider profile with service details and categories
    await prisma.providerProfile.update({
      where: { userId: req.user.id },
      data: {
        skills,
        experience: parseInt(experience) || 0,
        hourlyRate: parseFloat(hourlyRate),
        serviceArea: serviceArea || null,
        isAvailable: true,
        categories: {
          set: [], // disconnect all existing
          connect: categoryIds.map((id) => ({ id: parseInt(id) })),
        },
      },
    });

    // Fetch updated user with profile
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        address: true,
        bio: true,
        createdAt: true,
        providerProfile: {
          include: { categories: true },
        },
      },
    });

    console.log("Onboarding complete for provider:", user.name);
    res.json({ user });
  } catch (error) {
    console.error("CompleteOnboarding error:", error);
    res.status(500).json({ error: "Failed to complete onboarding" });
  }
};
