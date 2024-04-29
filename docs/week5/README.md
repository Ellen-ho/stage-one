## Task 2: Create Database and Table in MySQL Server

```sql
CREATE DATABASE website;
```

```sql
CREATE TABLE website.member (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    follower_count INT UNSIGNED NOT NULL DEFAULT 0,
    time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```
![Task 2-2]<img src="./screenshots/task2-2.png" width="500" alt="Task 2-2">

### Task 3: SQL CRUD

```sql
INSERT INTO website.member (name, username, password) VALUES ('test', 'test', 'test');
INSERT INTO website.member (name, username, password, follower_count) VALUES ('Mary', 'mary123', 'marySecret123', 1);
INSERT INTO website.member (name, username, password, follower_count) VALUES ('Bob', 'bob456', 'bobSecret456', 2);
INSERT INTO website.member (name, username, password,  follower_count) VALUES ('Amy', 'amy789', 'amySecret789', 3);
INSERT INTO website.member (name, username, password, follower_count) VALUES ('Danny', 'danny000', 'dannySecret000', 4);
```

```sql
SELECT * FROM website.member;
```

```sql
SELECT * FROM website.member ORDER BY time DESC;
```

```sql
SELECT * FROM website.member ORDER BY time DESC LIMIT 3 OFFSET 1;
```

```sql
SELECT * FROM website.member WHERE username = 'test';
```

```sql
SELECT * FROM website.member WHERE name LIKE '%es%';
```

```sql
SELECT * FROM website.member WHERE username = 'test' AND password = 'test';
```

```sql
UPDATE website.member SET name = 'test2' WHERE username = 'test';
```

```sql
SELECT * FROM website.member WHERE username = 'test';
```

### Task 4: SQL Aggregation Functions

```sql
SELECT COUNT(*) FROM website.member;
```

```sql
SELECT SUM(follower_count) FROM website.member;
```

```sql
SELECT AVG(follower_count) FROM website.member;
```

```sql
 SELECT AVG(follower_count)  FROM (SELECT follower_count FROM website.member ORDER BY follower_count DESC LIMIT 2) AS top_two_average_followers;
 ```

### Task 5: SQL JOIN

```sql
CREATE TABLE website.message (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    content VARCHAR(255) NOT NULL,
    like_count INT UNSIGNED NOT NULL DEFAULT 0,
    time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES website.member(id)
    );
```

```sql
SELECT message.id, member.name AS sender_name, message.content, message.like_count, message.time
FROM website.message
JOIN website.member ON message.member_id = member.id;
```

```sql
SELECT message.id, member.name AS sender_name, message.content, message.like_count, message.time
FROM website.message
JOIN website.member ON message.member_id = member.id
WHERE member.username = 'test';
```

```sql
SELECT AVG(message.like_count) FROM website.message
JOIN website.member ON message.member_id = member.id
WHERE member.username = 'test';
```

```sql
SELECT member.username, AVG(message.like_count) FROM website.message
JOIN website.member ON message.member_id = member.id
GROUP BY member.username;
```