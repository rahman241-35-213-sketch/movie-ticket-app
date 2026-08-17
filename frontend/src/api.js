import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const getMovies = () => api.get("/movies").then((r) => r.data);
export const getMovie = (id) => api.get(`/movies/${id}`).then((r) => r.data);
export const getSeats = (showtimeId) => api.get(`/seats/${showtimeId}`).then((r) => r.data);
export const createBooking = (payload) => api.post("/bookings", payload).then((r) => r.data);
export const getBooking = (ref) => api.get(`/bookings/${ref}`).then((r) => r.data);

export default api;
