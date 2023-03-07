DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
  department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  role_title VARCHAR(30) NOT NULL,
  role_salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE employee (
  employee_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employee_first_name VARCHAR(30) NOT NULL,
  employee_last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role(role_id),
  FOREIGN KEY (manager_id) REFERENCES employee(employee_id)
);





