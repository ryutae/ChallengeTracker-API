CREATE TABLE userGroupRef (
    user_id INTEGER REFERENCES users(id),
    group_id INTEGER REFERENCES groups(id),
    points INTEGER
);
