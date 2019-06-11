CREATE TABLE UserGroupRef (
    user_id INTEGER REFERENCES users(id),
    group_id INTEGER REFERENCES groups(id)
);
