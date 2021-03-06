CREATE TABLE groups (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id),
    date_created TIMESTAMP DEFAULT now() NOT NULL
);
