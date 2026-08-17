const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET /api/movies - list all movies
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM movies ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// GET /api/movies/:id - single movie + its showtimes
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [movieRows] = await pool.query("SELECT * FROM movies WHERE id = ?", [id]);
    if (movieRows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }
    const [showtimes] = await pool.query(
      "SELECT * FROM showtimes WHERE movie_id = ? ORDER BY show_date, show_time",
      [id]
    );
    res.json({ ...movieRows[0], showtimes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch movie" });
  }
});

module.exports = router;
