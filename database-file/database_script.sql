-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Apr 02, 2025 at 10:34 PM
-- Server version: 9.2.0
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sd2-db`
--


DROP TABLE IF EXISTS `booking`;
DROP TABLE IF EXISTS `ride`;
DROP TABLE IF EXISTS `user`;

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `booking_id` int NOT NULL,
  `ride_id` int NOT NULL,
  `user_id` int NOT NULL,
  `booking_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Pending','Confirmed','Cancelled','Completed') NOT NULL DEFAULT 'Pending',
  `payment_status` enum('Pending','Paid','Refunded') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`booking_id`, `ride_id`, `user_id`, `booking_time`, `status`, `payment_status`) VALUES
(1, 1, 2, '2025-04-02 12:28:40', 'Confirmed', 'Paid'),
(2, 2, 4, '2025-04-02 12:28:40', 'Pending', 'Pending'),
(3, 3, 6, '2025-04-02 12:28:40', 'Cancelled', 'Refunded'),
(4, 1, 8, '2025-04-02 12:28:40', 'Confirmed', 'Paid'),
(5, 2, 10, '2025-04-02 12:28:40', 'Completed', 'Paid');

-- --------------------------------------------------------

--
-- Table structure for table `ride`
--

CREATE TABLE `ride` (
  `ride_id` int NOT NULL,
  `short_name` varchar(50) NOT NULL,
  `driver_id` int NOT NULL,
  `origin_address` varchar(255) NOT NULL,
  `destination_address` varchar(255) NOT NULL,
  `departure_date` date NOT NULL,
  `departure_time` time NOT NULL,
  `available_seats` int NOT NULL,
  `ride_details` varchar(255) DEFAULT NULL,
  `ride_pics` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` enum('Scheduled','Ongoing','Completed','Cancelled') NOT NULL DEFAULT 'Scheduled'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ride`
--

INSERT INTO `ride` (`ride_id`, `short_name`, `driver_id`, `origin_address`, `destination_address`, `departure_date`, `departure_time`, `available_seats`, `ride_details`, `ride_pics`, `price`, `status`) VALUES
(1, 'Morning City Tour', 1, '221B Baker Street, London', 'Big Ben, London', '2025-04-05', '08:30:00', 3, 'Morning tour around London.', 'https://picsum.photos/seed/ride1/600/400', 10.00, 'Scheduled'),
(2, 'Evening Thames Ride', 3, 'Tower Bridge, London', 'London Eye, London', '2025-04-06', '18:00:00', 2, 'Enjoy the sunset over the Thames.', 'https://picsum.photos/seed/ride2/600/400', 15.00, 'Scheduled'),
(3, 'Nightlife Drive', 5, 'Buckingham Palace, London', 'Trafalgar Square, London', '2025-04-07', '22:30:00', 4, 'Explore London’s nightlife.', 'https://picsum.photos/seed/ride3/600/400', 20.00, 'Scheduled'),
(4, 'Historic London', 7, 'The Shard, London', 'Tower of London', '2025-04-08', '10:00:00', 3, 'Historical landmarks tour', 'https://picsum.photos/seed/ride4/600/400', 18.50, 'Scheduled'),
(5, 'West End Tour', 9, 'Covent Garden, London', 'Leicester Square, London', '2025-04-09', '19:30:00', 2, 'Theater district night tour', 'https://picsum.photos/seed/ride5/600/400', 22.00, 'Scheduled'),
(6, 'Parks Circuit', 1, 'Hyde Park Corner, London', 'Regents Park, London', '2025-04-10', '09:45:00', 4, 'Scenic parks tour', 'https://picsum.photos/seed/ride6/600/400', 12.75, 'Scheduled'),
(7, 'Airport Transfer', 3, 'Heathrow Airport', 'Paddington Station, London', '2025-04-11', '06:15:00', 3, 'Early morning airport transfer', 'https://picsum.photos/seed/ride7/600/400', 25.00, 'Scheduled'),
(8, 'Shopping Express', 5, 'Oxford Street, London', 'Westfield London', '2025-04-12', '11:00:00', 2, 'Shopping district transfer', 'https://picsum.photos/seed/ride8/600/400', 14.00, 'Scheduled'),
(9, 'University Run', 7, 'Kings Cross Station, London', 'UCL Campus', '2025-04-13', '08:00:00', 4, 'Student commuter special', 'https://picsum.photos/seed/ride9/600/400', 9.99, 'Scheduled'),
(10, 'Weekend Getaway', 9, 'London Victoria Station', 'Brighton Beach', '2025-04-14', '07:00:00', 3, 'Coastal weekend trip', 'https://picsum.photos/seed/ride10/600/400', 35.00, 'Scheduled');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int NOT NULL,
  `user_name` varchar(45) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone_number` bigint DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `role` enum('Admin','Driver','Passenger') NOT NULL DEFAULT 'Passenger',
  `profile_pic` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `user_name`, `password_hash`, `phone_number`, `email`, `address`, `bio`, `role`, `profile_pic`, `created_at`) VALUES
(1, 'Oliver Brown', 'hashed_pass_1', 447911223344, 'oliver@example.com', '221B Baker Street, London', 'Love driving around London.', 'Driver', 'https://randomuser.me/api/portraits/men/1.jpg', '2025-04-02 12:28:40'),
(2, 'Emily White', 'hashed_pass_2', 447922334455, 'emily@example.com', '10 Downing Street, London', 'Adventurous passenger.', 'Passenger', 'https://randomuser.me/api/portraits/women/1.jpg', '2025-04-02 12:28:40'),
(3, 'Jack Wilson', 'hashed_pass_3', 447933445566, 'jack@example.com', 'Tower Bridge, London', 'Always up for a road trip.', 'Driver', 'https://randomuser.me/api/portraits/men/2.jpg', '2025-04-02 12:28:40'),
(4, 'Sophie Davies', 'hashed_pass_4', 447944556677, 'sophie@example.com', 'Big Ben, London', 'Frequent city traveler.', 'Passenger', 'https://randomuser.me/api/portraits/women/2.jpg', '2025-04-02 12:28:40'),
(5, 'Charlie Evans', 'hashed_pass_5', 447955667788, 'charlie@example.com', 'Buckingham Palace, London', 'Nighttime driving expert.', 'Driver', 'https://randomuser.me/api/portraits/men/3.jpg', '2025-04-02 12:28:40'),
(6, 'Lucy Green', 'hashed_pass_6', 447966778899, 'lucy@example.com', 'Westminster Abbey, London', 'Loves long drives.', 'Passenger', 'https://randomuser.me/api/portraits/women/3.jpg', '2025-04-02 12:28:40'),
(7, 'Henry Lewis', 'hashed_pass_7', 447977889900, 'henry@example.com', 'The Shard, London', 'Uber driver since 2019.', 'Driver', 'https://randomuser.me/api/portraits/men/4.jpg', '2025-04-02 12:28:40'),
(8, 'Grace Hall', 'hashed_pass_8', 447988990011, 'grace@example.com', 'London Eye, London', 'Exploring the city one ride at a time.', 'Passenger', 'https://randomuser.me/api/portraits/women/4.jpg', '2025-04-02 12:28:40'),
(9, 'Oscar Walker', 'hashed_pass_9', 447999001122, 'oscar@example.com', 'Trafalgar Square, London', 'Full-time ride-sharing driver.', 'Driver', 'https://randomuser.me/api/portraits/men/5.jpg', '2025-04-02 12:28:40'),
(10, 'Mia Scott', 'hashed_pass_10', 447900112233, 'mia@example.com', 'Covent Garden, London', 'New to the platform!', 'Passenger', 'https://randomuser.me/api/portraits/women/5.jpg', '2025-04-02 12:28:40');

--
-- Indexes for dumped tables
--

-- (Indexes remain unchanged from original dump)

--
-- AUTO_INCREMENT for dumped tables
--

-- (Auto-increment values remain unchanged)

--
-- Constraints for dumped tables
--

-- (Foreign key constraints remain unchanged)