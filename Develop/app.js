const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer.js");
const { listenerCount } = require("process");

var teamList = [];
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const initPrompt = [
  {
    type: "list",
    name: "role",
    message: "What is the role of the employee?",
    choices: ["Manager", "Engineer", "Intern"],
  },
];

const managerPrompt = [
  {
    type: "input",
    message: "Please enter the name of the manager.",
    name: "name",
  },
  {
    type: "input",
    message: "Please enter the ID of the manager.",
    name: "id",
  },
  {
    type: "input",
    message: "Please enter a valid email address for the manager.",
    name: "email",
    validate: function (input) {
      const re = /\S+@\S+\.\S+/
      if (re.test(input)) {
        return true;
      } else {
        return "Invalid email.";
      }
    },
  },
  {
    type: "input",
    message: "Please enter the office number for the manager.",
    name: "officeNumber",
    validate: function (input) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
        if (re.test(input)) {
          return true;
        } else {
          return "Invalid email.";
        }
      },
  },
  {
    type: "list",
    name: "addEmployee",
    message: "Would you like to add another employee?",
    choices: ["Yes", "No"],
  },
];

const engineerPrompt = [
  {
    type: "input",
    message: "Please enter the name of the engineer.",
    name: "name",
  },
  {
    type: "input",
    message: "Please enter the ID of the engineer.",
    name: "id",
  },
  {
    type: "input",
    message: "Please enter a valid email address for the engineer.",
    name: "email",
  },
  {
    type: "input",
    message: "Please enter a valid github username for the engineer.",
    name: "github",
  },
  {
    type: "list",
    name: "addEmployee",
    message: "Would you like to add another employee?",
    choices: ["Yes", "No"],
  },
];

const internPrompt = [
  {
    type: "input",
    message: "Please enter the name of the intern?",
    name: "name",
  },
  {
    type: "input",
    message: "Please enter the ID of the intern.",
    name: "id",
  },
  {
    type: "input",
    message: "Please enter a valid email address for the intern.",
    name: "email",
  },
  {
    type: "input",
    message: "Please enter a the school the intern attends.",
    name: "school",
  },
  {
    type: "list",
    name: "addEmployee",
    message: "Would you like to add another employee?",
    choices: ["Yes", "No"],
  },
];

function buildTeam() {
  inquirer.prompt(initPrompt).then((answers) => {
    console.log(answers);
    if (answers.role === "Manager") {
      inquirer
        .prompt(managerPrompt)
        .then((managerInfo) => {
          console.log("manger info", managerInfo);
          let teamManager = new Manager(
            managerInfo.name,
            managerInfo.id,
            managerInfo.email,
            managerInfo.officeNumber
          );
          teamList.push(teamManager);
          if (managerInfo.addEmployee === "Yes") {
            buildTeam();
          } else {
            console.log(teamList);
            fs.writeFileSync("output.html", render(teamList), "utf8");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (answers.role === "Engineer") {
      inquirer.prompt(engineerPrompt).then((engineerInfo) => {
        let newEngineer = new Engineer(
          engineerInfo.name,
          engineerInfo.id,
          engineerInfo.email,
          engineerInfo.github
        );
        teamList.push(newEngineer);
        if (engineerInfo.addEmployee === "Yes") {
          buildTeam();
        } else {
          console.log(teamList);
          fs.writeFileSync("output.html", render(teamList), "utf8");
        }
      });
    } else {
      inquirer.prompt(internPrompt).then((internInfo) => {
        let newIntern = new Intern(
          internInfo.name,
          internInfo.id,
          internInfo.email,
          internInfo.school
        );
        teamList.push(newIntern);
        if (internInfo.addEmployee === "Yes") {
          buildTeam();
        } else {
          console.log(teamList);
          fs.writeFileSync("output.html", render(teamList), "utf8");
        }
      });
    }
  });
}

buildTeam();
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!
render(teamList);
// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
