-- Create the keyspace for the `solidarianid` application
CREATE KEYSPACE IF NOT EXISTS solidarianid
WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};

-- Change to the keyspace
USE solidarianid;

CREATE TABLE IF NOT EXISTS ods_statistics (
  ods_id INT,
  communities_count INT,
  causes_count INT,
  supports_count INT,
  PRIMARY KEY (ods_id)
)
WITH comment = 'Q1 and Q2 statistics for each ODS';

CREATE TABLE IF NOT EXISTS community_statistics (
  community_id TEXT,
  community_name TEXT,
  support_count INT,
  actions_target_total DOUBLE,
  actions_achieved_total DOUBLE,
  PRIMARY KEY (community_id)
)
WITH comment = 'Q3 and Q4 statistics for each community';

-- Insert test data into `ods_statistics` table
INSERT INTO ods_statistics (ods_id, communities_count, causes_count, supports_count) VALUES (1, 12, 25, 50);
INSERT INTO ods_statistics (ods_id, communities_count, causes_count, supports_count) VALUES (2, 8, 18, 40);
INSERT INTO ods_statistics (ods_id, communities_count, causes_count, supports_count) VALUES (3, 15, 30, 60);
INSERT INTO ods_statistics (ods_id, communities_count, causes_count, supports_count) VALUES (4, 20, 45, 70);
INSERT INTO ods_statistics (ods_id, communities_count, causes_count, supports_count) VALUES (5, 10, 22, 35);
INSERT INTO ods_statistics (ods_id, communities_count, causes_count, supports_count) VALUES (6, 5, 10, 25);
INSERT INTO ods_statistics (ods_id, communities_count, causes_count, supports_count) VALUES (7, 7, 12, 30);
INSERT INTO ods_statistics (ods_id, communities_count, causes_count, supports_count) VALUES (8, 18, 40, 80);
INSERT INTO ods_statistics (ods_id, communities_count, causes_count, supports_count) VALUES (10, 11, 27, 45);
INSERT INTO ods_statistics (ods_id, communities_count, causes_count, supports_count) VALUES (11, 9, 20, 38);
INSERT INTO ods_statistics (ods_id, communities_count, causes_count, supports_count) VALUES (12, 6, 15, 22);
INSERT INTO ods_statistics (ods_id, communities_count, causes_count, supports_count) VALUES (13, 4, 8, 12);
INSERT INTO ods_statistics (ods_id, communities_count, causes_count, supports_count) VALUES (14, 3, 6, 9);
INSERT INTO ods_statistics (ods_id, communities_count, causes_count, supports_count) VALUES (15, 2, 4, 6);
INSERT INTO ods_statistics (ods_id, communities_count, causes_count, supports_count) VALUES (16, 1, 2, 3);
INSERT INTO ods_statistics (ods_id, communities_count, causes_count, supports_count) VALUES (17, 14, 35, 60);

-- Insert test data into `community_statistics` table
INSERT INTO community_statistics (community_id, community_name, support_count, actions_target_total, actions_achieved_total)
VALUES ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Comunidad Esperanza', 300, 600.0, 450.0);
INSERT INTO community_statistics (community_id, community_name, support_count, actions_target_total, actions_achieved_total)
VALUES ('1d4f8c9a-2e6b-42c4-85d7-5e4f3d2a3d29', 'Comunidad Futuro', 200, 400.0, 300.0);
INSERT INTO community_statistics (community_id, community_name, support_count, actions_target_total, actions_achieved_total)
VALUES ('7a97a3c1-d54d-4fa1-b65f-3d8e5a2b459b', 'Comunidad Solidaridad', 150, 350.0, 280.0);
INSERT INTO community_statistics (community_id, community_name, support_count, actions_target_total, actions_achieved_total)
VALUES ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Comunidad Inclusiva', 500, 1000.0, 850.0);
INSERT INTO community_statistics (community_id, community_name, support_count, actions_target_total, actions_achieved_total)
VALUES ('67e55044-10b1-426f-9247-bb680e5fe0c8', 'Comunidad Horizonte', 120, 300.0, 180.0);
INSERT INTO community_statistics (community_id, community_name, support_count, actions_target_total, actions_achieved_total)
VALUES ('d15a3f8b-6c45-44d7-81e6-bb1234580851', 'Comunidad Unión', 350, 700.0, 450.0);
INSERT INTO community_statistics (community_id, community_name, support_count, actions_target_total, actions_achieved_total)
VALUES ('9fa19f4b-e123-4ad4-a679-e0f82b4e0156', 'Comunidad Renacer', 250, 500.0, 370.0);
INSERT INTO community_statistics (community_id, community_name, support_count, actions_target_total, actions_achieved_total)
VALUES ('a7f6d3c1-1abc-4fae-bc1d-c7d5e3a6a9b8', 'Comunidad Luz', 400, 800.0, 720.0);
INSERT INTO community_statistics (community_id, community_name, support_count, actions_target_total, actions_achieved_total)
VALUES ('d751f27c-e889-4b22-a01b-a89025f44c8f', 'Comunidad Alianza', 300, 1000.0, 950.0);
INSERT INTO community_statistics (community_id, community_name, support_count, actions_target_total, actions_achieved_total)
VALUES ('c56a4180-65aa-42ec-a945-5fd21dec0538', 'Comunidad Resiliencia', 180, 600.0, 540.0);
