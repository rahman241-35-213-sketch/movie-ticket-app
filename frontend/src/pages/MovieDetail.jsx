import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getMovie } from "../api";

function groupByDate(showtimes) {
  return showtimes.reduce((acc, st) => {
    const key = st.show_date.slice(0, 10);
    acc[key] = acc[key] || [];
    acc[key].push(st);
    return acc;
  }, {});
}

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMovie(id)
      .then(setMovie)
      .catch(() => setError("Couldn't load this movie."));
  }, [id]);

  if (error) return <div className="container error-text">{error}</div>;
  if (!movie) return <div className="container center-note">Loading…</div>;

  const grouped = groupByDate(movie.showtimes || []);

  return (
    <div className="container">
      <Link to="/" className="back-link">
        ← Back to all movies
      </Link>

      <div className="detail-hero">
        <div className={`poster grad-${movie.poster_gradient}`}>
          <div className="poster-title">{movie.title}</div>
        </div>

        <div className="detail-info">
          <h1>{movie.title}</h1>
          <div className="badge-row">
            <span className="badge">{movie.rating}</span>
            <span className="badge">{movie.genre}</span>
            <span className="badge">{movie.duration_minutes} min</span>
            <span className="badge">{movie.language}</span>
          </div>
          <p className="synopsis">{movie.synopsis}</p>

          {Object.keys(grouped).length === 0 && (
            <p className="center-note" style={{ padding: 0, textAlign: "left" }}>
              No showtimes scheduled yet.
            </p>
          )}

          {Object.entries(grouped).map(([date, shows]) => (
            <div className="showtime-group" key={date}>
              <h4>{new Date(date).toDateString()}</h4>
              <div className="showtime-pills">
                {shows.map((s) => (
                  <button
                    key={s.id}
                    className={`pill ${selected === s.id ? "selected" : ""}`}
                    onClick={() => setSelected(s.id)}
                  >
                    {s.hall} · {s.show_time.slice(0, 5)}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            className="btn btn-primary"
            disabled={!selected}
            onClick={() => navigate(`/showtime/${selected}/seats`, { state: { movie } })}
          >
          
          </button>
        </div>
      </div>
    </div>
  );
}
