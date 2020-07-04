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
      const re = /\S+@\S+\.\S+/;
      if (re.test(input)) {
        return true;
      } else {
        return "Invalid email. Please re-enter.";
      }
    },
  },
  {
    type: "input",
    message: "Please enter the office number for the manager. Example: 1234567890",
    name: "officeNumber",
    validate: function (input) {
      const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      if (re.test(input)) {
        return true;
      } else {
        return "Invalid office number. Please re-enter a valid office number. Example: 1234567890";
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
    validate: function (input) {
      const re = /\S+@\S+\.\S+/;
      if (re.test(input)) {
        return true;
      } else {
        return "Invalid email. Please re-renter";
      }
    },
  },
  {
    type: "input",
    message: "Please enter a github username for the engineer.",
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
    validate: function (input) {
      const re = /\S+@\S+\.\S+/;
      if (re.test(input)) {
        return true;
      } else {
        return "Invalid email. Please re-enter. ";
      }
    },
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
            fs.writeFileSync("team.html", render(teamList), "utf8");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (answers.role === "Engineer") {
      inquirer
        .prompt(engineerPrompt)
        .then((engineerInfo) => {
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
            fs.writeFileSync("team.html", render(teamList), "utf8");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      inquirer
        .prompt(internPrompt)
        .then((internInfo) => {
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
            fs.writeFileSync("team.html", render(teamList), "utf8");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

buildTeam();
render(teamList);

