const fs = require('fs');
const path = require('path'); 
const projectDir = path.join(__dirname, 'projects'); 

let projects = {};

/*1. Update homepage with new projects */
fs.readdirSync(projectDir).forEach(folder => {
    // Add info.txt to the folder path name
    const filePath = path.join(projectDir, folder, 'info.txt');
    const imgPath = path.join(projectDir, folder, 'images'); 
    const imgArr = [];

    if (fs.existsSync(filePath)) {
        const newProjectString = fs.readFileSync(filePath, 'utf8');
        const newProject = JSON.parse(newProjectString);
        const newKey = Object.keys(newProject)[0];
        
        projects[newKey] = newProject[newKey]; 
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
        projects[newKey]['images'] = imgArr; 
    };
});

fs.writeFileSync('data.json', JSON.stringify(projects)); // Write the projects object to data.json

/*2. Write a new index.html project file based on changes to data */



