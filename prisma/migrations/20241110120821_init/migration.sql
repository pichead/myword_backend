-- CreateTable
CREATE TABLE `admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(60) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `meaning` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `meaning` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tag_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `word_tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `wordId` INTEGER NOT NULL,
    `tagId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `word_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `wordId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `word` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imageSrc` VARCHAR(191) NULL,
    `word` VARCHAR(191) NOT NULL,
    `difficulty` INTEGER NOT NULL DEFAULT 1,
    `part_of_speechId` INTEGER NOT NULL,
    `meaning` VARCHAR(255) NOT NULL,
    `usageFrequency` INTEGER NOT NULL DEFAULT 0,
    `pronunciationEn` VARCHAR(191) NOT NULL,
    `pronunciationTh` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `word_word_key`(`word`),
    INDEX `word_word_idx`(`word`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `word_meaning` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `wordId` INTEGER NOT NULL,
    `pronunciationEn` VARCHAR(191) NOT NULL,
    `pronunciationTh` VARCHAR(191) NOT NULL,
    `part_of_speechId` INTEGER NOT NULL,
    `meaning` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `word_sentence` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `word_meaningId` INTEGER NOT NULL,
    `sentence` TEXT NOT NULL,
    `translation` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fname` VARCHAR(255) NULL,
    `lname` VARCHAR(255) NULL,
    `userName` VARCHAR(191) NULL,
    `email` VARCHAR(60) NOT NULL,
    `isVerifiedEmail` TIMESTAMP(0) NULL,
    `password` VARCHAR(255) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `plan` ENUM('Free', 'Supporter', 'Superman') NOT NULL DEFAULT 'Free',

    UNIQUE INDEX `users_userName_key`(`userName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_word` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usersId` INTEGER NOT NULL,
    `wordId` INTEGER NOT NULL,
    `point` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `correctCount` INTEGER NOT NULL DEFAULT 0,
    `inCorrectCount` INTEGER NOT NULL DEFAULT 0,

    INDEX `user_word_usersId_idx`(`usersId`),
    INDEX `user_word_wordId_idx`(`wordId`),
    INDEX `user_word_point_idx`(`point`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_progress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usersId` INTEGER NOT NULL,
    `totalWordsStudied` INTEGER NOT NULL DEFAULT 0,
    `totalCorrect` INTEGER NOT NULL DEFAULT 0,
    `totalIncorrect` INTEGER NOT NULL DEFAULT 0,
    `totalPoints` INTEGER NOT NULL DEFAULT 0,
    `lastActivity` DATETIME(3) NULL,

    INDEX `user_progress_usersId_idx`(`usersId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_of_speech` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `meaning` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `part_of_speech_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usersId` INTEGER NOT NULL,
    `action` VARCHAR(255) NOT NULL,
    `detail` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `word_tag` ADD CONSTRAINT `word_tag_wordId_fkey` FOREIGN KEY (`wordId`) REFERENCES `word`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `word_tag` ADD CONSTRAINT `word_tag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `word_category` ADD CONSTRAINT `word_category_wordId_fkey` FOREIGN KEY (`wordId`) REFERENCES `word`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `word_category` ADD CONSTRAINT `word_category_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `word` ADD CONSTRAINT `word_part_of_speechId_fkey` FOREIGN KEY (`part_of_speechId`) REFERENCES `part_of_speech`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `word_meaning` ADD CONSTRAINT `word_meaning_wordId_fkey` FOREIGN KEY (`wordId`) REFERENCES `word`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `word_meaning` ADD CONSTRAINT `word_meaning_part_of_speechId_fkey` FOREIGN KEY (`part_of_speechId`) REFERENCES `part_of_speech`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `word_sentence` ADD CONSTRAINT `word_sentence_word_meaningId_fkey` FOREIGN KEY (`word_meaningId`) REFERENCES `word_meaning`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_word` ADD CONSTRAINT `user_word_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_word` ADD CONSTRAINT `user_word_wordId_fkey` FOREIGN KEY (`wordId`) REFERENCES `word`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_progress` ADD CONSTRAINT `user_progress_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_log` ADD CONSTRAINT `audit_log_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
