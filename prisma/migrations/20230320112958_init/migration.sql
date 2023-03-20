-- CreateTable
CREATE TABLE `Users` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastLogin` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Users_userId_key`(`userId`),
    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MeetData` (
    `meetId` INTEGER NOT NULL AUTO_INCREMENT,
    `meetCode` VARCHAR(191) NOT NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `meetTranscript` LONGBLOB NOT NULL,

    UNIQUE INDEX `MeetData_meetId_key`(`meetId`),
    UNIQUE INDEX `MeetData_meetCode_key`(`meetCode`),
    PRIMARY KEY (`meetId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserMeetMap` (
    `UserMeetMap` INTEGER NOT NULL,
    `mappedUserId` INTEGER NOT NULL,
    `mappedMeetId` INTEGER NOT NULL,

    UNIQUE INDEX `UserMeetMap_UserMeetMap_key`(`UserMeetMap`),
    UNIQUE INDEX `UserMeetMap_mappedUserId_key`(`mappedUserId`),
    UNIQUE INDEX `UserMeetMap_mappedMeetId_key`(`mappedMeetId`),
    PRIMARY KEY (`UserMeetMap`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `messageId` INTEGER NOT NULL AUTO_INCREMENT,
    `sentTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `message_body` VARCHAR(191) NOT NULL,
    `mappedUserId` INTEGER NOT NULL,
    `mappedMeetId` INTEGER NOT NULL,

    UNIQUE INDEX `Message_messageId_key`(`messageId`),
    UNIQUE INDEX `Message_mappedUserId_key`(`mappedUserId`),
    UNIQUE INDEX `Message_mappedMeetId_key`(`mappedMeetId`),
    PRIMARY KEY (`messageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserMeetMap` ADD CONSTRAINT `UserMeetMap_mappedUserId_fkey` FOREIGN KEY (`mappedUserId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMeetMap` ADD CONSTRAINT `UserMeetMap_mappedMeetId_fkey` FOREIGN KEY (`mappedMeetId`) REFERENCES `MeetData`(`meetId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_mappedUserId_fkey` FOREIGN KEY (`mappedUserId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_mappedMeetId_fkey` FOREIGN KEY (`mappedMeetId`) REFERENCES `MeetData`(`meetId`) ON DELETE RESTRICT ON UPDATE CASCADE;
