# CineBook — Movie Ticket Booking App

Full-stack movie ticket booking app: **React.js** (Vite) frontend, **Node.js + Express.js** backend, **MySQL** database. Cinema-marquee visual theme (deep midnight background, marquee-gold + neon-cherry accents, film-strip motifs, ticket-stub confirmation).

> Note on posters: real Spider-Man / Avengers artwork is Marvel/Sony copyrighted material, so this project ships with placeholder superhero-style titles ("Web Slinger: New Horizon", "Earth's Mightiest: Reunion", etc.) rendered as bold gradient poster cards. Swap in your own licensed images later by editing the `poster_gradient` logic in `MovieCard.jsx` / `MovieDetail.jsx` to use `<img>` tags instead.

## Features
- Browse now-showing movies with genre/rating/duration/price
- Movie detail page with synopsis + showtime picker (date/hall/time)
- Interactive seat map (8x8 grid) with live available/selected/booked states
- Booking form with transaction-safe seat locking (no double-booking, even under concurrent requests)
- Ticket-stub confirmation page with a unique booking reference

## Stack
- **Frontend:** React 18, React Router, Axios, Vite
- **Backend:** Node.js, Express.js, mysql2 (connection pool, transactions)
- **Database:** MySQL

## Project structure
```
movie-ticket-app/
├── backend/
│   ├── config/db.js        # MySQL pool
│   ├── routes/movies.js
│   ├── routes/seats.js
│   ├── routes/bookings.js
│   ├── database.sql        # schema + seed data
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── styles.css
    └── index.html
```

## Setup

### 1. Database
```bash
mysql -u root -p < backend/database.sql
```
This creates the `cinebook` database, tables, and a few sample movies/showtimes.

### 2. Backend
```bash
cd backend
cp .env.example .env      # then edit DB_PASSWORD to match your MySQL setup
npm install
npm run dev                # or: npm start
```
Runs on `http://localhost:5000`.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173` and proxies `/api` calls to the backend.

Open `http://localhost:5173` in your browser.

## API summary
| Method | Endpoint                  | Purpose                          |
|--------|----------------------------|-----------------------------------|
| GET    | `/api/movies`              | List all movies                  |
| GET    | `/api/movies/:id`          | Movie details + showtimes        |
| GET    | `/api/seats/:showtimeId`   | Seat grid for a showtime         |
| POST   | `/api/bookings`             | Create a booking (locks seats)   |
| GET    | `/api/bookings/:ref`        | Look up a booking by reference   |

## Notes
- Seats are generated lazily the first time a showtime's seat map is requested.
- Booking uses a MySQL transaction with `SELECT ... FOR UPDATE` to prevent two people from booking the same seat at once.
- Colors, fonts, and the ticket-stub design all live in `frontend/src/styles.css` if you want to retheme it.
