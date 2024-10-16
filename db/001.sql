CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    points INT(10) NOT NULL DEFAULT 0,
    is_voted TINYINT(1) NOT NULL DEFAULT 0,
    is_game_1 TINYINT(1) NOT NULL DEFAULT 0,
    is_game_2 TINYINT(1) NOT NULL DEFAULT 0,
    is_game_3 TINYINT(1) NOT NULL DEFAULT 0,
    is_game_4 TINYINT(1) NOT NULL DEFAULT 0
);


CREATE TABLE game_1 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT(10),
    target INT(10),
    quest TEXT,
    quest_id INT(10),
    UNIQUE(user_id)
);


DROP PROCEDURE IF EXISTS AddPoint;
CREATE DEFINER=`root`@`%` PROCEDURE `AddPoint`(
  IN userName VARCHAR(255),
  IN user VARCHAR(255),
  IN game_mode_column VARCHAR(255)
)
BEGIN
  IF EXISTS (SELECT 1 FROM users WHERE name = userName) THEN
    UPDATE users 
    SET points = points + 1 
    WHERE name = user;
  ELSE
    INSERT INTO users (name, points, is_voted) 
    VALUES (userName, 1, 0);
  END IF;

  SET @query = CONCAT('UPDATE users SET ', game_mode_column, ' = 1 WHERE name = ?');
  
  SET @user_name_var = userName;

  PREPARE stmt FROM @query;
  EXECUTE stmt USING @user_name_var;
  DEALLOCATE PREPARE stmt;
END;



DROP PROCEDURE IF EXISTS CheckIsVoted;
CREATE DEFINER=`root`@`%` PROCEDURE `CheckIsVoted`(IN userName VARCHAR(255))
BEGIN
  SELECT is_voted
  FROM users
  WHERE name = userName;
END

DROP PROCEDURE IF EXISTS CheckUser;
CREATE DEFINER=`root`@`%` PROCEDURE `CheckUser`(IN userName VARCHAR(255))
BEGIN
  DECLARE existingUser VARCHAR(255);

  SELECT name INTO existingUser
  FROM users
  WHERE name = userName;

  IF existingUser IS NOT NULL THEN
    SELECT existingUser AS name;
  ELSE
  SELECT 0;
  END IF;
END

DROP PROCEDURE GetAllUsers;
CREATE DEFINER=`root`@`%` PROCEDURE `GetAllUsers`()
BEGIN
  SELECT * FROM users;
END

DROP PROCEDURE InsertUser;
CREATE DEFINER=`root`@`%` PROCEDURE `InsertUser`(IN userName VARCHAR(255))
BEGIN
  INSERT INTO users (name) VALUES (userName);
END



DELIMITER $$
CREATE PROCEDURE fill_game_1()
BEGIN
    DECLARE total_users INT;
    DECLARE total_quests INT;
    DECLARE i INT;
    DECLARE u_id INT;
    DECLARE t_id INT;

    DECLARE quest_list TEXT;
    DECLARE quest_id_list TEXT;

    DECLARE current_quest TEXT;
    DECLARE current_quest_id INT;

    SET quest_list = 'Find the treasure,Defend the castle,Explore the dungeon,Save the village,Defeat the dragon,Retrieve the amulet,Escort the caravan,Solve the riddle,Capture the flag,Discover the hidden cave,Steal the artifact,Rescue the prisoner,Collect rare herbs,Train the soldiers,Defuse the bomb,Intercept the message,Negotiate the treaty,Conquer the city,Investigate the ruins,Rebuild the fortress';
    SET quest_id_list = '101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120';

    SELECT COUNT(*) INTO total_users FROM users;
    
    SET total_quests = 20;

    SET i = 0;

    WHILE i < total_users DO
        SELECT id INTO u_id FROM users LIMIT i, 1;

        SELECT id INTO t_id FROM users WHERE id != u_id ORDER BY RAND() LIMIT 1;

        SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(quest_list, ',', i + 1), ',', -1) INTO current_quest;
        SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(quest_id_list, ',', i + 1), ',', -1) INTO current_quest_id;

        INSERT IGNORE INTO game_1 (user_id, target, quest, quest_id) 
        VALUES (u_id, t_id, current_quest, current_quest_id);

        SET i = i + 1;

        IF i >= total_quests THEN
            SET i = 0;
        END IF;
    END WHILE;
END $$
DELIMITER ;


DROP PROCEDURE IF EXISTS GetTarget;
CREATE PROCEDURE GetTarget(IN userName VARCHAR(255))
BEGIN
  DECLARE userId INT;
  DECLARE is_voted INT;
  DECLARE targetId INT;
  DECLARE questText TEXT;

  SELECT id, is_game_1 INTO userId, is_voted FROM users WHERE name = userName LIMIT 1;

  IF userId IS NOT NULL THEN
    SELECT target, quest INTO targetId, questText FROM game_1 WHERE user_id = userId LIMIT 1;

    IF targetId IS NOT NULL THEN
      SELECT 
      name AS target_name, 
      questText AS assigned_quest ,
      is_voted as game_voted
      FROM users 
      WHERE id = targetId;
    ELSE
      SELECT 'Target not found' AS message;
    END IF;

  ELSE
    SELECT 'User not found' AS message;
  END IF;
END;
