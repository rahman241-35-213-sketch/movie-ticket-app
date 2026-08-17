import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { getSeats, createBooking } from "../api";

export default function SeatSelection() {
  const { showtimeId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const movie = state?.movie;

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getSeats(showtimeId)
      .then(setSeats)
      .catch(() => setError("Couldn't load the seat map."));
  }, [showtimeId]);

  const price = movie ? Number(movie.price) : 0;
  const total = (selectedSeats.length * price).toFixed(2);

  const toggleSeat = (seat) => {
    if (seat.status === "booked") return;
    setSelectedSeats((prev) =>
      prev.find((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  const rows = [...new Set(seats.map((s) => s.seat_row))].sort();

  const handleBook = async () => {
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    if (selectedSeats.length === 0) {
      setError("Pick at least one seat.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await createBooking({
        showtimeId,
        customerName: name,
        customerEmail: email,
        seatIds: selectedSeats.map((s) => s.id),
        totalPrice: total,
      });
      navigate("/confirmation", {
        state: {
          bookingRef: res.bookingRef,
          movie,
          seats: selectedSeats,
          total,
          name,
        },
      });
    } catch (err) {
      setError(err.response?.data?.error || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (error && seats.length === 0) {
    return <div className="container error-text">{error}</div>;
  }

  return (
    <div className="container">
      <Link to={movie ? `/movies/${movie.id}` : "/"} className="back-link">
        ← Back to showtimes
      </Link>

      <h2 className="section-title">
        <span className="dot">●</span> {movie ? movie.title : "Select Your Seats"}
      </h2>

      <div className="screen-label">Screen this way</div>
      <div className="screen-curve" />

      <div className="seat-map">
        {rows.map((row) => (
          <div className="seat-row" key={row}>
            <span className="seat-row-label">{row}</span>
            {seats
              .filter((s) => s.seat_row === row)
              .map((seat) => {
                const isSelected = selectedSeats.find((s) => s.id === seat.id);
                const cls = seat.status === "booked" ? "booked" : isSelected ? "selected" : "available";
                return (
                  <button
                    key={seat.id}
                    className={`seat ${cls}`}
                    onClick={() => toggleSeat(seat)}
                    title={`${seat.seat_row}${seat.seat_number}`}
                  >
                    {seat.seat_number}
                  </button>
                );
              })}
          </div>
        ))}
      </div>

      <div className="legend">
        <span>
          <span className="legend-swatch" style={{ background: "#1E2338", border: "1px solid #2a3050" }} />
          Available
        </span>
        <span>
          <span className="legend-swatch" style={{ background: "#FF3864" }} />
          Selected
        </span>
        <span>
          <span className="legend-swatch" style={{ background: "#05060c" }} />
          Booked
        </span>
      </div>

      <div className="booking-summary">
        <div className="row">
          <span>Seats</span>
          <strong>
            {selectedSeats.length > 0
              ? selectedSeats.map((s) => `${s.seat_row}${s.seat_number}`).join(", ")
              : "—"}
          </strong>
        </div>
        <div className="row">
          <span>Price / ticket</span>
          <strong>${price.toFixed(2)}</strong>
        </div>
        <div className="row">
          <span>Total</span>
          <strong>${total}</strong>
        </div>

        <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <input
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-primary btn-block" onClick={handleBook} disabled={submitting}>
          {submitting ? "Booking…" : `Confirm Booking · $${total}`}
        </button>
      </div>
    </div>
  );
}
