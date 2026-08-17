import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.id}`} className="movie-card">
      <div className={`poster grad-${movie.poster_gradient}`}>
        <div className="poster-title">{movie.title}</div>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <div className="movie-meta">
          {movie.genre} · {movie.duration_minutes} min
        </div>
        <div className="badge-row">
          <span className="badge">{movie.rating}</span>
          <span className="badge">{movie.language}</span>
        </div>
        <div className="price-tag">${Number(movie.price).toFixed(2)}</div>
      </div>
    </Link>
  );
}
