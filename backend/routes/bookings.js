const express = require("express");
const router = express.Router();
const pool = require("../config/db");

function generateBookingRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "CB-";
  for (let i = 0; i < 6; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

// POST /api/bookings - create a booking (locks the chosen seats)
router.post("/", async (req, res) => {
  const { showtimeId, customerName, customerEmail, seatIds, totalPrice } = req.body;

  if (!showtimeId || !customerName || !customerEmail || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({ error: "Missing required booking fields" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Lock the rows we're about to book to prevent double-booking
    const [seatRows] = await connection.query(
      `SELECT id, status FROM seats WHERE id IN (?) FOR UPDATE`,
      [seatIds]
    );

    if (seatRows.length !== seatIds.length) {
      await connection.rollback();
      return res.status(400).json({ error: "One or more seats not found" });
    }

    const alreadyBooked = seatRows.some((s) => s.status === "booked");
    if (alreadyBooked) {
      await connection.rollback();
      return res.status(409).json({ error: "One or more selected seats were just booked. Please choose again." });
    }

    await connection.query(
      `UPDATE seats SET status = 'booked' WHERE id IN (?)`,
      [seatIds]
    );

    const bookingRef = generateBookingRef();
    await connection.query(
      `INSERT INTO bookings (showtime_id, customer_name, customer_email, seat_ids, total_price, booking_ref)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [showtimeId, customerName, customerEmail, seatIds.join(","), totalPrice, bookingRef]
    );

    await connection.commit();
    res.status(201).json({ bookingRef, message: "Booking confirmed" });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to create booking" });
  } finally {
    connection.release();
  }
});

// GET /api/bookings/:ref - look up a booking by reference
router.get("/:ref", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.*, s.show_date, s.show_time, s.hall, m.title
       FROM bookings b
       JOIN showtimes s ON b.showtime_id = s.id
       JOIN movies m ON s.movie_id = m.id
       WHERE b.booking_ref = ?`,
      [req.params.ref]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Booking not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
});

module.exports = router;
