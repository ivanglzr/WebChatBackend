CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP DATABASE IF EXISTS webchat;
CREATE DATABASE webchat;

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS chats;

DROP TABLE IF EXISTS codes;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(100) NOT NULL
)

CREATE TABLE codes (
    userId UUID PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    code INT
)

CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chatName VARCHAR(100) NOT NULL,
  ownerId UUID REFERENCES users(id),
  usersIds UUID[]
)

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chatId UUID REFERENCES chats(id) ON DELETE CASCADE,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
)

CREATE OR REPLACE FUNCTION generate_code_after_register()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO codes (userId, code) VALUES (NEW.id, NULL);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_code_after_register
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION generate_code_after_register();

CREATE OR REPLACE FUNCTION remove_user_from_chat()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chats
  SET usersIds = array_remove(userIds, OLD.id)
  WHERE OLD.id = ANY(userIds);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER remove_user_from_chat
BEFORE DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION remove_user_from_chat();
