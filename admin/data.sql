-- -------------------------------------------------------------------------------
-- Equipes ----------------------------------------------------------------------
-- -------------------------------------------------------------------------------
INSERT INTO `mainapp_team`(`id`, `name`, `code`, `nickname`)
VALUES
(1, 'France', 'FRA', 'Les Bleus'),
(2, 'États-Unis', 'USA', 'Team USA'),
(3, 'Guinée', 'GUI', 'Syli National'),
(4, 'Nouvelle-Zélande', 'NZL', 'All Whites'),
(5, 'Argentine', 'ARG', 'La Albiceleste'),
(6, 'Maroc', 'MAR', 'Les Lions de l Atlas'),
(7, 'Irak', 'IRQ', 'Lions de Mésopotamie'),
(8, 'Ukraine', 'UKR', 'Les Jaunes et Bleus'),
(9, 'Ouzbékistan', 'UZB', 'Les Loups Blancs'),
(10, 'Espagne', 'ESP', 'La Roja'),
(11, 'Égypte', 'EGY', 'Les Pharaons'),
(12, 'République Dominicaine', 'DOM', 'Los Quisqueyanos'),
(13, 'Japon', 'JPN', 'Samurai Blue'),
(14, 'Paraguay', 'PAR', 'Los Guaraníes'),
(15, 'Mali', 'MLI', 'Les Aigles'),
(16, 'Israël', 'ISR', 'The Blues and Whites');

-- -------------------------------------------------------------------------------
-- Stades -----------------------------------------------------------------------
-- -------------------------------------------------------------------------------
INSERT INTO `mainapp_stadium`(`id`, `name`, `location`) 
VALUES
(1, 'Stade de France', 'Saint-Denis'),
(2, 'Parc des Princes', 'Paris'),
(3, 'Groupama Stadium', 'Lyon'),
(4, 'Stade Vélodrome', 'Marseille'),
(5, 'Stade Pierre-Mauroy', 'Lille'),
(6, 'Allianz Riviera', 'Nice'),
(7, 'Matmut Atlantique', 'Bordeaux');


INSERT INTO `mainapp_event`(`id`, `start`, `stadium_id`, `team_away_id`, `team_home_id`) VALUES 
-- Phase de groupes
(1, '2024-07-24 18:00:00', 1, 1, 2), -- France vs États-Unis au Stade de France
(2, '2024-07-24 21:00:00', 2, 3, 4), -- Guinée vs Nouvelle-Zélande au Parc des Princes
(3, '2024-07-25 18:00:00', 3, 5, 6), -- Argentine vs Maroc au Groupama Stadium
(4, '2024-07-25 21:00:00', 4, 7, 8), -- Irak vs Ukraine au Stade Vélodrome
(5, '2024-07-26 18:00:00', 5, 9, 10), -- Ouzbékistan vs Espagne au Stade Pierre-Mauroy
(6, '2024-07-26 21:00:00', 6, 11, 12), -- Égypte vs République Dominicaine à l'Allianz Riviera
(7, '2024-07-27 18:00:00', 7, 13, 14), -- Japon vs Paraguay au Matmut Atlantique
(8, '2024-07-27 21:00:00', 1, 15, 16), -- Mali vs Israël au Stade de France

-- Quarts de finale
(9, '2024-07-31 18:00:00', 2, NULL, NULL),
(10, '2024-07-31 21:00:00', 3, NULL, NULL),
(11, '2024-08-01 18:00:00', 4, NULL, NULL),
(12, '2024-08-01 21:00:00', 5, NULL, NULL),

-- Demi-finales
(13, '2024-08-04 18:00:00', 6, NULL, NULL),
(14, '2024-08-04 21:00:00', 7, NULL, NULL),

-- Finale
(15, '2024-08-07 20:00:00', 1, NULL, NULL);


-- UPDATE DES CODES
UPDATE `mainapp_team` SET code = 'ML' WHERE name = 'Mali';
UPDATE `mainapp_team` SET code = 'IL' WHERE name = 'Israël';
UPDATE `mainapp_team` SET code = 'PY' WHERE name = 'Paraguay';
UPDATE `mainapp_team` SET code = 'JP' WHERE name = 'Japon';
UPDATE `mainapp_team` SET code = 'DO' WHERE name = 'République Dominicaine';
UPDATE `mainapp_team` SET code = 'EG' WHERE name = 'Égypte';
UPDATE `mainapp_team` SET code = 'ES' WHERE name = 'Espagne';
UPDATE `mainapp_team` SET code = 'UZ' WHERE name = 'Ouzbékistan';
UPDATE `mainapp_team` SET code = 'UA' WHERE name = 'Ukraine';
UPDATE `mainapp_team` SET code = 'IQ' WHERE name = 'Irak';
UPDATE `mainapp_team` SET code = 'AR' WHERE name = 'Argentine';
UPDATE `mainapp_team` SET code = 'MA' WHERE name = 'Maroc';
UPDATE `mainapp_team` SET code = 'NZ' WHERE name = 'Nouvelle-Zélande';
UPDATE `mainapp_team` SET code = 'GN' WHERE name = 'Guinée';
UPDATE `mainapp_team` SET code = 'US' WHERE name = 'États-Unis';
UPDATE `mainapp_team` SET code = 'FR' WHERE name = 'France';