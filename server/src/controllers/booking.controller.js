import prisma from "../config/db.js";

export const createBooking = async (req, res) => {
  try {
    const { providerId, serviceCategoryId, date, timeSlot, address, notes } = req.body;
    const homeownerId = req.user.id;

    if (!providerId || !serviceCategoryId || !date || !timeSlot || !address) {
      return res.status(400).json({ error: "providerId, serviceCategoryId, date, timeSlot, and address are required" });
    }

    const booking = await prisma.booking.create({
      data: {
        homeownerId,
        providerId: parseInt(providerId),
        serviceCategoryId: parseInt(serviceCategoryId),
        date: new Date(date),
        timeSlot,
        address,
        notes: notes || null,
        status: "PENDING",
      },
      include: {
        provider: { select: { id: true, name: true, avatar: true } },
        homeowner: { select: { id: true, name: true, avatar: true } },
        serviceCategory: true,
      },
    });

    res.status(201).json({ booking });
  } catch (error) {
    console.error("CreateBooking error:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { status } = req.query;

    const where = userRole === "HOMEOWNER"
      ? { homeownerId: userId }
      : { providerId: userId };

    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        provider: { select: { id: true, name: true, avatar: true, phone: true } },
        homeowner: { select: { id: true, name: true, avatar: true, phone: true } },
        serviceCategory: true,
        review: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ bookings });
  } catch (error) {
    console.error("GetMyBookings error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

export const acceptBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const providerId = req.user.id;

    const booking = await prisma.booking.findUnique({ where: { id: parseInt(id) } });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.providerId !== providerId) return res.status(403).json({ error: "Not your booking" });
    if (booking.status !== "PENDING") return res.status(400).json({ error: "Booking is not pending" });

    const updated = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: "ACCEPTED" },
      include: {
        homeowner: { select: { id: true, name: true, avatar: true } },
        serviceCategory: true,
      },
    });

    res.json({ booking: updated });
  } catch (error) {
    console.error("AcceptBooking error:", error);
    res.status(500).json({ error: "Failed to accept booking" });
  }
};

export const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const providerId = req.user.id;

    const booking = await prisma.booking.findUnique({ where: { id: parseInt(id) } });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.providerId !== providerId) return res.status(403).json({ error: "Not your booking" });
    if (booking.status !== "PENDING") return res.status(400).json({ error: "Booking is not pending" });

    const updated = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: "REJECTED" },
    });

    res.json({ booking: updated });
  } catch (error) {
    console.error("RejectBooking error:", error);
    res.status(500).json({ error: "Failed to reject booking" });
  }
};

export const completeBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const providerId = req.user.id;

    const booking = await prisma.booking.findUnique({ where: { id: parseInt(id) } });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.providerId !== providerId) return res.status(403).json({ error: "Not your booking" });
    if (booking.status !== "ACCEPTED") return res.status(400).json({ error: "Booking must be accepted first" });

    const updated = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: "COMPLETED" },
      include: {
        homeowner: { select: { id: true, name: true, avatar: true } },
        serviceCategory: true,
      },
    });

    res.json({ booking: updated });
  } catch (error) {
    console.error("CompleteBooking error:", error);
    res.status(500).json({ error: "Failed to complete booking" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const homeownerId = req.user.id;

    const booking = await prisma.booking.findUnique({ where: { id: parseInt(id) } });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.homeownerId !== homeownerId) return res.status(403).json({ error: "Not your booking" });
    if (["COMPLETED", "CANCELLED"].includes(booking.status)) {
      return res.status(400).json({ error: "Cannot cancel this booking" });
    }

    const updated = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: "CANCELLED" },
    });

    res.json({ booking: updated });
  } catch (error) {
    console.error("CancelBooking error:", error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};
