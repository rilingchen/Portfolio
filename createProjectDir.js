//Create Project Directory
const fs = require('fs');
const path = require('path');
const template = fs.readFileSync('projects/infoTemplate.txt', 'utf8');

const args = process.argv.slice(2); // Get project keys from command line arguments e.g. ['project1', 'project2']
if (args.length === 0) {
    console.error('Please provide a project name.');
    process.exit(1);
}

args.forEach(projectKey => {
    const projectDir = path.join(__dirname, 'projects', projectKey);
    
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
    
    console.log(`Project directory ${projectKey} created successfully!`);
});