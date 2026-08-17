const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const SEATS_PER_ROW = 8;

// GET /api/seats/:showtimeId - returns seat grid, auto-creating seats on first request
router.get("/:showtimeId", async (req, res) => {
  const { showtimeId } = req.params;
  try {
    const [existing] = await pool.query(
      "SELECT * FROM seats WHERE showtime_id = ? ORDER BY seat_row, seat_number",
      [showtimeId]
    );

    if (existing.length > 0) {
      return res.json(existing);
    }

    // Generate seat grid for this showtime the first time it's requested
    const values = [];
    for (const row of ROWS) {
      for (let n = 1; n <= SEATS_PER_ROW; n++) {
        values.push([showtimeId, row, n]);
      }
    }
    await pool.query(
      "INSERT INTO seats (showtime_id, seat_row, seat_number) VALUES ?",
      [values]
    );

    const [seats] = await pool.query(
      "SELECT * FROM seats WHERE showtime_id = ? ORDER BY seat_row, seat_number",
      [showtimeId]
    );
    res.json(seats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch seats" });
  }
});

module.exports = router;
