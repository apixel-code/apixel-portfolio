const Booking = require("../models/booking.model");

const serializeBooking = (booking) => ({
  id: booking._id.toString(),
  name: booking.name,
  email: booking.email,
  date: booking.date,
  timeSlot: booking.timeSlot,
  platform: booking.platform,
  notes: booking.notes,
  status: booking.status,
  createdAt: booking.createdAt,
  updatedAt: booking.updatedAt,
});

const createBooking = async (req, res) => {
  try {
    const { name, email, date, timeSlot, platform, notes } = req.body;

    if (!name || !email || !date || !timeSlot || !platform || !notes) {
      return res.status(400).json({ detail: "All booking fields are required" });
    }

    const booking = await Booking.create({
      name,
      email,
      date,
      timeSlot,
      platform,
      notes,
    });

    return res.status(201).json({
      message: "Booking request submitted successfully",
      booking: serializeBooking(booking),
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ detail: error.message });
    }

    console.error("Error creating booking:", error);
    return res.status(500).json({ detail: "Failed to submit booking request" });
  }
};

const getBookings = async (_req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return res.json(bookings.map(serializeBooking));
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ detail: "Failed to fetch bookings" });
  }
};

module.exports = {
  createBooking,
  getBookings,
};
