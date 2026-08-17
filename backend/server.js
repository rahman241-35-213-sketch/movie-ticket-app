const express = require("express");
const cors = require("cors");
require("dotenv").config();

const moviesRouter = require("./routes/movies");
const seatsRouter = require("./routes/seats");
const bookingsRouter = require("./routes/bookings");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/movies", moviesRouter);
app.use("/api/seats", seatsRouter);
app.use("/api/bookings", bookingsRouter);

app.get("/", (req, res) => {
  res.json({ status: "CineBook API running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CineBook API listening on port ${PORT}`);
});
