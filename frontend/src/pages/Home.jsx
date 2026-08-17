import { useEffect, useState } from "react";
import { getMovies } from "../api";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMovies()
      .then(setMovies)
      .catch(() => setError("Couldn't load movies. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <h1>
        Book your <span className="accent">Shows</span> 
        </h1>
        <p>Grab your seats before the lights go down.</p>
      </section>

      <div className="container">
        <h2 className="section-title">
          <span className="dot">●</span> In Theaters
        </h2>

        {loading && <p className="center-note">Loading showtimes…</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && (
          <div className="movie-grid">
            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
