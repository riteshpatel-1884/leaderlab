export interface SqlQuestion {
  id: number;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  schema: string; 
}

export const sqlQuestions: SqlQuestion[] = [
  {
    id: 1,
    title: "Find Second Highest Salary",
    topic: "Subqueries",
    difficulty: "Medium",
    description: "Write a SQL query to find the second highest salary from the Employee table. If there is no second highest salary, return NULL.",
    schema: `CREATE TABLE Employee (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  salary DECIMAL(10, 2)
);

-- Sample Data
INSERT INTO Employee VALUES 
  (1, 'John Doe', 85000),
  (2, 'Jane Smith', 90000),
  (3, 'Bob Johnson', 75000);`
  },
  {
    id: 2,
    title: "Delete Duplicate Emails",
    topic: "Data Manipulation",
    difficulty: "Easy",
    description: "Write a SQL query to delete all duplicate email addresses, keeping only the row with the smallest id for each email.",
    schema: `CREATE TABLE Person (
  id INT PRIMARY KEY,
  email VARCHAR(255)
);

-- Sample Data
INSERT INTO Person VALUES 
  (1, 'john@example.com'),
  (2, 'bob@example.com'),
  (3, 'john@example.com');`
  },
  {
    id: 3,
    title: "Employees Earning More Than Their Managers",
    topic: "Self Joins",
    difficulty: "Easy",
    description: "Write a SQL query to find employees who earn more than their managers. Return the employee's name.",
    schema: `CREATE TABLE Employee (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  salary DECIMAL(10, 2),
  managerId INT
);

-- Sample Data
INSERT INTO Employee VALUES 
  (1, 'Joe', 70000, 3),
  (2, 'Henry', 80000, 4),
  (3, 'Sam', 60000, NULL),
  (4, 'Max', 90000, NULL);`
  },
  {
    id: 4,
    title: "Department Highest Salary",
    topic: "Joins & Aggregation",
    difficulty: "Medium",
    description: "Write a SQL query to find employees who have the highest salary in each department.",
    schema: `CREATE TABLE Employee (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  salary DECIMAL(10, 2),
  departmentId INT
);

CREATE TABLE Department (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

-- Sample Data
INSERT INTO Department VALUES (1, 'IT'), (2, 'Sales');
INSERT INTO Employee VALUES 
  (1, 'Joe', 85000, 1),
  (2, 'Jim', 90000, 1),
  (3, 'Henry', 80000, 2),
  (4, 'Sam', 60000, 2),
  (5, 'Max', 90000, 1);`
  },
  {
    id: 5,
    title: "Consecutive Numbers",
    topic: "Window Functions",
    difficulty: "Hard",
    description: "Write a SQL query to find all numbers that appear at least three times consecutively in the Logs table.",
    schema: `CREATE TABLE Logs (
  id INT PRIMARY KEY,
  num INT
);

-- Sample Data
INSERT INTO Logs VALUES 
  (1, 1), (2, 1), (3, 1), 
  (4, 2), (5, 1), (6, 2), (7, 2);`
  },
  {
    id: 6,
    title: "Nth Highest Salary",
    topic: "Ranking",
    difficulty: "Medium",
    description: "Write a SQL query to get the Nth highest salary from the Employee table. Create a function or use appropriate methods.",
    schema: `CREATE TABLE Employee (
  id INT PRIMARY KEY,
  salary DECIMAL(10, 2)
);

-- Sample Data
INSERT INTO Employee VALUES 
  (1, 100), (2, 200), (3, 300);`
  },
  {
    id: 7,
    title: "Customers Who Never Order",
    topic: "Joins",
    difficulty: "Easy",
    description: "Write a SQL query to find all customers who never placed an order.",
    schema: `CREATE TABLE Customers (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE Orders (
  id INT PRIMARY KEY,
  customerId INT
);

-- Sample Data
INSERT INTO Customers VALUES (1, 'Joe'), (2, 'Henry'), (3, 'Sam'), (4, 'Max');
INSERT INTO Orders VALUES (1, 3), (2, 1);`
  },
  {
    id: 8,
    title: "Rank Scores",
    topic: "Window Functions",
    difficulty: "Medium",
    description: "Write a SQL query to rank scores. If there is a tie between two scores, both should have the same ranking. The next ranking number should be the next consecutive integer.",
    schema: `CREATE TABLE Scores (
  id INT PRIMARY KEY,
  score DECIMAL(3, 2)
);

-- Sample Data
INSERT INTO Scores VALUES 
  (1, 3.50), (2, 3.65), (3, 4.00), 
  (4, 3.85), (5, 4.00), (6, 3.65);`
  },
  {
    id: 9,
    title: "Department Top Three Salaries",
    topic: "Window Functions",
    difficulty: "Hard",
    description: "Write a SQL query to find employees who earn the top three unique salaries in each department. Return the department name, employee name, and salary.",
    schema: `CREATE TABLE Employee (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  salary DECIMAL(10, 2),
  departmentId INT
);

CREATE TABLE Department (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

-- Sample Data
INSERT INTO Department VALUES (1, 'IT'), (2, 'Sales');
INSERT INTO Employee VALUES 
  (1, 'Joe', 85000, 1),
  (2, 'Henry', 80000, 2),
  (3, 'Sam', 60000, 2),
  (4, 'Max', 90000, 1),
  (5, 'Janet', 69000, 1),
  (6, 'Randy', 85000, 1),
  (7, 'Will', 70000, 1);`
  },
  {
    id: 10,
    title: "Rising Temperature",
    topic: "Self Joins & Date Functions",
    difficulty: "Easy",
    description: "Write a SQL query to find all dates with higher temperatures compared to their previous dates (yesterday).",
    schema: `CREATE TABLE Weather (
  id INT PRIMARY KEY,
  recordDate DATE,
  temperature INT
);

-- Sample Data
INSERT INTO Weather VALUES 
  (1, '2015-01-01', 10),
  (2, '2015-01-02', 25),
  (3, '2015-01-03', 20),
  (4, '2015-01-04', 30);`
  },
  {
    id: 11,
    title: "Trips and Users",
    topic: "Joins & Aggregation",
    difficulty: "Hard",
    description: "Write a SQL query to find the cancellation rate of requests made by unbanned users between two dates (inclusive). Round the result to two decimal places.",
    schema: `CREATE TABLE Trips (
  id INT PRIMARY KEY,
  client_id INT,
  driver_id INT,
  city_id INT,
  status ENUM('completed', 'cancelled_by_driver', 'cancelled_by_client'),
  request_at DATE
);

CREATE TABLE Users (
  users_id INT PRIMARY KEY,
  banned VARCHAR(3),
  role ENUM('client', 'driver', 'partner')
);

-- Sample Data
INSERT INTO Users VALUES 
  (1, 'No', 'client'),
  (2, 'Yes', 'client'),
  (3, 'No', 'client'),
  (4, 'No', 'client'),
  (10, 'No', 'driver'),
  (11, 'No', 'driver'),
  (12, 'No', 'driver'),
  (13, 'No', 'driver');`
  },
  {
    id: 12,
    title: "Game Play Analysis",
    topic: "Window Functions",
    difficulty: "Medium",
    description: "Write a SQL query to report the first login date for each player. Return player_id and first_login date.",
    schema: `CREATE TABLE Activity (
  player_id INT,
  device_id INT,
  event_date DATE,
  games_played INT,
  PRIMARY KEY (player_id, event_date)
);

-- Sample Data
INSERT INTO Activity VALUES 
  (1, 2, '2016-03-01', 5),
  (1, 2, '2016-05-02', 6),
  (2, 3, '2017-06-25', 1),
  (3, 1, '2016-03-02', 0),
  (3, 4, '2018-07-03', 5);`
  },
  {
    id: 13,
    title: "Find Median Salary",
    topic: "Window Functions",
    difficulty: "Hard",
    description: "Write a SQL query to find the median salary of each company. Return company_id, employee_id, and salary.",
    schema: `CREATE TABLE Employee (
  id INT PRIMARY KEY,
  company VARCHAR(100),
  salary DECIMAL(10, 2)
);

-- Sample Data
INSERT INTO Employee VALUES 
  (1, 'A', 2341),
  (2, 'A', 341),
  (3, 'A', 15),
  (4, 'A', 15314),
  (5, 'A', 451),
  (6, 'A', 513),
  (7, 'B', 15),
  (8, 'B', 13),
  (9, 'B', 1154),
  (10, 'B', 1345),
  (11, 'B', 1221),
  (12, 'B', 234);`
  },
  {
    id: 14,
    title: "Exchange Seats",
    topic: "Case Statements",
    difficulty: "Medium",
    description: "Write a SQL query to swap the seat id of every two consecutive students. If the number of students is odd, the last student's id should not be swapped.",
    schema: `CREATE TABLE Seat (
  id INT PRIMARY KEY,
  student VARCHAR(100)
);

-- Sample Data
INSERT INTO Seat VALUES 
  (1, 'Abbot'),
  (2, 'Doris'),
  (3, 'Emerson'),
  (4, 'Green'),
  (5, 'Jeames');`
  },
  {
    id: 15,
    title: "Tree Node Type",
    topic: "Case Statements",
    difficulty: "Medium",
    description: "Write a SQL query to identify the type of each node in a tree: 'Root' (no parent), 'Leaf' (no children), or 'Inner' (has both parent and children).",
    schema: `CREATE TABLE Tree (
  id INT PRIMARY KEY,
  p_id INT
);

-- Sample Data
INSERT INTO Tree VALUES 
  (1, NULL),
  (2, 1),
  (3, 1),
  (4, 2),
  (5, 2);`
  },
  {
    id: 16,
    title: "Monthly Transactions",
    topic: "Aggregation & Date Functions",
    difficulty: "Medium",
    description: "Write a SQL query to find the number of transactions and total amount by month and country. Include only approved transactions.",
    schema: `CREATE TABLE Transactions (
  id INT PRIMARY KEY,
  country VARCHAR(50),
  state ENUM('approved', 'declined'),
  amount INT,
  trans_date DATE
);

-- Sample Data
INSERT INTO Transactions VALUES 
  (121, 'US', 'approved', 1000, '2018-12-18'),
  (122, 'US', 'declined', 2000, '2018-12-19'),
  (123, 'US', 'approved', 2000, '2019-01-01'),
  (124, 'DE', 'approved', 2000, '2019-01-07');`
  },
  {
    id: 17,
    title: "Product Sales Analysis",
    topic: "Joins",
    difficulty: "Easy",
    description: "Write a SQL query to report the product_name, year, and price for each sale_id in the Sales table.",
    schema: `CREATE TABLE Sales (
  sale_id INT,
  product_id INT,
  year INT,
  quantity INT,
  price INT,
  PRIMARY KEY (sale_id, year)
);

CREATE TABLE Product (
  product_id INT PRIMARY KEY,
  product_name VARCHAR(100)
);

-- Sample Data
INSERT INTO Product VALUES (100, 'Nokia'), (200, 'Apple'), (300, 'Samsung');
INSERT INTO Sales VALUES 
  (1, 100, 2008, 10, 5000),
  (2, 100, 2009, 12, 5000),
  (7, 200, 2011, 15, 9000);`
  },
  {
    id: 18,
    title: "Reformat Department Table",
    topic: "Pivot",
    difficulty: "Easy",
    description: "Write a SQL query to reformat the table such that each row contains id and revenue for each month (Jan, Feb, Mar, etc.). Use NULL if no revenue for that month.",
    schema: `CREATE TABLE Department (
  id INT,
  revenue INT,
  month VARCHAR(10),
  PRIMARY KEY (id, month)
);

-- Sample Data
INSERT INTO Department VALUES 
  (1, 8000, 'Jan'),
  (2, 9000, 'Jan'),
  (3, 10000, 'Feb'),
  (1, 7000, 'Feb'),
  (1, 6000, 'Mar');`
  },
  {
    id: 19,
    title: "Immediate Food Delivery",
    topic: "Aggregation",
    difficulty: "Medium",
    description: "Write a SQL query to find the percentage of immediate orders in the first orders of all customers. Round to 2 decimal places. An order is immediate if the preferred delivery date equals the order date.",
    schema: `CREATE TABLE Delivery (
  delivery_id INT PRIMARY KEY,
  customer_id INT,
  order_date DATE,
  customer_pref_delivery_date DATE
);

-- Sample Data
INSERT INTO Delivery VALUES 
  (1, 1, '2019-08-01', '2019-08-02'),
  (2, 2, '2019-08-02', '2019-08-02'),
  (3, 1, '2019-08-11', '2019-08-12'),
  (4, 3, '2019-08-24', '2019-08-24'),
  (5, 3, '2019-08-21', '2019-08-22'),
  (6, 2, '2019-08-11', '2019-08-13');`
  },
  {
    id: 20,
    title: "User Activity for Past 30 Days",
    topic: "Aggregation & Date Functions",
    difficulty: "Easy",
    description: "Write a SQL query to find the daily active user count for a period of 30 days ending 2019-07-27 inclusively. A user is active if they made at least one activity on that day.",
    schema: `CREATE TABLE Activity (
  user_id INT,
  session_id INT,
  activity_date DATE,
  activity_type ENUM('open_session', 'end_session', 'scroll_down', 'send_message'),
  PRIMARY KEY (session_id)
);

-- Sample Data
INSERT INTO Activity VALUES 
  (1, 1, '2019-07-20', 'open_session'),
  (1, 2, '2019-07-20', 'send_message'),
  (1, 3, '2019-07-21', 'send_message'),
  (2, 4, '2019-07-21', 'open_session'),
  (3, 5, '2019-07-21', 'open_session'),
  (3, 6, '2019-07-27', 'end_session');`
  }
];