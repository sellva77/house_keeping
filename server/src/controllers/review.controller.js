import prisma from "../config/db.js";

export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const authorId = req.user.id;

    if (!bookingId || !rating) {
      return res.status(400).json({ error: "bookingId and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const booking = await prisma.booking.findUnique({ where: { id: parseInt(bookingId) } });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.homeownerId !== authorId) return res.status(403).json({ error: "Not your booking" });
    if (booking.status !== "COMPLETED") return res.status(400).json({ error: "Booking must be completed to review" });

    const existingReview = await prisma.review.findUnique({ where: { bookingId: parseInt(bookingId) } });
    if (existingReview) return res.status(409).json({ error: "Review already exists for this booking" });

    const review = await prisma.review.create({
      data: {
        bookingId: parseInt(bookingId),
        authorId,
        providerId: booking.providerId,
        rating: parseInt(rating),
        comment: comment || null,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Update provider's average rating
    const allReviews = await prisma.review.findMany({
      where: { providerId: booking.providerId },
    });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.providerProfile.update({
      where: { userId: booking.providerId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        totalReviews: allReviews.length,
      },
    });

    res.status(201).json({ review });
  } catch (error) {
    console.error("CreateReview error:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
};

export const getProviderReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = await prisma.review.findMany({
      where: { providerId: parseInt(id) },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ reviews });
  } catch (error) {
    console.error("GetProviderReviews error:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};
