-- Create the keyspace for the `solidarianid` application
CREATE KEYSPACE IF NOT EXISTS solidarianid
WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};

-- Change to the keyspace
USE solidarianid;

CREATE TABLE ods (
  ods_id INT,
  communities_count INT,
  causes_count INT,
  supports_count INT,
  PRIMARY KEY (ods_id)
);

-- Insert test data into `ods` table
INSERT INTO ods (ods_id, communities_count, causes_count, supports_count) VALUES (1, 12, 25, 50);
INSERT INTO ods (ods_id, communities_count, causes_count, supports_count) VALUES (2, 8, 18, 40);
INSERT INTO ods (ods_id, communities_count, causes_count, supports_count) VALUES (3, 15, 30, 60);
INSERT INTO ods (ods_id, communities_count, causes_count, supports_count) VALUES (4, 20, 45, 70);
INSERT INTO ods (ods_id, communities_count, causes_count, supports_count) VALUES (5, 10, 22, 35);
INSERT INTO ods (ods_id, communities_count, causes_count, supports_count) VALUES (6, 5, 10, 25);
INSERT INTO ods (ods_id, communities_count, causes_count, supports_count) VALUES (7, 7, 12, 30);
INSERT INTO ods (ods_id, communities_count, causes_count, supports_count) VALUES (8, 18, 40, 80);
INSERT INTO ods (ods_id, communities_count, causes_count, supports_count) VALUES (10, 11, 27, 45);
INSERT INTO ods (ods_id, communities_count, causes_count, supports_count) VALUES (11, 9, 20, 38);
INSERT INTO ods (ods_id, communities_count, causes_count, supports_count) VALUES (12, 6, 15, 22);
INSERT INTO ods (ods_id, communities_count, causes_count, supports_count) VALUES (13, 4, 8, 12);
INSERT INTO ods (ods_id, communities_count, causes_count, supports_count) VALUES (14, 3, 6, 9);
INSERT INTO ods (ods_id, communities_count, causes_count, supports_count) VALUES (15, 2, 4, 6);
INSERT INTO ods (ods_id, communities_count, causes_count, supports_count) VALUES (16, 1, 2, 3);
INSERT INTO ods (ods_id, communities_count, causes_count, supports_count) VALUES (17, 14, 35, 60);
