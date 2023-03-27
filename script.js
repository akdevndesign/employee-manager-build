//set requirements and link modules
//var fs = require('fs');
//const mysql = require('mysql2');

const inquirer = require('inquirer');
const db = require('./config/index');
const conTable = require('console.table');

//create async init function to ask user what they would like to do
async function init() {
  const choice = await inquirer.prompt({
      name: 'welcomePrompt',
      type: 'list',
      choices: ['View all Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Deptartment', 'Exit'],
      message: 'What would you like to do?'
  });

  switch (choice.welcomePrompt){
    case 'View all Employees':
      viewAllEmployees()
      break;
    case 'Add Employee':
      addEmployee()
      break;
    case 'Update Employee Role':
      updateEmployeeRole()
      break;
    case 'View All Roles':
      viewAllRoles()
      break;
    case 'Add Role':
      addRole()
      break;
    case 'View All Departments':
      viewAllDepartments();
      break;
    case 'Add Deptartment':
      addDeptartment()
      break;
    case 'Exit':
      exitApp();
      break;
    };
};

  //View all employees function

  //employee_id, employee_first, employee_last, employee.role_id = emp_role.role_title and (department_id = department.department_name)
  //and salary, manager = concat employee.employee_first & employee.employee_last
  async function viewAllEmployees(){
    db.query(`SELECT 
    employees.employee_id, 
    employees.emp_first_name, 
    employees.emp_last_name, 
    emp_role.role_title, 
    department.department_name, 
    emp_role.role_salary, 
    CONCAT(managers.emp_first_name, ' ', managers.emp_last_name) AS manager_name FROM employees 
    JOIN emp_role ON employees.role_id = emp_role.role_id
    JOIN department ON emp_role.department_id = department.department_id
    LEFT JOIN employees AS managers ON employees.manager_id = managers.employee_id;`,
    function (err, results){
      console.log(`\n`);
      console.table(results);
      console.log(`\n`);
      init();
    })
  };
  // //Add Employee function
  async function addEmployee() {
    const addEmployeeQuestions = [
      {
        type: 'input',
        message: 'What is the first name of the employee?',
        name: 'newFirstName',
        validate: validateName
      },
      {
        type: 'input',
        message: 'What is the last name of the employee?',
        name: 'newLastName',
        validate: validateName
      },
      {
        type: 'list',
        message: 'What is the role for the employee?',
        name: 'newEmpRole',
        choices: await roleChoices(),
      },
      {
        type: 'list',
        message: 'Who is their manager?',
        name: 'newEmpManager',
        choices: await managerChoices(),
      }
    ];
    
    let employeeInfo = await inquirer.prompt(addEmployeeQuestions);

  // Look up the employee ID associated with the selected full name
  const selectedManager = employeeInfo.newEmpManager;
  const managerQuery = `SELECT employee_id FROM employees WHERE CONCAT(emp_first_name, ' ', emp_last_name) = '${selectedManager}'`;
  db.query(managerQuery, (err, managerResults) => {
    if (err) throw err;
  
  const managerId = managerResults[0].employee_id;


  db.query(
        'INSERT INTO employees SET ?',
        {
          emp_first_name: employeeInfo.newFirstName,
          emp_last_name: employeeInfo.newLastName,
          role_id: employeeInfo.newEmpRole,
          manager_id: managerId
        },
        (err, res) => {
          if (err) throw err;
          console.log(`\n Role successfully entered.\n`);
          init();
        }
      );
      });

      async function managerChoices() {
        return new Promise((resolve, reject) => {
          const query = 'SELECT CONCAT(emp_first_name, " ", emp_last_name) AS manager_name FROM employees';
          db.query(query, (err, results) => {
            if (err) reject(err);
            resolve(results.map(result => result.manager_name));
          });
        });
      };
    };


  async function roleChoices() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT role_title FROM emp_role';
      db.query(query, (err, results) => {
        if (err) reject(err);
        resolve(results.map(result => result.role_title));
      });
    });
  };

  async function addRole() {
    const query = 'SELECT department_id AS value, department_name AS name FROM department';
    db.query(query, (err, results) => {
      if (err) throw err;
      inquirer.prompt([{
          type: 'input',
          message: 'What is the title of the role?',
          name: 'newRole',
          validate: validateName
        },
        {
          type: 'input',
          message: 'What is the salary of the role?',
          name: 'newRoleSalary',
          validate: validateNumber
        },
        {
          type: 'list',
          message: 'What is the department for the role?',
          name: 'newRoleDept',
          choices: results,
          validate: validateNumber
        }
      ]).then((function(res) {
        db.query("INSERT INTO emp_role SET ?", {
          role_title: res.newRole,
          role_salary: res.newRoleSalary,
          department_id: res.newRoleDept
        }, (err, res) => {
          if (err) throw err;
          console.log(`\n Role successfully entered.\n`);
          init();
        });
      }));
    });
  }


  //Update Employee Role
  async function updateEmployeeRole() {
    const employees = await db.promise().query('SELECT employee_id, CONCAT(emp_first_name, " ", emp_last_name) AS name FROM employees');
    const roles = await db.promise().query('SELECT role_id, role_title AS title FROM emp_role');
    const { employeeId, roleId } = await inquirer.prompt([
      {
        type: 'list',
        message: 'Which employee would you like to update?',
        name: 'employeeId',
        choices: employees[0].map(employee => ({
          value: employee.employee_id,
          name: employee.name
        }))
      },
      {
        type: 'list',
        message: 'What is the employee\'s new role?',
        name: 'roleId',
        choices: roles[0].map(role => ({
          value: role.role_id,
          name: role.title
        }))
      }
    ]);
    await db.promise().query(`UPDATE employees SET role_id = ${roleId} WHERE employee_id = ${employeeId}`);
    console.log(`\nEmployee role updated successfully.\n`);
    init();
  };
  //add employee function
  async function addEmployee() {
    const addEmployeeQuestions = [
      {
        type: 'input',
        message: 'What is the first name of the employee?',
        name: 'newFirstName',
        validate: validateName
      },
      {
        type: 'input',
        message: 'What is the last name of the employee?',
        name: 'newLastName',
        validate: validateName
      },
      {
        type: 'list',
        message: 'What is the role for the employee?',
        name: 'newEmpRole',
        choices: await roleChoices(),
      },
      {
        type: 'list',
        message: 'Who is their manager?',
        name: 'newEmpManager',
        choices: await managerChoices(),
      }
    ];
  
    let employeeInfo = await inquirer.prompt(addEmployeeQuestions);
  
    // Look up the employee ID associated with the selected full name
    const selectedManager = employeeInfo.newEmpManager;
    const managerQuery = `SELECT employee_id FROM employees WHERE CONCAT(emp_first_name, ' ', emp_last_name) = '${selectedManager}'`;
    
    db.query(managerQuery, (err, managerResults) => {
      if (err) throw err;
      const managerId = managerResults[0].employee_id;
  
      // Insert the new employee with the manager ID
      db.query(
        'INSERT INTO employees SET ?',
        {
          emp_first_name: employeeInfo.newFirstName,
          emp_last_name: employeeInfo.newLastName,
          role_id: employeeInfo.newEmpRole,
          manager_id: managerId
        },
        (err, res) => {
          if (err) throw err;
          console.log(`\n Employee successfully saved.\n`);
          init();
        }
      );
    });

  //query manager names and concat to one name. Then save manager as employee ID
    async function managerChoices() {
      return new Promise((resolve, reject) => {
        const query = 'SELECT CONCAT(emp_first_name, " ", emp_last_name) AS manager_name FROM employees';
        db.query(query, (err, results) => {
          if (err) reject(err);
          resolve(results.map(result => result.manager_name));
        });
      });
    };
  };
  
  //query role titles and save as role_id
  async function roleChoices() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT role_id, role_title FROM emp_role';
      db.query(query, (err, results) => {
        if (err) reject(err);
        resolve(results.map(result => ({ name: result.role_title, value: result.role_id })));
      });
    });
  }

  //view all departments function
function viewAllDepartments(){
      db.query(`SELECT * FROM department`, function (err, results){
        console.log(`\n`)
        console.table(results)
        init();
      })
  };

  //view all roles function
function viewAllRoles(){
    db.query(`SELECT emp_role.role_id, emp_role.role_title, emp_role.role_salary, department.department_name, department.department_id FROM emp_role JOIN department ON emp_role.department_id = department.department_id ORDER BY emp_role.role_id ASC`, function (err, results){
      console.log(`\n`);
      console.table(results)
      init();
    })
  };

//ADD DEPARTMENT FUNCTION
function addDeptartment(){
    inquirer.prompt({
        type: 'input',
        message: 'What is the name of the department?',
        name: 'newDept',
        validate: validateString
      })
      .then((function(res){
        db.query("INSERT INTO department SET ?", 
        {
          department_name: res.newDept
        })
        console.log(`\n Department successfully entered.\n`);
        init();
      }))
    };
 

//Exit app function
let exitApp = () => {
  process.exit(console.log("\nGoodbye!"));
}

init();

//~~~~~~~~~~~Validate functions~~~~~~~~~~~~~~~
// //create input validation checks for prompt questions
const validateName = (input) => {
  const name = input;
  if (typeof input !== 'string') {
    return 'Please re-enter employee name.';
  }
  if (name === '') {
    return 'Please enter a name.';
  }
  return true;
};
// //inquirer defaults to string so convert input to int and check for error.
const validateNumber = (input) => {
  const isNum = parseInt(input);
  if (Number.isNaN(isNum)) {
    return 'Please a number.';
  }
  if (isNum === '') {
    return 'Please enter a number.';
  }
  return true;
};
//check string inputs for 
const validateString = (input) => {
  const isString = input;
  if (typeof isString !== 'string') {
    return 'Please re-enter.';
  }
  if (isString === '') {
    return 'Please enter.';
  }
  return true;
};
