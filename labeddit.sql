<<<<<<< HEAD
-- Active: 1689078999435@@127.0.0.1@3306

CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    nickname TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT(DATETIME()) NOT NULL
);

CREATE TABLE posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    comments INTEGER NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT DEFAULT(DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT(DATETIME()) NOT NULL,
    FOREIGN KEY(creator_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE likes_dislikesPosts(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY(post_id) REFERENCES posts(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE comments_posts(
    id PRIMARY KEY UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT DEFAULT(DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT(DATETIME()) NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY(post_id) REFERENCES posts(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE likes_dislikesComments(
    user_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY(comment_id) REFERENCES comments_posts(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

INSERT INTO users (id, nickname, email, password, role)
VALUES
("u001", "Lucas", "lucas@email.com", "Lucas08*", "ADMIN");

SELECT * FROM users;

INSERT INTO posts(id, creator_id, content, likes, dislikes)
VALUES
("p001", "u001", "será que ta certo?", 2, 1),
("p002", "u002", "será que ta certo agora?", 1, 3),
("p003", "u003", "eee acertei", 10, 1);

SELECT * FROM posts;

INSERT INTO likes_dislikes(user_id, post_id, like)
VALUES
("u001", "p001", 5),
("u002", "p002", 7),
("u003", "p003", 2);

SELECT * FROM likes_dislikesPosts;

SELECT * FROM comments_posts;

DROP TABLE users;

=======
-- Active: 1689078999435@@127.0.0.1@3306

CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    nickname TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT(DATETIME()) NOT NULL
);

CREATE TABLE posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    comments INTEGER NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT DEFAULT(DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT(DATETIME()) NOT NULL,
    FOREIGN KEY(creator_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE likes_dislikesPosts(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY(post_id) REFERENCES posts(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE comments_posts(
    id PRIMARY KEY UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT DEFAULT(DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT(DATETIME()) NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY(post_id) REFERENCES posts(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE likes_dislikesComments(
    user_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY(comment_id) REFERENCES comments_posts(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

INSERT INTO users (id, nickname, email, password, role)
VALUES
("u001", "Lucas", "lucas@email.com", "Lucas08*", "ADMIN");

SELECT * FROM users;

INSERT INTO posts(id, creator_id, content, likes, dislikes)
VALUES
("p001", "u001", "será que ta certo?", 2, 1),
("p002", "u002", "será que ta certo agora?", 1, 3),
("p003", "u003", "eee acertei", 10, 1);

SELECT * FROM posts;

INSERT INTO likes_dislikes(user_id, post_id, like)
VALUES
("u001", "p001", 5),
("u002", "p002", 7),
("u003", "p003", 2);

SELECT * FROM likes_dislikes;

SELECT * FROM comments_posts;

DROP TABLE users;

>>>>>>> 52bd085d157837844157472633f32e519c68f745
