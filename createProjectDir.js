//Create Project Directory
const fs = require('fs');
const path = require('path');
const projTemplate = fs.readFileSync('projects/infoTemplate.txt', 'utf8');
const workProjTemplate = fs.readFileSync('work/infoTemplate.txt', 'utf8');

const args = process.argv.slice(2); // Get project keys from command line arguments e.g. ['project1', 'project2']
if (args.length < 2) {
    console.error('Please provide the directory name (project or workProject) followed by a project name.');
    process.exit(1);
}

//Assign variables to each command line input 
const [dirType, ...projectKeys] = args;

// Map directory types to templates
const config = {
    project:{
        baseDir:'projects',
        templatePath:'projects/infoTemplate.txt'
    },
    workProject:{
        baseDir:'work',
        templatePath:'work/infoTemplate.txt'
    }
}

// Validate directory type
if (!config[dirType]) {
  console.error(`Invalid directory type: ${dirType}`);
  console.error(`Allowed types: ${Object.keys(config).join(', ')}`);
  process.exit(1);
}

// Load correct template
const template = fs.readFileSync(config[dirType].templatePath, 'utf8');
projectKeys.forEach(projectKey => {
    const projectDir = path.join(__dirname, config[dirType].baseDir, projectKey);
    
    // Check if the directory already exists
    if (fs.existsSync(projectDir)) {
        console.error(`Directory for ${projectKey} already exists.`);
        return;
    }

    // Create the project directory
    fs.mkdirSync(projectDir, { recursive: true });
    
    // Create subdirectories for images and other assets
    fs.mkdirSync(path.join(projectDir, 'images'), { recursive: true });
    
    // Create an info.txt file with basic project information
    const infoFilePath = path.join(projectDir, 'info.txt');
    const infoContent = template.replace('{{projKey}}', projectKey);
    
    fs.writeFileSync(infoFilePath, infoContent);
    
    console.log(`${dirType} directory ${projectKey} created successfully!`);
});