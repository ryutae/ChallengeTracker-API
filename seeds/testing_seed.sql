INSERT INTO challenges (group_id, name, description, points)
VALUES
(1, 'run1', 'run 1 mile', 10),
(1, 'run2', 'run 2 mile', 20),
(1, 'run3', 'run 3 mile', 30),
(1, 'run4', 'run 4 mile', 40),
(1, 'run5', 'run 5 mile', 50),
(1, 'run6', 'run 6 mile', 60),
(2, 'run1', 'run 1 mile', 10),
(2, 'run2', 'run 2 mile', 20),
(2, 'run3', 'run 3 mile', 30),
(3, 'run4', 'run 4 mile', 40),
(3, 'run5', 'run 5 mile', 50),
(4, 'run6', 'run 6 mile', 60);

INSERT INTO groups (name, description, created_by)
VALUES
('Summer', 'Summer Challenge', 1),
('Fall', 'Fall Challenge', 1),
('Winter', 'Winter Challenge', 1),
('Spring', 'Spring Challenge', 1);
