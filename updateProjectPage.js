const fs = require('fs');
const template = fs.readFileSync('projects/projTemplate.html', 'utf8'); 
const projects = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const args = process.argv.slice(2); // Get project keys from command line arguments e.g. ['project1', 'project2']
const keysToUpdate = args.length > 0 ? args : Object.keys(projects); 

keysToUpdate.forEach(key => {
    const thisProject = projects[key];
    let finalHTML = '';
    let projGallery = '';
    let imgNumber = '';

    if (!thisProject) {
        console.error(`${key} does not exist.`);
        return;
    }

    //Update Image Gallery
    thisProject.images.forEach((image, i) => {
        const className = i===0? 'current-image' : 'hide';
        const projImage = `<img src="images/${image}" alt="${image}" class="${className}">`;
        projGallery += projImage; 
    });

    imgNumber = `1/${thisProject.images.length}`;

    finalHTML = template
                .replace('{{image-stack}}', projGallery)
                .replace(/{{title}}/g, thisProject.title)
                .replace('{{description}}', thisProject.description)
                .replace('{{course}}', thisProject.courseName)
                .replace('{{image-number}}', imgNumber)
                .replace('{{collaborators}}', thisProject.collaborators);

    const filePath = `projects/${key}/index.html`;

    // Update project title and description
    fs.writeFileSync(filePath, finalHTML, 'utf8');
    console.log(`Updated ${key} page successfully!`);

});
