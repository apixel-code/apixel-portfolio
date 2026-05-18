const express = require("express");
const { createBooking, getBookings } = require("../controllers/bookings.controller");

module.exports = (verifyToken) => {
  const router = express.Router();

  router.post("/", createBooking);
  router.get("/", verifyToken, getBookings);

  return router;
};
