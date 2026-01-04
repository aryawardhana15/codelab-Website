-- rsi_elearning_db.badges definition

CREATE TABLE `badges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon_url` varchar(255) DEFAULT NULL,
  `requirement` text DEFAULT NULL COMMENT 'Deskripsi requirement untuk mendapatkan badge',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.levels definition

CREATE TABLE `levels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level_number` int(11) NOT NULL,
  `level_name` varchar(100) NOT NULL,
  `xp_required` int(11) NOT NULL COMMENT 'Total XP yang dibutuhkan untuk mencapai level ini',
  `badge_reward` varchar(255) DEFAULT NULL COMMENT 'Badge yang didapat saat mencapai level ini',
  PRIMARY KEY (`id`),
  UNIQUE KEY `level_number` (`level_number`),
  KEY `idx_level_number` (`level_number`),
  KEY `idx_xp` (`xp_required`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.users definition

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('pelajar','mentor','admin') NOT NULL,
  `education_level` enum('SD','SMP','SMA','Kuliah') DEFAULT NULL COMMENT 'Jenjang pendidikan untuk Pelajar',
  `interests` text DEFAULT NULL COMMENT 'Peminatan/minat pelajar (comma separated)',
  `bio` text DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `cv_url` varchar(255) DEFAULT NULL COMMENT 'Link CV untuk Mentor',
  `expertise` text DEFAULT NULL COMMENT 'Keahlian Mentor (comma separated)',
  `experience` text DEFAULT NULL COMMENT 'Pengalaman kerja Mentor',
  `is_verified` tinyint(1) DEFAULT 0 COMMENT 'Status verifikasi (auto true untuk Pelajar, perlu approval untuk Mentor)',
  `is_suspended` tinyint(1) DEFAULT 0 COMMENT 'Status suspend oleh Admin',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_is_verified` (`is_verified`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.admin_logs definition

CREATE TABLE `admin_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL COMMENT 'verify_mentor, reject_mentor, suspend_user, delete_forum, etc',
  `target_type` varchar(50) DEFAULT NULL COMMENT 'user, course, forum, reply',
  `target_id` int(11) DEFAULT NULL COMMENT 'ID target yang di-action',
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_admin` (`admin_id`),
  KEY `idx_action` (`action`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `admin_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.chatbot_conversations definition

CREATE TABLE `chatbot_conversations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT 'ID Pelajar',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `chatbot_conversations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.chatbot_messages definition

CREATE TABLE `chatbot_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conversation_id` int(11) NOT NULL,
  `role` enum('user','assistant') NOT NULL COMMENT 'user = pertanyaan pelajar, assistant = jawaban AI',
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_conversation` (`conversation_id`),
  CONSTRAINT `chatbot_messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `chatbot_conversations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.courses definition

CREATE TABLE `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mentor_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL COMMENT 'Mata pelajaran: Matematika, Fisika, Bahasa Inggris, dll',
  `difficulty` enum('beginner','intermediate','advanced') DEFAULT 'beginner',
  `education_level` enum('SD','SMP','SMA','Kuliah') DEFAULT NULL COMMENT 'Target jenjang pendidikan',
  `price` decimal(10,2) DEFAULT 0.00 COMMENT 'Harga kursus (0 = gratis)',
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 0 COMMENT 'Status: draft atau published',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_mentor` (`mentor_id`),
  KEY `idx_category` (`category`),
  KEY `idx_difficulty` (`difficulty`),
  KEY `idx_education_level` (`education_level`),
  KEY `idx_is_published` (`is_published`),
  KEY `idx_updated_at` (`updated_at`),
  FULLTEXT KEY `ft_title_description` (`title`,`description`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`mentor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.enrollments definition

CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT 'ID Pelajar',
  `course_id` int(11) NOT NULL,
  `enrolled_at` timestamp NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL,
  `progress` int(11) DEFAULT 0 COMMENT 'Progress dalam persen (0-100)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_enrollment` (`user_id`,`course_id`),
  KEY `course_id` (`course_id`),
  KEY `idx_user_course` (`user_id`,`course_id`),
  KEY `idx_enrolled_at` (`enrolled_at`),
  KEY `idx_completed` (`completed_at`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.forums definition

CREATE TABLE `forums` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'Pembuat thread',
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `tags` varchar(255) DEFAULT NULL COMMENT 'Tags (comma separated)',
  `is_pinned` tinyint(1) DEFAULT 0 COMMENT 'Di-pin oleh Mentor/Admin',
  `is_locked` tinyint(1) DEFAULT 0 COMMENT 'Di-lock oleh Mentor/Admin (tidak bisa reply)',
  `likes_count` int(11) DEFAULT 0,
  `replies_count` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_pinned` (`is_pinned`),
  FULLTEXT KEY `ft_title_content` (`title`,`content`),
  CONSTRAINT `forums_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `forums_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.materials definition

CREATE TABLE `materials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `content` longtext DEFAULT NULL COMMENT 'Konten text materi',
  `video_url` varchar(255) DEFAULT NULL COMMENT 'URL video (YouTube/Vimeo embed)',
  `file_url` varchar(255) DEFAULT NULL COMMENT 'URL file attachment (PDF, PPT, DOC)',
  `order_index` int(11) NOT NULL DEFAULT 0 COMMENT 'Urutan materi dalam kursus',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_order` (`course_id`,`order_index`),
  CONSTRAINT `materials_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.missions definition

CREATE TABLE `missions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('daily','weekly','achievement') NOT NULL,
  `requirement_type` varchar(100) NOT NULL COMMENT 'login, complete_material, forum_post, submit_assignment, perfect_quiz, complete_course',
  `requirement_count` int(11) NOT NULL COMMENT 'Jumlah yang harus dicapai',
  `xp_reward` int(11) NOT NULL,
  `badge_reward` int(11) DEFAULT NULL COMMENT 'Badge yang didapat saat menyelesaikan misi',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `badge_reward` (`badge_reward`),
  KEY `idx_type` (`type`),
  KEY `idx_active` (`is_active`),
  CONSTRAINT `missions_ibfk_1` FOREIGN KEY (`badge_reward`) REFERENCES `badges` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.notifications definition

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL COMMENT 'level_up, badge_earned, mission_completed, chat_message, assignment_graded, mentor_approved, etc',
  `title` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Data tambahan dalam format JSON' CHECK (json_valid(`data`)),
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_type` (`type`),
  KEY `idx_created` (`created_at`),
  KEY `idx_notification_read` (`is_read`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.user_badges definition

CREATE TABLE `user_badges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `badge_id` int(11) NOT NULL,
  `earned_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_badge` (`user_id`,`badge_id`),
  KEY `badge_id` (`badge_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `user_badges_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_badges_ibfk_2` FOREIGN KEY (`badge_id`) REFERENCES `badges` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.user_gamification definition

CREATE TABLE `user_gamification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `total_xp` int(11) DEFAULT 0,
  `current_level` int(11) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `idx_total_xp` (`total_xp`),
  KEY `idx_level` (`current_level`),
  CONSTRAINT `user_gamification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_gamification_ibfk_2` FOREIGN KEY (`current_level`) REFERENCES `levels` (`level_number`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.user_missions definition

CREATE TABLE `user_missions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `mission_id` int(11) NOT NULL,
  `progress` int(11) DEFAULT 0 COMMENT 'Progress saat ini',
  `is_completed` tinyint(1) DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT NULL,
  `reset_at` timestamp NULL DEFAULT NULL COMMENT 'Waktu reset untuk daily/weekly missions',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_mission` (`user_id`,`mission_id`),
  KEY `mission_id` (`mission_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_completed` (`is_completed`),
  CONSTRAINT `user_missions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_missions_ibfk_2` FOREIGN KEY (`mission_id`) REFERENCES `missions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.xp_history definition

CREATE TABLE `xp_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `xp_amount` int(11) NOT NULL,
  `reason` varchar(255) NOT NULL COMMENT 'Alasan dapat XP: complete_material, forum_post, etc',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `xp_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.assignments definition

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('tugas','kuis') NOT NULL,
  `deadline` timestamp NULL DEFAULT NULL,
  `max_score` int(11) DEFAULT 100,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_type` (`type`),
  KEY `idx_assignment_deadline` (`deadline`),
  CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.chats definition

CREATE TABLE `chats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pelajar_id` int(11) NOT NULL,
  `mentor_id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `last_message_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_chat_with_course` (`pelajar_id`,`mentor_id`,`course_id`),
  KEY `idx_pelajar` (`pelajar_id`),
  KEY `idx_mentor` (`mentor_id`),
  KEY `idx_course_id` (`course_id`),
  CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`pelajar_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chats_ibfk_2` FOREIGN KEY (`mentor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chats_ibfk_3` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.forum_replies definition

CREATE TABLE `forum_replies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `forum_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `likes_count` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_forum` (`forum_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `forum_replies_ibfk_1` FOREIGN KEY (`forum_id`) REFERENCES `forums` (`id`) ON DELETE CASCADE,
  CONSTRAINT `forum_replies_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.forum_reports definition

CREATE TABLE `forum_reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reporter_id` int(11) NOT NULL COMMENT 'User yang melaporkan',
  `forum_id` int(11) DEFAULT NULL COMMENT 'Thread yang dilaporkan',
  `reply_id` int(11) DEFAULT NULL COMMENT 'Reply yang dilaporkan',
  `reason` text NOT NULL,
  `status` enum('pending','resolved','dismissed') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `resolved_at` timestamp NULL DEFAULT NULL,
  `resolved_by` int(11) DEFAULT NULL COMMENT 'ID Admin yang resolve',
  PRIMARY KEY (`id`),
  KEY `reporter_id` (`reporter_id`),
  KEY `forum_id` (`forum_id`),
  KEY `reply_id` (`reply_id`),
  KEY `resolved_by` (`resolved_by`),
  KEY `idx_status` (`status`),
  CONSTRAINT `forum_reports_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `forum_reports_ibfk_2` FOREIGN KEY (`forum_id`) REFERENCES `forums` (`id`) ON DELETE CASCADE,
  CONSTRAINT `forum_reports_ibfk_3` FOREIGN KEY (`reply_id`) REFERENCES `forum_replies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `forum_reports_ibfk_4` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `CONSTRAINT_1` CHECK (`forum_id` is not null and `reply_id` is null or `forum_id` is null and `reply_id` is not null)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.material_progress definition

CREATE TABLE `material_progress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  `is_completed` tinyint(1) DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_progress` (`user_id`,`material_id`),
  KEY `material_id` (`material_id`),
  KEY `idx_user_material` (`user_id`,`material_id`),
  KEY `idx_material_completed` (`is_completed`),
  CONSTRAINT `material_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `material_progress_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.messages definition

CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chat_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `file_url` varchar(255) DEFAULT NULL COMMENT 'File attachment (opsional)',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_chat` (`chat_id`),
  KEY `idx_sender` (`sender_id`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_message_read` (`is_read`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.quiz_questions definition

CREATE TABLE `quiz_questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `assignment_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `option_a` varchar(500) NOT NULL,
  `option_b` varchar(500) NOT NULL,
  `option_c` varchar(500) NOT NULL,
  `option_d` varchar(500) NOT NULL,
  `correct_answer` enum('a','b','c','d') NOT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_assignment` (`assignment_id`),
  CONSTRAINT `quiz_questions_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.submissions definition

CREATE TABLE `submissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `assignment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'ID Pelajar',
  `answer_text` text DEFAULT NULL COMMENT 'Jawaban text untuk tugas essay',
  `file_url` varchar(255) DEFAULT NULL COMMENT 'File submission untuk tugas',
  `submitted_at` timestamp NULL DEFAULT current_timestamp(),
  `score` int(11) DEFAULT NULL COMMENT 'Nilai dari Mentor',
  `feedback` text DEFAULT NULL COMMENT 'Feedback dari Mentor',
  `graded_at` timestamp NULL DEFAULT NULL,
  `graded_by` int(11) DEFAULT NULL COMMENT 'ID Mentor yang memberi nilai',
  PRIMARY KEY (`id`),
  KEY `idx_assignment` (`assignment_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_graded` (`graded_by`),
  KEY `idx_submission_date` (`submitted_at`),
  CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `submissions_ibfk_3` FOREIGN KEY (`graded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.forum_likes definition

CREATE TABLE `forum_likes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `forum_id` int(11) DEFAULT NULL COMMENT 'ID thread yang di-like',
  `reply_id` int(11) DEFAULT NULL COMMENT 'ID reply yang di-like',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_forum_like` (`user_id`,`forum_id`),
  UNIQUE KEY `unique_reply_like` (`user_id`,`reply_id`),
  KEY `forum_id` (`forum_id`),
  KEY `reply_id` (`reply_id`),
  CONSTRAINT `forum_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `forum_likes_ibfk_2` FOREIGN KEY (`forum_id`) REFERENCES `forums` (`id`) ON DELETE CASCADE,
  CONSTRAINT `forum_likes_ibfk_3` FOREIGN KEY (`reply_id`) REFERENCES `forum_replies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `CONSTRAINT_1` CHECK (`forum_id` is not null and `reply_id` is null or `forum_id` is null and `reply_id` is not null)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- rsi_elearning_db.quiz_answers definition

CREATE TABLE `quiz_answers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `submission_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `selected_answer` enum('a','b','c','d') NOT NULL,
  `is_correct` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`),
  KEY `idx_submission` (`submission_id`),
  CONSTRAINT `quiz_answers_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quiz_answers_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default levels
INSERT INTO levels (level_number, level_name, xp_required, badge_reward) VALUES
(1, 'Pemula', 0, NULL),
(2, 'Pelajar Aktif', 100, NULL),
(3, 'Pelajar Berdedikasi', 250, NULL),
(4, 'Pelajar Berbakat', 500, NULL),
(5, 'Pelajar Ahli', 1000, NULL),
(6, 'Master Pelajar', 2000, NULL),
(7, 'Guru Muda', 3500, NULL),
(8, 'Guru Senior', 5500, NULL),
(9, 'Profesor', 8000, NULL),
(10, 'Legenda', 12000, NULL);

-- Insert default badges
INSERT INTO badges (name, description, icon_url, requirement) VALUES
('First Steps', 'Selesaikan materi pertama', NULL, 'Complete first material'),
('Quiz Master', 'Raih nilai 100 pada kuis', NULL, 'Score 100 on any quiz'),
('Discussion Hero', 'Post 10 kali di forum', NULL, 'Create 10 forum posts'),
('Course Completer', 'Selesaikan 1 kursus lengkap', NULL, 'Complete 1 full course'),
('Speed Learner', 'Selesaikan 5 materi dalam 1 hari', NULL, 'Complete 5 materials in one day'),
('Week Warrior', 'Login 7 hari berturut-turut', NULL, 'Login streak 7 days'),
('Social Butterfly', 'Dapat 50 likes di forum', NULL, 'Receive 50 likes on forum posts'),
('Helping Hand', 'Reply 20 kali di forum', NULL, 'Reply 20 times in forums'),
('Top Scorer', 'Raih rata-rata 90+ di 5 tugas', NULL, 'Average 90+ score on 5 assignments'),
('Dedicated Learner', 'Ikuti 5 kursus', NULL, 'Enroll in 5 courses');

-- Insert default missions
INSERT INTO missions (title, description, type, requirement_type, requirement_count, xp_reward, badge_reward) VALUES
('Daily Login', 'Login hari ini', 'daily', 'login', 1, 5, NULL),
('Complete 3 Materials', 'Selesaikan 3 materi hari ini', 'daily', 'complete_material', 3, 20, NULL),
('Forum Participant', 'Post 2 kali di forum hari ini', 'daily', 'forum_post', 2, 10, NULL),
('Weekly Learner', 'Selesaikan 10 materi minggu ini', 'weekly', 'complete_material', 10, 50, NULL),
('Weekly Socializer', 'Post 5 kali di forum minggu ini', 'weekly', 'forum_post', 5, 30, NULL),
('Submit Assignment', 'Submit 2 tugas minggu ini', 'weekly', 'submit_assignment', 2, 40, NULL),
('First Course', 'Selesaikan kursus pertama', 'achievement', 'complete_course', 1, 100, 4),
('Master Student', 'Selesaikan 5 kursus', 'achievement', 'complete_course', 5, 500, 10),
('Discussion Master', 'Buat 50 post di forum', 'achievement', 'forum_post', 50, 200, 3),
('Perfect Score', 'Raih nilai 100 pada kuis', 'achievement', 'perfect_quiz', 1, 50, 2);

-- Insert default admin user (password: admin123)
-- Note: You need to generate bcrypt hash for 'admin123' password
-- You can use: https://bcrypt-generator.com/ or generate it programmatically
-- Example hash: $2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq
-- We use a dummy hash here as placeholder, seed script will fix it or use the one below
INSERT INTO users (name, email, password, role, is_verified) VALUES
('Admin', 'admin@codelab.com', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'admin', TRUE);
