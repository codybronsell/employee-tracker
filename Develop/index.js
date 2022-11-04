import inquirer from 'inquirer';
import cTable from 'console.table';
import mysql from 'mysql2';

import fs from 'fs';
import { exit } from 'process';
let departments = [];
let roles = [];
let employees = [];
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'codydb'
});
loadData();
// TODO: Create an array of questions for user input
const team = [];
const questions = [
  {
    type: 'list',
    name: 'toDo',
    message: "what do you want to do?",
    choices: ['View All Employees','Add Employees','Update Employee Role','View All Roles','Add Role','View All Departments','Add Department','Quit'],
  },
    {
      type: 'input',
      name: 'addEmployeeFirst',
      message: "What's the first name?",
      when: (answers) => answers.toDo === 'Add Employees'
    },
    {
      type: 'input',
      name: 'addEmployeeLast',
      message: "whats the last name?",
      when: (answers) => answers.toDo === 'Add Employees'
      
    },
    {
      type: 'list',
      name: 'Role',
      message: "Whats is the employees role?",
      choices: roles,
      when: (answers) => answers.toDo === 'Add Employees'
    },
    {
      type: 'list',
      name: 'Employee',
      message: "Select Employee",
      choices: employees,
      when: (answers) => answers.toDo === 'Update Employee Role'
    },
    {
      type: 'list',
      name: 'newRole',
      message: "Whats is the employees new role?",
      choices: roles,
      when: (answers) => answers.toDo === 'Update Employee Role'
    },
    {
      type: 'list',
      name: 'Manager',
      message: "who is the employees manager?",
      choices: employees,
      when: (answers) => answers.toDo === 'Add Employees'
    },
    {
      type: 'input',
      name: 'addDepartments',
      message: "what is the name of the department you wish to add?",
      when: (answers) => answers.toDo === 'Add Department'
     },
	 {
      type: 'input',
      name: 'addRole',
      message: "What's the name of the role you wish to add?",
      when: (answers) => answers.toDo === 'Add Role'
    },
    {
      type: 'input',
      name: 'addRoleSal',
      message: "What's the salary of this role?",
      when: (answers) => answers.toDo === 'Add Role'
    },
    {
      type: 'list',
      name: 'addRoleDep',
      choices: departments,
      message: "What department will this role be under?",
      when: (answers) => answers.toDo === 'Add Role'
    },
  ];

// TODO: Create a function to write README file
function writeToFile(fileName, data) {}

// TODO: Create a function to initialize app
function init() {
    console.info("init");
    initQuestions();
}
function initQuestions(){
	inquirer.prompt(questions)
		.then((answers) => {
			//console.log(JSON.stringify(answers, null, '  '));
			team.push(answers);
      //'Add Employees','Update Employee Role','View All Roles','Add Role','View All Departments','Add Department','Quit'
      switch(answers.toDo){
        case 'Add Employees':
          connection.connect(function(err) {
            if (err) throw err;
            var sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('"+answers.addEmployeeFirst +"', '"+answers.addEmployeeLast +"', '"+answers.Role +"', '"+answers.Manager +"')";
            connection.query(sql, function (err, result) {
              if (err) throw err;
              
            });
            loadData();
            console.info("1 record inserted");
            initQuestions();
          });
          break;
        case 'Update Employee Role':
          connection.connect(function(err) {
            if (err) throw err;
            var sql = "UPDATE employee SET role_id = "+answers.newRole+" WHERE id = "+answers.Employee;
            connection.query(sql, function (err, result) {
              if (err) throw err;
              
            });
            loadData();
            console.info("1 record inserted");
            initQuestions();
          });
            break;
        case 'View All Roles':
          connection.query(
            'SELECT * FROM `role`',
            function(err, results, fields) {
              const roleTable = cTable.getTable(results);
              console.info(roleTable);
              loadData();
              initQuestions();
            }
          );   
          break;
          case 'View All Employees':
            connection.query(
              'SELECT * FROM `employee`',
              function(err, results, fields) {
                const employeeTable = cTable.getTable(results);
                console.info(employeeTable);
                loadData();
                initQuestions();
              }
            );   
            break;  
        case 'Add Role':
          connection.connect(function(err) {
            if (err) throw err;
            var sql = "INSERT INTO role (title, salary, department_id) VALUES ('"+answers.addRole +"', '"+answers.addRoleSal +"', '"+answers.addRoleDep+"')";
            connection.query(sql, function (err, result) {
              if (err) throw err;
              
            });
            loadData();
            console.info("1 record inserted");
            initQuestions();
          });
          break;
        case 'View All Departments':
          connection.query(
            'SELECT * FROM `department`',
            function(err, results, fields) {
              const departmentsTable = cTable.getTable(results);
              console.info(departmentsTable);
              loadData();
              initQuestions();
            }
          );           
           
          break;
        case 'Add Department':
          connection.connect(function(err) {
            if (err) throw err;
            var sql = "INSERT INTO department (name) VALUES ('"+answers.addDepartments +"')";
            connection.query(sql, function (err, result) {
              if (err) throw err;
              
            });
            loadData();
            console.info("1 record inserted");
            initQuestions();
          });
          break;
        default:
        console.info('Good Bye....');
        exit();
      }			
      });
}
function loadData(){
departments = [];
roles = [];
employees = [];
	connection.query(
    'SELECT * FROM `role`',
    function(err, results, fields) {
      for(var d = 0; d<results.length;d++){
        var option = {};
        option.name = results[d].title;
        option.value = results[d].id;  
        roles.push(option);
      }
    }
  );
  connection.query(
    'SELECT * FROM `department`',
    function(err, results, fields) {
      for(var d = 0; d<results.length;d++){
        var option = {};
        option.name = results[d].name;
        option.value = results[d].id;  
        departments.push(option);
      }
    }
  );
  connection.query(
    'SELECT * FROM `employee`',
    function(err, results, fields) {
      for(var d = 0; d<results.length;d++){
        var option = {};
        option.name = results[d].first_name + ' ' +  results[d].last_name;
        option.value = results[d].id;  
        employees.push(option);
      }
    }
  );
}
function createHTML(){            
			var cards = '';	
			for(var e=0; e<team.length; e++){
        console.info("adding team member...")
				cards += '<div class="col-4">';
  				cards += '<div class="card mx-auto border-info mb-3" style="max-width: 18rem;">';
    			cards += '<div class="card-header text-center h4">'+ team[e].fullName +'</div>';
    			cards += '<div class="card-header text-center"><i class="fas fa-user"></i>';
      			cards += '<div class="card-body text-info">';
        		cards += '<h5 class="card-title">Employee Information:</h5>';
        		cards += '<p class="card-text">ID: '+ team[e].eID+'</p>';
        		cards += '<p class="card-text">Email: <a href="mailto:'+ team[e].email+'">'+ team[e].email+'</a></p>';
        		cards += '<p class="card-text">Role: '+ team[e].role+'</p>';
				if(team[e].role=='manager'){
				   cards += '<p class="card-text"><i class="fa fa-phone"></i> '+ team[e].officeNumber+'</p>';
				}
        		if(team[e].role=='engineer'){
				   cards += '<p class="card-text"><a href="https://github.com/'+ team[e].github+'"><i class="fa fa-github"></i> '+ team[e].github+'</a></p>';
				}
				if(team[e].role=='intern'){
				   cards += '<p class="card-text"><i class="fa fa-school"></i> '+ team[e].school+'</p>';
				}
      			cards += '</div>';
    			cards += '</div>';
  				cards += '</div>';
				cards += '</div>';
				
			}	


      //searchReplaceFile(/REPLACE/g, cards, 'template/html.html', 'team.html'); 
}

function searchReplaceFile(regexpFind, replace, templateFile, outputFile) {
  var file = fs.createReadStream(templateFile, 'utf8');
  var newHTML = '';

  file.on('data', function (chunk) {
    newHTML += chunk.toString().replace(regexpFind, replace);
  });

  file.on('end', function () {
      fs.writeFile(outputFile, newHTML, function(err) {
          if (err) {
              return console.log(err);
          } else {
              console.log('Updated!');
          }
  });
});

}

// Function call to initialize app
init();