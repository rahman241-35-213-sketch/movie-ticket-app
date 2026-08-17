import { useLocation, Link, Navigate } from "react-router-dom";

export default function Confirmation() {
  const { state } = useLocation();

  if (!state) return <Navigate to="/" replace />;

  const { bookingRef, movie, seats, total, name } = state;

  return (
    <div className="container">
      <h2 className="section-title">
        <span className="dot">●</span> You're All Set
      </h2>

      <div className="ticket">
        <div className="ticket-top">
          <div className="stamp">★ ADMIT ONE ★</div>
          <h2>{movie?.title}</h2>
          <div className="movie-meta">Booked for {name}</div>
        </div>
        <div className="ticket-divider" />
        <div className="ticket-bottom">
          <div className="ticket-field">
            <label>Seats</label>
            <span>{seats.map((s) => `${s.seat_row}${s.seat_number}`).join(", ")}</span>
          </div>
          <div className="ticket-field">
            <label>Total Paid</label>
            <span>${total}</span>
          </div>
          <div className="ticket-field">
            <label>Genre</label>
            <span>{movie?.genre}</span>
          </div>
          <div className="ticket-field">
            <label>Rating</label>
            <span>{movie?.rating}</span>
          </div>
          <div className="ticket-ref">{bookingRef}</div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 28 }}>
        <Link to="/" className="btn btn-outline">
          Book Another Movie
        </Link>
      </div>
    </div>
  );
}
