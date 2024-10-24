CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    points INT(10) NOT NULL DEFAULT 0,
    type_character VARCHAR(255),
    is_voted TINYINT(1) NOT NULL DEFAULT 0,
    is_game_1 TINYINT(1) NOT NULL DEFAULT 0,
    is_game_2 TINYINT(1) NOT NULL DEFAULT 0,
    is_game_3 TINYINT(1) NOT NULL DEFAULT 0,
    is_game_4 TINYINT(1) NOT NULL DEFAULT 0,
    is_photo TINYINT(1) NOT NULL DEFAULT 0
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

DELIMITER //
DROP PROCEDURE IF EXISTS clear_game1 //
CREATE PROCEDURE clear_game1()
BEGIN
    DELETE FROM game_1;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS CheckUser;
CREATE DEFINER=`root`@`%` PROCEDURE `CheckUser`(IN userName VARCHAR(255))
BEGIN
  DECLARE existingUser VARCHAR(255);

  SELECT name INTO existingUser
  FROM users
  WHERE name = userName;

  IF existingUser IS NOT NULL THEN
    SELECT name AS name,
           points AS points,
           `type_character` AS `character`,
           is_game_2 as game2,
           is_game_3 as game3,
           is_game_4 as game4,
           is_photo as photo
    FROM users
    WHERE name = userName;
  
  ELSE
    SELECT 0 AS no_user_found;
  END IF;
END;

DROP PROCEDURE IF EXISTS GetAllUsers;
CREATE DEFINER=`root`@`%` PROCEDURE `GetAllUsers`()
BEGIN
  SELECT * FROM users;
END

DROP PROCEDURE IF EXISTS InsertUser;
CREATE DEFINER=`root`@`%` PROCEDURE `InsertUser`(
    IN userName VARCHAR(255)
)
BEGIN
  INSERT INTO users (name, type_character)
  VALUES (userName, 
          CASE
            WHEN RAND() < 0.5 THEN 'hunter'
            ELSE 'vampire'
          END
  );
END;

DROP PROCEDURE IF EXISTS insert_game_1_data;
CREATE DEFINER=`root`@`%` PROCEDURE `insert_game_1_data`(
    IN u_id INT,
    IN t_id INT,
    IN current_quest TEXT,
    IN current_quest_id INT
)
BEGIN
  INSERT IGNORE INTO game_1 (user_id, target, quest, quest_id)
  VALUES (u_id, t_id, current_quest, current_quest_id);
END;

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
