-- phpMyAdmin SQL Dump  
-- Version 5.2.2  
-- Host: db  
-- Generation Time: Mar 03, 2025 at 04:30 PM  
-- Server Version: 9.2.0  
-- PHP Version: 8.2.27  

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";  
START TRANSACTION;  
SET time_zone = "+00:00";  

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;  
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;  
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;  
/*!40101 SET NAMES utf8mb4 */;  

-- --------------------------------------------------------  
-- Table structure for `user`  
-- --------------------------------------------------------  

CREATE TABLE `user` (  
  `user_id` INT NOT NULL AUTO_INCREMENT,  
  `user_name` VARCHAR(45) NOT NULL,  
  `password` VARCHAR(255) NOT NULL,  
  `phone_number` BIGINT DEFAULT NULL,  
  `email` VARCHAR(100) NOT NULL UNIQUE,  
  `address` VARCHAR(100) DEFAULT NULL,  
  `bio` VARCHAR(150) DEFAULT NULL,  
  `role` ENUM('Driver', 'Passenger') NOT NULL DEFAULT 'Passenger',  
  `profile_pic` VARCHAR(255) DEFAULT NULL,  
  PRIMARY KEY (`user_id`)  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;  

-- Dumping data for table `user`  
-- Insert 10 users (5 Drivers, 5 Passengers)
INSERT INTO `user` (`user_id`, `user_name`, `password`, `phone_number`, `email`, `address`, `bio`, `role`, `profile_pic`) VALUES  
(1, 'Alice Johnson', 'password123', 1234567890, 'alice@example.com', '123 Main St, NY', 'Love to travel!', 'Passenger', 'https://i.ibb.co/Z6Lzh5WM/istockphoto-1368424494-612x612.jpg'),  
(2, 'Bob Smith', 'pass456', 9876543210, 'bob@example.com', '456 Elm St, LA', 'Driver since 2020', 'Driver', 'https://i.ibb.co/7tTy7Vpc/0-Ggt-Xwliw-AO6-QURi.jpg'),  
(3, 'Charlie Brown', 'charlie789', 1122334455, 'charlie@example.com', '789 Oak St, TX', 'Adventurous soul', 'Passenger', 'https://i.ibb.co/pr1vdByp/pexels-andrewperformance1-697509.jpg'),  
(4, 'David Miller', 'davidpass', 2233445566, 'david@example.com', '321 Pine St, SF', 'Ride-sharing enthusiast', 'Driver', 'https://i.ibb.co/6cnJPJfs/images.jpg'),  
(5, 'Emma Davis', 'emma123', 3344556677, 'emma@example.com', '654 Cedar St, FL', 'Always on the go!', 'Passenger', 'https://i.ibb.co/6cnJPJfs/images.jpg'),  
(6, 'Frank Wilson', 'frankpass', 4455667788, 'frank@example.com', '987 Birch St, WA', 'Long-distance driver', 'Driver', 'https://i.ibb.co/6cnJPJfs/images.jpg'),  
(7, 'Grace Thomas', 'grace456', 5566778899, 'grace@example.com', '159 Maple St, CO', 'Loves road trips!', 'Passenger', 'https://i.ibb.co/6cnJPJfs/images.jpg'),  
(8, 'Henry Walker', 'henrypass', 6677889900, 'henry@example.com', '753 Redwood St, AZ', 'Ride-sharing pro', 'Driver', 'https://i.ibb.co/6cnJPJfs/images.jpg'),  
(9, 'Isabel Scott', 'isabelpass', 7788990011, 'isabel@example.com', '951 Willow St, OR', 'Exploring new cities!', 'Passenger', 'https://i.ibb.co/6cnJPJfs/images.jpg'),  
(10, 'Jack Harris', 'jackpass', 8899001122, 'jack@example.com', '852 Spruce St, NV', 'Nighttime driver', 'Driver', 'https://i.ibb.co/6cnJPJfs/images.jpg');  

-- --------------------------------------------------------  
-- Table structure for `ride`  
-- --------------------------------------------------------  

CREATE TABLE `ride` (  
  `ride_id` INT NOT NULL AUTO_INCREMENT,  
  `short_name` VARCHAR(50) NOT NULL,  
  `driver_id` INT NOT NULL,  
  `origin_address` VARCHAR(100) DEFAULT NULL,  
  `destination_address` VARCHAR(100) DEFAULT NULL,  
  `departure_date` DATE DEFAULT NULL,  
  `departure_time` TIME DEFAULT NULL,  
  `available_seats` INT DEFAULT NULL,  
  `ride_details` VARCHAR(150) DEFAULT NULL,  
  `ride_pics` VARCHAR(255) DEFAULT NULL,  
  PRIMARY KEY (`ride_id`),  
  FOREIGN KEY (`driver_id`) REFERENCES `user`(`user_id`)  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;  

-- Dumping data for table `ride`  
-- Insert 20 ride entries
INSERT INTO `ride` (`ride_id`, `short_name`, `driver_id`, `origin_address`, `destination_address`, `departure_date`, `departure_time`, `available_seats`, `ride_details`, `ride_pics`) VALUES  
(1, 'Morning Texas Trip', 2, '456 Elm St, LA', '789 Oak St, TX', '2025-03-04', '10:00:00', 3, 'Morning ride to Texas', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(2, 'Cross-Country Ride', 4, '321 Pine St, SF', '123 Main St, NY', '2025-03-05', '15:00:00', 2, 'Cross-country trip', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(3, 'Scenic Adventure', 6, '987 Birch St, WA', '654 Cedar St, FL', '2025-03-06', '08:30:00', 4, 'Road trip across states', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(4, 'One-Way to Oregon', 8, '753 Redwood St, AZ', '951 Willow St, OR', '2025-03-07', '12:00:00', 1, 'Direct ride to Oregon', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(5, 'Evening to Colorado', 10, '852 Spruce St, NV', '159 Maple St, CO', '2025-03-08', '14:45:00', 3, 'Evening drive to Colorado', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(6, 'Morning Commute', 2, '789 Oak St, TX', '987 Birch St, WA', '2025-03-09', '09:00:00', 2, 'Daily commute route', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(7, 'Weekend LA Trip', 4, '321 Pine St, SF', '456 Elm St, LA', '2025-03-10', '18:00:00', 4, 'Trip to LA with stops', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(8, 'Sunset Drive', 6, '654 Cedar St, FL', '852 Spruce St, NV', '2025-03-11', '11:30:00', 3, 'Beautiful scenic drive', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(9, 'Early Morning Ride', 8, '951 Willow St, OR', '789 Oak St, TX', '2025-03-12', '07:15:00', 2, 'Early ride before sunrise', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(10, 'Overnight Journey', 10, '159 Maple St, CO', '123 Main St, NY', '2025-03-13', '20:00:00', 5, 'Overnight trip', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(11, 'Highway Express', 2, '101 Palm St, CA', '202 Cedar Ave, FL', '2025-03-14', '06:30:00', 3, 'Express highway ride', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(12, 'Desert Roadtrip', 4, '500 Oak St, NV', '908 Pine St, TX', '2025-03-15', '10:45:00', 2, 'Drive through the desert', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(13, 'Rocky Mountain Trip', 6, '600 Spruce St, CO', '205 Birch Ave, WY', '2025-03-16', '12:30:00', 4, 'Adventure in the Rockies', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(14, 'Northern Lights Tour', 8, '300 Maple St, MN', '700 Aspen St, ND', '2025-03-17', '21:00:00', 2, 'Night drive for northern lights', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(15, 'Lake View Drive', 10, '102 River Rd, MI', '204 Beach Ave, OH', '2025-03-18', '08:00:00', 3, 'Scenic lake drive', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(16, 'Hilltop Journey', 2, '999 Summit St, TN', '505 Valley Rd, KY', '2025-03-19', '07:15:00', 4, 'Hilltop view experience', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(17, 'Rainforest Expedition', 4, '150 Tropic St, FL', '789 Jungle Rd, LA', '2025-03-20', '14:00:00', 2, 'Trip through rainforests', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(18, 'Historic Route', 6, '789 Liberty St, PA', '456 Freedom Ave, DC', '2025-03-21', '10:30:00', 3, 'Exploring historical sites', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(19, 'Coastal Drive', 8, '111 Seaview Rd, CA', '999 Ocean St, OR', '2025-03-22', '16:00:00', 2, 'Beautiful ocean drive', 'https://i.ibb.co/YTQdVZWw/pic1.jpg'),  
(20, 'Night Highway Ride', 10, '350 Neon St, NV', '702 Vegas Blvd, NV', '2025-03-23', '23:30:00', 5, 'Night drive across the highway', 'https://i.ibb.co/YTQdVZWw/pic1.jpg');  

COMMIT;
