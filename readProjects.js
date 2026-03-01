const fs = require('fs');
const path = require('path'); 
const projectDir = path.join(__dirname, 'projects'); 
const workDir = path.join(__dirname, 'work'); 

let projects = {};
let workProjects = {};

/*1. Update homepage with new projects */

function updateDir(dir, projObj){
    fs.readdirSync(dir).forEach(folder => {
        // Add info.txt to the folder path name
        const filePath = path.join(dir, folder, 'info.txt');
        const descPath = path.join(dir, folder, 'description.txt');
        const imgPath = path.join(dir, folder, 'images'); 
        const imgArr = [];
        

        if (fs.existsSync(filePath)) {
            const rawText = fs.readFileSync(filePath, 'utf8');
            const newProject = JSON.parse(rawText);
            const newKey = Object.keys(newProject)[0];
           
            // Read description separately if it exists
            if (fs.existsSync(descPath)) {
                newProject[newKey].description = fs.readFileSync(descPath, 'utf8')
                    .trim()
                    .replace(/\r/g, '');  // remove carriage returns
            }
            
            // Add the new project to the projects object with a unique key name
            projObj[newKey] = newProject[newKey]; 
            console.log(`Added project: ${newKey}`);

            // Check if the image directory exists
            if (fs.existsSync(imgPath)&& fs.readdirSync(imgPath).length > 0) {
                fs.readdirSync(imgPath).forEach((file, i) => {
                    imgArr[i] = file;
                }); 
            }
            else {
                console.log(`Image directory for ${newKey} does not exist.`);
            }
            console.log(imgArr);

            //Add the images as an array to the unique key in the projects object
            projObj[newKey]['images'] = imgArr; 
        };
    });
}

// add all the projects and work pages to the project object
updateDir(projectDir, projects);
updateDir(workDir, workProjects);


fs.writeFileSync('data.json', JSON.stringify(projects)); // Write the projects object to data.json
fs.writeFileSync('workData.json', JSON.stringify(workProjects)); // Write the projects object to data.json





