const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',

  port: 3306,

  user: 'root',

  password: '',

  database: 'employees_db',
});

connection.connect((err) => {
  if (err) throw err;
  runPrompts();
});

const runPrompts = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to do?',
      choices: [
        'Add a department, role, or employee',
        'View departments, roles, or employees',
        'Update employee roles',
        'EXIT',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'Add a department, role, or employee':
          addDRE();
          break;

        case 'View departments, roles, or employees':
          viewDRE();
          break;

        case 'Update employee roles':
          updateEmployee();
          break;

        case 'EXIT':
          connection.end();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const addDRE = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'Which would you like to add?',
      choices: [
        'a new Department',
        'a new Role',
        'a new Employee',
        'EXIT',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'a new Department':
          addDepartment();
          break;

        case 'a new Role':
          addRole();
          break;

        case 'a new Employee':
          addEmployee();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const addDepartment = () => {
  inquirer
  .prompt({
      name: 'department',
      input: 'input',
      message: "What is the name of the department you'd like to add?"
    }).then((answer) => {
            console.log('Adding new department...\n');
            connection.query(
              'INSERT INTO department SET ?',
              {name: answer.department},
              (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} item added!\n`);
                runPrompts();
              }
            )
          })
};

const addRole = () => {
  inquirer
  .prompt(
            [
              {
                name: 'roleTitle',
                input: 'input',
                message: "What is the name of the role you'd like to add?"
              },
              {
              name: 'roleSalary',
              input: 'input',
              message: "What is the salary of this role?"
              },
              {
                name: 'roleDepartment',
                input: 'input',
                message: "What is the ID of the department this role belongs to?"
              },
            ]).then((answer) => {
            console.log('Adding new role...\n');
            connection.query(
              'INSERT INTO role SET ?',
              {
                title: answer.roleTitle,
                salary: answer.roleSalary,
                department_id: answer.roleDepartment,

              },
              (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} item added!\n`);
                runPrompts();
              }
            )
          })

};

const addEmployee = () => {
  inquirer
  .prompt(
            [
              {
                name: 'firstName',
                input: 'input',
                message: "What is the first name of the employee you'd like to add?"
              },
              {
              name: 'lastName',
              input: 'input',
              message: "What is the last name of the employee you'd like to add?"
              },
              {
                name: 'roleID',
                input: 'input',
                message: "What is employee's role ID number?"
              },
              {
                name: 'managerID',
                input: 'input',
                message: "What is the ID number of the employee's manager?"
              },
            ]).then((answer) => {
            console.log('Adding new employee...\n');
            connection.query(
              'INSERT INTO employee SET ?',
              {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: answer.roleID,
                manager_id: answer.managerID,

              },
              (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} item added!\n`);
                runPrompts();
              }
            )
          })
};

const viewDRE = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'Which would you like to view?',
      choices: [
        'Departments',
        'Roles',
        'Employees',
        'Main Menu',
        'EXIT',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'Departments':
          viewDepartment();
          break;

        case 'Roles':
          viewRole();
          break;

        case 'Employees':
          viewEmployee();
          break;

        case 'Main Menu':
          runPrompts();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const viewDepartment = () => {
  console.log("Grabbing all departments...")
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
  })
  viewDRE();
};

const viewRole = () => {
  console.log("Grabbing all roles...")
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    console.table(res);
  })
  viewDRE();
};

const viewEmployee = () => {
  console.log("Grabbing all employees...")
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    console.table(res);
  })
  viewDRE();
};


const updateEmployee = () => {
  inquirer
  .prompt(
            [
              {
                name: 'employeeID',
                input: 'input',
                message: "What is the ID number of the employee who's role you'd like to update?"
              },
              {
              name: 'roleUpdate',
              input: 'input',
              message: "What is the role ID that you'd like to assign to the employee?"
              },
            ]).then((answer) => {
            console.log('Updating employee role...\n');
            const query = connection.query(
              'UPDATE employee SET ? WHERE ?',
              [
                {
                  role_id: answer.roleUpdate
                },
                {
                  id: answer.employeeID,
                },
              ],
              (err, res) => {
                if (err) throw err;
                console.log("Updated employee role!");

               runPrompts();
              }
            );
          
          })
};