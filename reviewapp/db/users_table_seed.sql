CREATE TABLE IF NOT EXISTS users (
    id serial primary key,
    username varchar(180),
    email varchar(180),
    img text,
    auth_id text
);