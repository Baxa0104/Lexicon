-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Mar 03, 2025 at 04:30 PM
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
-- Database: `mydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `ride`
--

CREATE TABLE `ride` (
  `ride_id` int NOT NULL,
  `driver_id` int DEFAULT NULL,
  `origin_address` varchar(100) DEFAULT NULL,
  `destination_address` varchar(100) DEFAULT NULL,
  `departure_time` datetime DEFAULT NULL,
  `available_seats` int DEFAULT NULL,
  `ride_details` varchar(150) DEFAULT NULL,
  `ride_pics` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='		';

--
-- Dumping data for table `ride`
--

INSERT INTO `ride` (`ride_id`, `driver_id`, `origin_address`, `destination_address`, `departure_time`, `available_seats`, `ride_details`, `ride_pics`) VALUES
(1, 2, '456 Elm St, LA', '789 Oak St, TX', '2025-03-04 10:00:00', 3, 'Morning ride to Texas', 'https://yourstorage.com/ride_pics/ride1.jpg'),
(2, 4, '321 Pine St, SF', '123 Main St, NY', '2025-03-05 15:00:00', 2, 'Cross-country trip', 'https://yourstorage.com/ride_pics/ride2.jpg'),
(3, 6, '987 Birch St, WA', '654 Cedar St, FL', '2025-03-06 08:30:00', 4, 'Road trip across states', 'https://yourstorage.com/ride_pics/ride3.jpg'),
(4, 8, '753 Redwood St, AZ', '951 Willow St, OR', '2025-03-07 12:00:00', 1, 'One-way trip to Oregon', 'https://yourstorage.com/ride_pics/ride4.jpg'),
(5, 10, '852 Spruce St, NV', '159 Maple St, CO', '2025-03-08 14:45:00', 3, 'Evening drive to Colorado', 'https://yourstorage.com/ride_pics/ride5.jpg'),
(6, 2, '789 Oak St, TX', '987 Birch St, WA', '2025-03-09 09:00:00', 2, 'Morning commute', 'https://yourstorage.com/ride_pics/ride6.jpg'),
(7, 4, '321 Pine St, SF', '456 Elm St, LA', '2025-03-10 18:00:00', 4, 'LA trip with stops', 'https://yourstorage.com/ride_pics/ride7.jpg'),
(8, 6, '654 Cedar St, FL', '852 Spruce St, NV', '2025-03-11 11:30:00', 3, 'Scenic drive', 'https://yourstorage.com/ride_pics/ride8.jpg'),
(9, 8, '951 Willow St, OR', '789 Oak St, TX', '2025-03-12 07:15:00', 2, 'Early morning ride', 'https://yourstorage.com/ride_pics/ride9.jpg'),
(10, 10, '159 Maple St, CO', '123 Main St, NY', '2025-03-13 20:00:00', 5, 'Overnight journey', 'https://yourstorage.com/ride_pics/ride10.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `user_id` int NOT NULL,
  `user_name` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `phone_number` bigint DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `bio` varchar(150) DEFAULT NULL,
  `role` varchar(45) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`user_id`, `user_name`, `password`, `phone_number`, `email`, `address`, `bio`, `role`, `profile_pic`) VALUES
(1, 'Alice Johnson', 'password123', 1234567890, 'alice@example.com', '123 Main St, NY', 'Love to travel!', 'Passenger', 'https://yourstorage.com/profile_pics/alice.jpg'),
(2, 'Bob Smith', 'pass456', 9876543210, 'bob@example.com', '456 Elm St, LA', 'Driver since 2020', 'Driver', 'https://yourstorage.com/profile_pics/bob.jpg'),
(3, 'Charlie Brown', 'charlie789', 1122334455, 'charlie@example.com', '789 Oak St, TX', 'Adventurous soul', 'Passenger', 'https://yourstorage.com/profile_pics/charlie.jpg'),
(4, 'David Miller', 'davidpass', 2233445566, 'david@example.com', '321 Pine St, SF', 'Ride-sharing enthusiast', 'Driver', 'https://yourstorage.com/profile_pics/david.jpg'),
(5, 'Emma Davis', 'emma123', 3344556677, 'emma@example.com', '654 Cedar St, FL', 'Always on the go!', 'Passenger', 'https://yourstorage.com/profile_pics/emma.jpg'),
(6, 'Frank Wilson', 'frankpass', 4455667788, 'frank@example.com', '987 Birch St, WA', 'Long-distance driver', 'Driver', 'https://yourstorage.com/profile_pics/frank.jpg'),
(7, 'Grace Thomas', 'grace456', 5566778899, 'grace@example.com', '159 Maple St, CO', 'Loves road trips!', 'Passenger', 'https://yourstorage.com/profile_pics/grace.jpg'),
(8, 'Henry Walker', 'henrypass', 6677889900, 'henry@example.com', '753 Redwood St, AZ', 'Ride-sharing pro', 'Driver', 'https://yourstorage.com/profile_pics/henry.jpg'),
(9, 'Isabel Scott', 'isabelpass', 7788990011, 'isabel@example.com', '951 Willow St, OR', 'Exploring new cities!', 'Passenger', 'https://yourstorage.com/profile_pics/isabel.jpg'),
(10, 'Jack Harris', 'jackpass', 8899001122, 'jack@example.com', '852 Spruce St, NV', 'Nighttime driver', 'Driver', 'https://yourstorage.com/profile_pics/jack.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ride`
--
ALTER TABLE `ride`
  ADD PRIMARY KEY (`ride_id`),
  ADD UNIQUE KEY `ride_id_UNIQUE` (`ride_id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_id_UNIQUE` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
