-- Task Management Application - MySQL Database Script
-- Default credentials: admin / admin123  |  user / user123

CREATE DATABASE IF NOT EXISTS TaskManagementDb
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE TaskManagementDb;

-- Tasks table
CREATE TABLE IF NOT EXISTS `Tasks` (
    `Id`          INT           NOT NULL AUTO_INCREMENT,
    `Title`       VARCHAR(200)  CHARACTER SET utf8mb4 NOT NULL,
    `Description` VARCHAR(2000) CHARACTER SET utf8mb4 NULL,
    `IsCompleted` TINYINT(1)    NOT NULL DEFAULT 0,
    `Priority`    LONGTEXT      CHARACTER SET utf8mb4 NOT NULL,
    `DueDate`     DATETIME(6)   NULL,
    `CreatedAt`   DATETIME(6)   NOT NULL,
    `UpdatedAt`   DATETIME(6)   NOT NULL,
    CONSTRAINT `PK_Tasks` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

-- Users table
CREATE TABLE IF NOT EXISTS `Users` (
    `Id`           INT          NOT NULL AUTO_INCREMENT,
    `Username`     VARCHAR(100) CHARACTER SET utf8mb4 NOT NULL,
    `PasswordHash` LONGTEXT     CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_Users` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE UNIQUE INDEX IF NOT EXISTS `IX_Users_Username` ON `Users` (`Username`);

-- Seed users
-- Passwords are BCrypt hashed: admin123 / user123
INSERT INTO `Users` (`Id`, `Username`, `PasswordHash`) VALUES
(1, 'admin', '$2a$11$N0BDrSC9rVSLi9iuf97XSeqhkSNNBoZoaN8bh0MriUKGvtiyDjV/K'),
(2, 'user',  '$2a$11$d1eAc/iEBcol1RpritOuRuT1SMqYBv4txMc6p8LERrcqpY9/EvGJy')
ON DUPLICATE KEY UPDATE `Id` = `Id`;
