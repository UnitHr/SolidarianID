-- Create the keyspace for the `solidarianid` application
CREATE KEYSPACE IF NOT EXISTS solidarianid
WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};

-- Change to the keyspace
USE solidarianid;

-- Create the table `communities_causes_by_ods`
CREATE TABLE communities_causes_by_ods (
  ods_id INT,
  communities_count INT,
  causes_count INT,
  PRIMARY KEY (ods_id)
);

-- Add test data to the table `communities_causes_by_ods`
INSERT INTO communities_causes_by_ods (ods_id, communities_count, causes_count) VALUES (1, 12, 25);
INSERT INTO communities_causes_by_ods (ods_id, communities_count, causes_count) VALUES (2, 8, 18);
INSERT INTO communities_causes_by_ods (ods_id, communities_count, causes_count) VALUES (3, 15, 30);
INSERT INTO communities_causes_by_ods (ods_id, communities_count, causes_count) VALUES (4, 20, 45);
INSERT INTO communities_causes_by_ods (ods_id, communities_count, causes_count) VALUES (5, 10, 22);
INSERT INTO communities_causes_by_ods (ods_id, communities_count, causes_count) VALUES (6, 5, 10);
INSERT INTO communities_causes_by_ods (ods_id, communities_count, causes_count) VALUES (7, 7, 12);
INSERT INTO communities_causes_by_ods (ods_id, communities_count, causes_count) VALUES (8, 18, 40);
INSERT INTO communities_causes_by_ods (ods_id, communities_count, causes_count) VALUES (10, 11, 27);
INSERT INTO communities_causes_by_ods (ods_id, communities_count, causes_count) VALUES (11, 9, 20);
INSERT INTO communities_causes_by_ods (ods_id, communities_count, causes_count) VALUES (12, 6, 15);
INSERT INTO communities_causes_by_ods (ods_id, communities_count, causes_count) VALUES (13, 4, 8);
INSERT INTO communities_causes_by_ods (ods_id, communities_count, causes_count) VALUES (14, 3, 6);
INSERT INTO communities_causes_by_ods (ods_id, communities_count, causes_count) VALUES (15, 2, 4);
INSERT INTO communities_causes_by_ods (ods_id, communities_count, causes_count) VALUES (16, 1, 2);
INSERT INTO communities_causes_by_ods (ods_id, communities_count, causes_count) VALUES (17, 14, 35);
