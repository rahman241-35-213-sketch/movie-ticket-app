import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <header className="header">
        <Link to="/" className="brand">
          Cine<span>Book</span>
        </Link>
        <nav>
          <Link to="/">Movies</Link>
        </nav>
      </header>
      <div className="filmstrip" />
    </>
  );
}
