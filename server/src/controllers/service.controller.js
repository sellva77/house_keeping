import prisma from "../config/db.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { name: "asc" },
    });
    res.json({ categories });
  } catch (error) {
    console.error("GetCategories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const getProvidersByCategory = async (req, res) => {
  try {
    const { categoryId } = req.query;

    const where = categoryId
      ? { categories: { some: { id: parseInt(categoryId) } } }
      : {};

    const providers = await prisma.providerProfile.findMany({
      where: {
        ...where,
        isAvailable: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            bio: true,
          },
        },
        categories: true,
      },
      orderBy: { rating: "desc" },
    });

    res.json({ providers });
  } catch (error) {
    console.error("GetProviders error:", error);
    res.status(500).json({ error: "Failed to fetch providers" });
  }
};

export const getProviderDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await prisma.providerProfile.findUnique({
      where: { userId: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            bio: true,
          },
        },
        categories: true,
      },
    });

    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    const reviews = await prisma.review.findMany({
      where: { providerId: parseInt(id) },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    res.json({ provider, reviews });
  } catch (error) {
    console.error("GetProviderDetail error:", error);
    res.status(500).json({ error: "Failed to fetch provider details" });
  }
};
