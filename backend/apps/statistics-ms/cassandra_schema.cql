-- Create the keyspace for the `solidarianid` application
CREATE KEYSPACE IF NOT EXISTS solidarianid
WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};

-- Change to the keyspace
USE solidarianid;


--------------------------------------------------------------------------------
-- PLATFORM STATISTICS
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ods_statistics (
  ods_id INT,
  communities_count INT,
  causes_count INT,
  supports_count INT,
  PRIMARY KEY (ods_id)
)
WITH comment = 'Q1 and Q2 statistics for each ODS';

CREATE TABLE IF NOT EXISTS ods_community (
    ods_id int,
    community_id TEXT,
    PRIMARY KEY ((ods_id), community_id)
) 
WITH comment = 'To ensure the uniqueness of communities by ODS';

CREATE TABLE IF NOT EXISTS community_statistics (
  community_id TEXT,
  community_name TEXT,
  support_count INT,
  actions_target_total DOUBLE,
  actions_achieved_total DOUBLE,
  PRIMARY KEY (community_id)
)
WITH comment = 'Q3 and Q4 statistics for each community';


--------------------------------------------------------------------------------
-- COMMUNITY REPORTS
--------------------------------------------------------------------------------

-- 1) Communities table
-- Simple PRIMARY KEY (community_id), without clustering columns
CREATE TABLE IF NOT EXISTS communities_by_community_id (
  community_id TEXT,
  community_name TEXT,
  admin_id TEXT,
  members_count INT,
  ods SET<INT>,
  PRIMARY KEY (community_id)
)
WITH comment = 'Q1. Find communities by community_id';

-- 2) Causes table
-- Partitioned by community_id, clustered by cause_id
CREATE TABLE IF NOT EXISTS causes_by_community (
  community_id TEXT,
  cause_id TEXT,
  cause_name TEXT,
  supports_count INT,
  ods SET<INT>,
  PRIMARY KEY ((community_id), cause_id)
)
WITH comment = 'Q2. Find causes by community_id'
AND CLUSTERING ORDER BY (cause_id ASC);

-- 3) Actions table
-- Partitioned by cause_id, clustered by action_id
CREATE TABLE IF NOT EXISTS actions_by_cause (
  cause_id TEXT,
  action_id TEXT,
  action_name TEXT,
  target DOUBLE,
  achieved DOUBLE,
  PRIMARY KEY ((cause_id), action_id)
)
WITH comment = 'Q3. Find actions by cause_id'
AND CLUSTERING ORDER BY (action_id ASC);
