const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2); // Get directory type and project keys from command line

//Config 
const config = {
    projects: {
        templatePath: 'projects/projTemplate.html',
        dataPath: 'data.json',
        baseDir: 'projects'
    },
    workProjects: {
        templatePath: 'work/projTemplate.html',
        dataPath: 'workData.json',
        baseDir: 'work'
    }
}
const validTypes = Object.keys(config);

let typesToUpdate=[];
let keysToUpdate=[];

// If no projects or directory specified, update everything
if (args.length > 0 && validTypes.includes(args[0])){
    typesToUpdate = [args[0]];
    keysToUpdate=args.slice(1);
}else{
    typesToUpdate = validTypes;
}


// loop through typesToUpdate
typesToUpdate.forEach(dirType=>{
    const template = fs.readFileSync(config[dirType].templatePath, 'utf8');
    const data = JSON.parse(fs.readFileSync(config[dirType].dataPath, 'utf8'));
    updateProjects(keysToUpdate, dirType, data, template);
})

// function to update projects
function updateProjects(projectKeys, dir, projectData, temp){
    projectKeys = projectKeys.length > 0 ? projectKeys : Object.keys(projectData);
    projectKeys.forEach(key => {
        const thisProject = projectData[key];
        const projInfoLabels = Object.keys(thisProject);
        const projectPath = path.join(__dirname, config[dir].baseDir, key, 'index.html');
        let infoHTML='';
        projInfoLabels.forEach(label=>{
            if (thisProject[label] && label != "images" && label != "description"){
                infoHTML+= `<section class="proj-txt-wrapper">
                    <h5>${label}</h5>
                    <p>${thisProject[label]}</p>
                </section>`
            }
        })
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
            //change type if its a video vs image
            const ext = image.split('.').pop().toLowerCase();
            if (ext == 'mp4'){
                const projVid = `<video autoplay muted loop playsinline preload = "none" title="Mute"> <source src="images/${image}" alt="${image}"class="${className}" type="video/mp4" > </video>`
                projGallery +=projVid;
            }else{
                const projImage = `<img src="images/${image}" alt="${image}" class="${className}">`;
                projGallery += projImage; 
            }
        });

        imgNumber = `1/${thisProject.images.length}`;
        

        finalHTML = temp
                    .replace('{{image-stack}}', projGallery)
                    // this replaces all occurrences of title, not just the first one
                    .replace(/{{title}}/g, thisProject.title)
                    .replace('{{projInfo}}', infoHTML)
                    .replace('{{description}}', thisProject.description.replace(/\n/g, '<br>'))
                    .replace('{{image-number}}', imgNumber);

        // Update project title and description
        fs.writeFileSync(projectPath, finalHTML, 'utf8');
        console.log(`Updated ${key} page successfully!`);
    });
}


