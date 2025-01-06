-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : dim. 05 jan. 2025 à 22:01
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

DROP DATABASE IF EXISTS `jo_project_start`;
CREATE DATABASE IF NOT EXISTS `jo_project_start` 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;

USE `jo_project_start`;

-- --------------------------------------------------------

--
-- Structure de la table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
CREATE TABLE IF NOT EXISTS `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
CREATE TABLE IF NOT EXISTS `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissions_group_id_b120cbf9` (`group_id`),
  KEY `auth_group_permissions_permission_id_84c5c92e` (`permission_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
CREATE TABLE IF NOT EXISTS `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  KEY `auth_permission_content_type_id_2f476e4b` (`content_type_id`)
) ENGINE=MyISAM AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add event', 1, 'add_event'),
(2, 'Can change event', 1, 'change_event'),
(3, 'Can delete event', 1, 'delete_event'),
(4, 'Can view event', 1, 'view_event'),
(5, 'Can add newsletter', 2, 'add_newsletter'),
(6, 'Can change newsletter', 2, 'change_newsletter'),
(7, 'Can delete newsletter', 2, 'delete_newsletter'),
(8, 'Can view newsletter', 2, 'view_newsletter'),
(9, 'Can add stadium', 3, 'add_stadium'),
(10, 'Can change stadium', 3, 'change_stadium'),
(11, 'Can delete stadium', 3, 'delete_stadium'),
(12, 'Can view stadium', 3, 'view_stadium'),
(13, 'Can add team', 4, 'add_team'),
(14, 'Can change team', 4, 'change_team'),
(15, 'Can delete team', 4, 'delete_team'),
(16, 'Can view team', 4, 'view_team'),
(17, 'Can add ticket', 5, 'add_ticket'),
(18, 'Can change ticket', 5, 'change_ticket'),
(19, 'Can delete ticket', 5, 'delete_ticket'),
(20, 'Can view ticket', 5, 'view_ticket'),
(21, 'Can add log entry', 6, 'add_logentry'),
(22, 'Can change log entry', 6, 'change_logentry'),
(23, 'Can delete log entry', 6, 'delete_logentry'),
(24, 'Can view log entry', 6, 'view_logentry'),
(25, 'Can add permission', 7, 'add_permission'),
(26, 'Can change permission', 7, 'change_permission'),
(27, 'Can delete permission', 7, 'delete_permission'),
(28, 'Can view permission', 7, 'view_permission'),
(29, 'Can add group', 8, 'add_group'),
(30, 'Can change group', 8, 'change_group'),
(31, 'Can delete group', 8, 'delete_group'),
(32, 'Can view group', 8, 'view_group'),
(33, 'Can add user', 9, 'add_user'),
(34, 'Can change user', 9, 'change_user'),
(35, 'Can delete user', 9, 'delete_user'),
(36, 'Can view user', 9, 'view_user'),
(37, 'Can add content type', 10, 'add_contenttype'),
(38, 'Can change content type', 10, 'change_contenttype'),
(39, 'Can delete content type', 10, 'delete_contenttype'),
(40, 'Can view content type', 10, 'view_contenttype'),
(41, 'Can add session', 11, 'add_session'),
(42, 'Can change session', 11, 'change_session'),
(43, 'Can delete session', 11, 'delete_session'),
(44, 'Can view session', 11, 'view_session');

-- --------------------------------------------------------

--
-- Structure de la table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
CREATE TABLE IF NOT EXISTS `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `auth_user`
--

INSERT INTO `auth_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`) VALUES
(1, 'pbkdf2_sha256$600000$PZgZ0BlJUPjyQvOu8xJezo$DOzLIXSiJNlbVCp9i0jbZrRf/cyCg5UdWKhmEoXjngo=', '2025-01-05 16:18:43.540516', 0, 'dylan', '', '', '', 0, 1, '2024-12-27 11:33:54.364402'),
(2, 'pbkdf2_sha256$600000$PxDxp03rLrlLNaCq90KPiL$TRXSAcuuTz0wqAY972owX/wcLhVh1t4wIFyZ/ESdGHs=', '2024-12-27 12:35:08.584157', 0, 'mumu', '', '', '', 0, 1, '2024-12-27 12:34:50.844078'),
(3, 'pbkdf2_sha256$600000$0kaxc6c0maABJZgaWPTP9S$q9vboBNk2TVbO6f0D320HdXsgJV5w2YKqcmECZ+Crq8=', '2025-01-05 16:20:02.836986', 1, 'prof', '', '', 'dylan.guichard.pro@gmail.com', 1, 1, '2025-01-05 11:05:44.066567');

-- --------------------------------------------------------

--
-- Structure de la table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
CREATE TABLE IF NOT EXISTS `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_user_id_6a12ed8b` (`user_id`),
  KEY `auth_user_groups_group_id_97559544` (`group_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
CREATE TABLE IF NOT EXISTS `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permissions_user_id_a95ead1b` (`user_id`),
  KEY `auth_user_user_permissions_permission_id_1fbb5f2c` (`permission_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
CREATE TABLE IF NOT EXISTS `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint UNSIGNED NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6` (`user_id`)
) ;

-- --------------------------------------------------------

--
-- Structure de la table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
CREATE TABLE IF NOT EXISTS `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'mainapp', 'event'),
(2, 'mainapp', 'newsletter'),
(3, 'mainapp', 'stadium'),
(4, 'mainapp', 'team'),
(5, 'mainapp', 'ticket'),
(6, 'admin', 'logentry'),
(7, 'auth', 'permission'),
(8, 'auth', 'group'),
(9, 'auth', 'user'),
(10, 'contenttypes', 'contenttype'),
(11, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Structure de la table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE IF NOT EXISTS `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2024-12-23 11:55:32.317067'),
(2, 'auth', '0001_initial', '2024-12-23 11:55:32.515694'),
(3, 'admin', '0001_initial', '2024-12-23 11:55:32.584636'),
(4, 'admin', '0002_logentry_remove_auto_add', '2024-12-23 11:55:32.589663'),
(5, 'admin', '0003_logentry_add_action_flag_choices', '2024-12-23 11:55:32.592672'),
(6, 'contenttypes', '0002_remove_content_type_name', '2024-12-23 11:55:32.622266'),
(7, 'auth', '0002_alter_permission_name_max_length', '2024-12-23 11:55:32.648784'),
(8, 'auth', '0003_alter_user_email_max_length', '2024-12-23 11:55:32.666075'),
(9, 'auth', '0004_alter_user_username_opts', '2024-12-23 11:55:32.670089'),
(10, 'auth', '0005_alter_user_last_login_null', '2024-12-23 11:55:32.684691'),
(11, 'auth', '0006_require_contenttypes_0002', '2024-12-23 11:55:32.685696'),
(12, 'auth', '0007_alter_validators_add_error_messages', '2024-12-23 11:55:32.688928'),
(13, 'auth', '0008_alter_user_username_max_length', '2024-12-23 11:55:32.703040'),
(14, 'auth', '0009_alter_user_last_name_max_length', '2024-12-23 11:55:32.717237'),
(15, 'auth', '0010_alter_group_name_max_length', '2024-12-23 11:55:32.731309'),
(16, 'auth', '0011_update_proxy_permissions', '2024-12-23 11:55:32.735708'),
(17, 'auth', '0012_alter_user_first_name_max_length', '2024-12-23 11:55:32.755926'),
(18, 'mainapp', '0001_initial', '2024-12-23 11:55:32.863426'),
(19, 'sessions', '0001_initial', '2024-12-23 11:55:32.879805'),
(20, 'mainapp', '0002_rename_color_first_team_color1_and_more', '2024-12-23 15:23:04.668175'),
(21, 'mainapp', '0003_remove_stadium_latitude_remove_stadium_longitude', '2024-12-23 15:30:59.442089'),
(22, 'mainapp', '0004_event_score_event_winner', '2024-12-23 15:43:34.678153'),
(23, 'mainapp', '0005_remove_ticket_currency', '2024-12-27 10:47:39.740641'),
(24, 'mainapp', '0006_ticket_user_id', '2025-01-04 13:57:42.680396'),
(25, 'mainapp', '0007_rename_user_id_ticket_user', '2025-01-04 13:59:03.341426'),
(26, 'mainapp', '0008_delete_newsletter_remove_team_color1_and_more', '2025-01-05 14:40:27.644123');

-- --------------------------------------------------------

--
-- Structure de la table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
CREATE TABLE IF NOT EXISTS `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('2vw1apnaflkw4g10rn73j6x8bam2vjov', '.eJxVjEEOwiAQRe_C2hCkZRCX7j0DGWYGqRpISrsy3l2bdKHb_977LxVxXUpcu8xxYnVWgzr8bgnpIXUDfMd6a5paXeYp6U3RO-362liel939OyjYy7dGawIRGRI_MogPicBl4yCnk0iiDAPiIMTWBUt0NJzA4BgQfAAWUO8PGOE5JQ:1tUTMA:lPRvKRwlgt231sPZAbkIvmXtIfw_aTmlBLo9lbI5hE4', '2025-01-19 16:20:02.837989');

-- --------------------------------------------------------

--
-- Structure de la table `mainapp_event`
--

DROP TABLE IF EXISTS `mainapp_event`;
CREATE TABLE IF NOT EXISTS `mainapp_event` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `start` datetime(6) NOT NULL,
  `stadium_id` bigint NOT NULL,
  `team_away_id` bigint DEFAULT NULL,
  `team_home_id` bigint DEFAULT NULL,
  `score` varchar(10) DEFAULT NULL,
  `winner_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mainapp_event_stadium_id_d1eea8c6` (`stadium_id`),
  KEY `mainapp_event_team_away_id_58df9724` (`team_away_id`),
  KEY `mainapp_event_team_home_id_a855bb28` (`team_home_id`),
  KEY `mainapp_event_winner_id_3bb46005` (`winner_id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `mainapp_event`
--

INSERT INTO `mainapp_event` (`id`, `start`, `stadium_id`, `team_away_id`, `team_home_id`, `score`, `winner_id`) VALUES
(6, '2024-07-26 21:00:00.000000', 6, 11, 12, NULL, NULL),
(5, '2024-07-26 18:00:00.000000', 5, 9, 10, NULL, NULL),
(4, '2024-07-25 21:00:00.000000', 4, 7, 8, NULL, NULL),
(3, '2024-07-25 18:00:00.000000', 3, 5, 6, NULL, NULL),
(2, '2024-07-24 21:00:00.000000', 2, 3, 4, NULL, NULL),
(1, '2024-07-24 18:00:00.000000', 3, 1, 2, NULL, NULL),
(7, '2024-07-27 18:00:00.000000', 7, 13, 14, NULL, NULL),
(8, '2024-07-27 21:00:00.000000', 1, 15, 16, NULL, NULL),
(9, '2024-07-31 18:00:00.000000', 2, NULL, NULL, NULL, NULL),
(10, '2024-07-31 21:00:00.000000', 3, NULL, NULL, NULL, NULL),
(11, '2024-08-01 18:00:00.000000', 4, NULL, NULL, NULL, NULL),
(12, '2024-08-01 21:00:00.000000', 5, NULL, NULL, NULL, NULL),
(13, '2024-08-04 18:00:00.000000', 6, NULL, NULL, NULL, NULL),
(14, '2024-08-04 21:00:00.000000', 7, NULL, NULL, NULL, NULL),
(15, '2024-08-07 20:00:00.000000', 1, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `mainapp_stadium`
--

DROP TABLE IF EXISTS `mainapp_stadium`;
CREATE TABLE IF NOT EXISTS `mainapp_stadium` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `mainapp_stadium`
--

INSERT INTO `mainapp_stadium` (`id`, `name`, `location`) VALUES
(4, 'Stade Vélodrome', 'Marseille'),
(3, 'Groupama Stadium', 'Lyon'),
(2, 'Parc des Princes', 'Paris'),
(1, 'Stade de France', 'Saint-Denis'),
(5, 'Stade Pierre-Mauroy', 'Lille'),
(6, 'Allianz Riviera', 'Nice'),
(7, 'Matmut Atlantique', 'Bordeaux');

-- --------------------------------------------------------

--
-- Structure de la table `mainapp_team`
--

DROP TABLE IF EXISTS `mainapp_team`;
CREATE TABLE IF NOT EXISTS `mainapp_team` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `nickname` varchar(100) NOT NULL,
  `code` varchar(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `mainapp_team`
--

INSERT INTO `mainapp_team` (`id`, `name`, `nickname`, `code`) VALUES
(15, 'Mali', 'Les Aigles', 'ML'),
(16, 'Israël', 'The Blues and Whites', 'IL'),
(14, 'Paraguay', 'Los Guaraníes', 'PY'),
(13, 'Japon', 'Samurai Blue', 'JP'),
(12, 'République Dominicaine', 'Los Quisqueyanos', 'DO'),
(11, 'Égypte', 'Les Pharaons', 'EG'),
(10, 'Espagne', 'La Roja', 'ES'),
(9, 'Ouzbékistan', 'Les Loups Blancs', 'UZ'),
(8, 'Ukraine', 'Les Jaunes et Bleus', 'UA'),
(7, 'Irak', 'Lions de Mésopotamie', 'IQ'),
(5, 'Argentine', 'La Albiceleste', 'AR'),
(6, 'Maroc', 'Les Lions de l\'Atlas', 'MA'),
(4, 'Nouvelle-Zélande', 'All Whites', 'NZ'),
(3, 'Guinée', 'Syli National', 'GN'),
(2, 'États-Unis', 'Team USA', 'US'),
(1, 'France', 'Les Bleus', 'FR');

-- --------------------------------------------------------

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
