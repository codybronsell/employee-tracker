import inquirer from 'inquirer';
import fs from 'fs';
// TODO: Create an array of questions for user input
const team = [];
const questions = [
  {
    type: 'list',
    name: 'toDo',
    message: "what do you want to do?",
    choices: ['Add Employees','Update Employee Role','View All Roles','Add Role','View All Departments','Add Department','Quit'],
  },
    {
      type: 'input',
      name: 'addEmployeeFirst',
      message: "What's thefirst name?",
    },
    {
      type: 'input',
      name: 'addEmployeeLast',
      message: "whats the last name?"
      
    },
    {
      type: 'list',
      name: 'Role',
      message: "Whats is the employees role?",
      choices: ['Sales Lead','Salesperson','Lead Engineer','Software Engineer','Account Manager','Accountant','Legal Team Lead','Lawyer','Customer Service',],
    },
    {
      type: 'list',
      name: 'Manager',
      message: "who is the employees manager?",
      choices: ['none','add names','add names','Sadd names','Account Manager','Accountant','Legal Team Lead','Lawyer','Customer Service',],
    },
    {
      type: 'input',
      name: 'addDepartments',
      message: "what is the name of the department you wish to add?",
     },
	 {
      type: 'input',
      name: 'addRole',
      message: "What's the name of the role you wish to add?",
    },
    {
      type: 'input',
      name: 'addRoleSal',
      message: "What's the salary of this role?",
    },
    {
      type: 'input',
      name: 'addRoleDep',
      message: "What department will this role be under?",
    },
	 {
      type: 'input',
      name: 'school',
      message: "What's the name of the school you attend/attended?",
	  when: (answers) => answers.role === 'intern',
    },
	 {
       type: 'list',
       name: 'addMember',
       message: "Do you want to add another team member?",
       choices: ['Yes','No'],
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
			if(answers.addMember=='Yes'){
				initQuestions();
			}else{
				createHTML();
			}
			
      });
}
function secQuestions(){
	
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


      searchReplaceFile(/REPLACE/g, cards, 'template/html.html', 'team.html');
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




