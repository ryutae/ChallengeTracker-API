CREATE TABLE completedchallenge (
    user_id INTEGER REFERENCES users(id),
    group_id INTEGER REFERENCES groups(id),
    challenge_id INTEGER REFERENCES challenges(id),
    date_completed TIMESTAMP DEFAULT now() NOT NULL,
    points INTEGER
);
