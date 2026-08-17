
CREATE DATABASE cinebook;
USE cinebook;


CREATE TABLE  movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  duration_minutes INT NOT NULL,          
  language VARCHAR(50) NOT NULL,
  synopsis TEXT,
  poster_gradient VARCHAR(50) NOT NULL,
  price DECIMAL(6,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE showtimes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT NOT NULL,
  hall VARCHAR(50) NOT NULL,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);


CREATE TABLE seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  showtime_id INT NOT NULL,
  seat_row VARCHAR(2) NOT NULL,  
  seat_number INT NOT NULL,       
  status ENUM('available','booked') DEFAULT 'available',
  FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE,
  UNIQUE KEY unique_seat (showtime_id, seat_row, seat_number)
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  showtime_id INT NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  seat_ids VARCHAR(255) NOT NULL,  
  total_price DECIMAL(8,2) NOT NULL,
  booking_ref VARCHAR(20) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE
);

INSERT INTO movies (title, genre, duration_minutes,  language, synopsis, poster_gradient, price) VALUES
('Spider-man: Brand New Day', 'Action / Superhero', 148,  'English',
 'A young hero balances life and a city that needs saving, facing a villain unlike any before.', 'crimson', 400.00),
('Guardians of the Galaxy', 'Action / Adventure', 125,  'English',
 'When an ancient threat resurfaces, a scattered team of heroes must reunite to defend the planet.',
 'sapphire', 400.00),
('Iron-Man', 'Action / Sci-Fi', 132,  'English',
 'A genius inventor''s newest suit is tested when a rival tech empire threatens global security.',
 'gold', 450.00),
('Shadow Cat: Nine Lives', 'Action / Thriller', 121,  'English',
 'A stealthy antihero navigates the criminal underworld to protect what''s left of her family.',
 'emerald', 400.00),
('Avengers:Doomsday', 'Action / Sci-Fi', 139,  'English',
 'An exiled prince of a mythic realm must earn back his power to stop a cosmic war.',
 'violet', 400.00),
('X-Men', 'Action / Sci-Fi', 142,  'English',
 'A ragtag crew of misfit space heroes race across the galaxy to stop a weapon that could end it.',
 'sunset', 400.00);

INSERT INTO showtimes (movie_id, hall, show_date, show_time)
(1, 'Hall 1', CURDATE(), '1:30:00'),
(1, 'Hall 2', CURDATE(), '3:00:00'),
(2, 'Hall 3', CURDATE(), '2:30:00'),
(2, 'Hall 3', CURDATE(), '11:00:00'),
(2, 'Hall 3', CURDATE(), '1:00:00'),
(1, 'Hall 1', CURDATE(), '11:30:00'),
(1, 'Hall 2', CURDATE() + INTERVAL 1 DAY, '1:00:00'),
(2, 'Hall 3', CURDATE(), '1:00:00'),
(2, 'Hall 3', CURDATE(), '2:30:00');
