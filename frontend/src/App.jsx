import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import SeatSelection from "./pages/SeatSelection";
import Confirmation from "./pages/Confirmation";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/showtime/:showtimeId/seats" element={<SeatSelection />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
      <footer className="footer">CineBook </footer>
    </div>
  );
}
