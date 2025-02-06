-- AddForeignKey
ALTER TABLE `images` ADD CONSTRAINT `images_user_fkey` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
