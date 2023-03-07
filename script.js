//set requirements and link modules
//var fs = require('fs');
//const mysql = require('mysql2');

const inquirer = require('inquirer');
const db = require(./config/index);
const conTable = require('console.table');

const db = mysql.createConnection(
{
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
},
  console.log('Connected to Employee DB')
);

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to Employee DB');
  }
});

//create connection to mysql DB
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'employee_db',
  password: '12345'
});

//create async init function to ask user what they would like to do
async function init() {
  const choice = await inquirer.prompt({
      name: 'welcomePrompt',
      type: 'list',
      choices: ['View all Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Deptartment', 'Exit'],
      message: 'What would you like to do?'
  });
};
switch (new choice.welcomePrompt){
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
  //View all employees function
  async function viewAllEmployees(){
    db.query(`SELECT * FROM employees`, function (err, results){
      console.log(`\n`+ results);
      init();
    })
  };
  //Add Employee function
  async function addEmployee(){

  };
      
  //Update Employee Role
  async function addRole(){
    
  };

  //view all departments function
  async function viewAllDepartments(){
      db.query(`SELECT * FROM department`, function (err, results){
        console.log(`\n`+ results);
        init();
      })
  };

  //view all roles function
  async function viewAllRoles(){
    db.query(`SELECT * FROM role`, function (err, results){
      console.log(`\n`+ results);
      init();
    })
  };


  
  async function addDeptartment(){
    const addDept = await inquirer.prompt({
        type: 'input',
        message: 'What is the name of the department?',
        name: 'departmentName',
        validate: validateString
      });
      const query = `
      INSERT INTO department (name)
      VALUES ("${department.departmentName}")
      `;
  
      const [rows, fields] = await connection.execute(query);
      console.log(`${rows.affectedRows} row(s) inserted`);
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
// const validateName = (input) => {
//   const name = input;
//   if (typeof input !== 'string') {
//     return 'Please re-enter employee name.';
//   }
//   if (name === '') {
//     return 'Please enter a name.';
//   }
//   return true;
// };
// //inquirer defaults to string so convert input to int and check for error.
// const validateNumber = (input) => {
//   const isNum = parseInt(input);
//   if (Number.isNaN(isNum)) {
//     return 'Please a number.';
//   }
//   if (isNum === '') {
//     return 'Please enter a number.';
//   }
//   return true;
// };
// //check string inputs for 
// const validateString = (input) => {
//   const isString = input;
//   if (typeof isString !== 'string') {
//     return 'Please re-enter.';
//   }
//   if (isString === '') {
//     return 'Please enter.';
//   }
//   return true;
// };

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

