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
  }, 
  {
    

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
    db.query(`SELECT employee.employee_id`,
    function (err, results){
      console.log(`\n`);
      console.table(results);
      console.log(`\n`);
      init();
    })
  };
  //Add Employee function
  function addEmployee(){

  };
      
  //Update Employee Role
  function addRole(){
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
]).then((function(res){
    db.query("INSERT INTO emp_role SET ?", {role_title: res.newRole, role_salary: res.newRoleSalary, department_id: res.newRoleDeptID})
    console.log(`\n Role successfully entered.\n`);
    init();
  }))
});
  };

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
    db.query(`SELECT * FROM emp_role`, function (err, results){
      console.log(`\n`);
      console.table(results)
      init();
    })
  };


  
  function addDeptartment(){
    inquirer.prompt({
        type: 'input',
        message: 'What is the name of the department?',
        name: 'newDept',
        validate: validateString
      })
      .then((function(res){
        db.query("INSERT INTO department SET ?", {department_name: res.newDept})
        console.log(`\n Department successfully entered.\n`);
        init();
      }))
    };
 

//Exit app function
let exitApp = () => {
  process.exit(console.log("\nGoodbye!"));
}

  //   let employeeProfile = await inquirer.prompt(employeeQuestions);
    
  //   switch (employeeProfile.role) {
  //     case 'Engineer':
  //       let addEngineer = new Engineer(employeeProfile.name, employeeProfile.id, employeeProfile.email, employeeProfile.gitname)
  //       employeeData.push(addEngineer);
  //       break;
  //     case 'Manager':
  //       let addManager = new Manager(employeeProfile.name, employeeProfile.id, employeeProfile.email, employeeProfile.officenumber)
  //       employeeData.push(addManager);
  //       break;
  //     case 'Intern':
  //       let addIntern = new Intern(employeeProfile.name, employeeProfile.id, employeeProfile.email, employeeProfile.school)
  //       employeeData.push(addIntern);
  //       break;
  //     default: 
  //       writeToFile();
        



init();



// // Function call to initialize app
// init();

// //create array for employee data
// const employeeData = [];
// console.log('Employee data:', employeeData)

// const roles = ['Manager','Engineer', 'Intern']

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

// // Create an array of prompts for inquirer
// const employeeQuestions = [
//       {
//         type: 'input',
//         message: 'What is the team member name?',
//         name: 'name',
//         validate: validateName
//       },
//       {
//         type: 'input',
//         message: 'What is their employee ID?',
//         name: 'id',
//         validate: validateNumber

//       },
//       {
//         type: 'input',
//         message: 'What is their email?',
//         name: 'email',
//         validate: validateEmail

//       },
//       {
//         type: 'list',
//         message: 'What is their role?',
//         choices: roles,
//         name: 'role',
//       },
//       {
//         type: 'input',
//         message: 'What is their office number?',
//         name: 'officeumber',
//         when: employee => employee.role === "Manager",
//         validate: validateNumber

//       },
//       {
//         type: 'input',
//         message: 'What is their GitHub Username?',
//         name: 'gitname',
//         when: employee => employee.role === "Engineer",
//         validate: validateString

//       },
//       {
//         type: 'input',
//         message: 'What is their school?',
//         name: 'school',
//         when: employee => employee.role === "Intern",
//         validate: validateString
//       },
//     ];

// //create async function that invokes terminal prompts and switch statement to pass results to class modules
// async function enterEmployeeProfile(){

//   let employeeProfile = await inquirer.prompt(employeeQuestions);
  
//   switch (employeeProfile.role) {
//     case 'Engineer':
//       let addEngineer = new Engineer(employeeProfile.name, employeeProfile.id, employeeProfile.email, employeeProfile.gitname)
//       employeeData.push(addEngineer);
//       break;
//     case 'Manager':
//       let addManager = new Manager(employeeProfile.name, employeeProfile.id, employeeProfile.email, employeeProfile.officenumber)
//       employeeData.push(addManager);
//       break;
//     case 'Intern':
//       let addIntern = new Intern(employeeProfile.name, employeeProfile.id, employeeProfile.email, employeeProfile.school)
//       employeeData.push(addIntern);
//       break;
//     default: 
//       writeToFile();
      

//   }

//   //Await answers from requestEmp and call function again;
//   const addMore = await inquirer.prompt([
//     {
//       name: 'addAnother',
//       type: 'confirm',
//       message: 'Would you like to add another employee?',
//       default: false,
//     },

//   ]);
//   //create conditional statement to end session if no more employees to add
//   if (addMore.addAnother === true) {
//     enterEmployeeProfile();
//   } else {
//     writeToFile()
//     process.exit(console.log("\nGoodbye!"));
//   }
// }

// //Write to HTML function
// function writeToFile() {

//   fs.writeFileSync(fileName, generateHTML(employeeData))
//   console.log('Employee data:', employeeData)
//   console.log("File created successfully!");
// }

