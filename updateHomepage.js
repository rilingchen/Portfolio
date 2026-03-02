const fs = require('fs');


const config = {
    'projects':{
        template: 'homeTemplate.html',
        fileName: 'index.html', 
        data: 'data.json', 
        baseDir:'projects'
    }, 
    'workProjects':{
        template: 'workTemplate.html',
        fileName: 'work.html', 
        data: 'workData.json',
        baseDir:'work'
    }
}
const allProjects = ['projects', 'workProjects'];

//Go through projects and work Projects
allProjects.forEach(dirType=>{
    const projects = JSON.parse(fs.readFileSync(config[dirType].data, 'utf8'));
    const template = fs.readFileSync(config[dirType].template, 'utf8');
    const {nav, gal} = writeHTML(projects, dirType);
    replaceHTML(template, config[dirType].fileName, nav, gal);
})


// function to go through projects and write new html
function writeHTML(projects, dir){
    // reset variables for each directory
    let nav = {spacesNav: '', objectsNav: '', communitiesNav: '', experimentsNav: ''};
    let gal = {spacesGal:'', objectsGal: '', communitiesGal: '', experimentsGal: ''};

    Object.keys(projects).forEach(key => {
        let newProject = projects[key];
        const dirBase = config[dir].baseDir;
        let navItem = `<li id="scroll-to-${key}">${newProject.title}</li>`;
        let display;

        // find out what the display caption is
        if (newProject.course) {
            display = newProject.course;
        } else if (newProject.office) {
            display = newProject.office;
        } else {
            display = newProject.medium;
        }

        let html = `
            <section class="proj-item">
                <a class="proj-link" href="${dirBase}/${key}/index.html">
                    <img id="${key}" src="${dirBase}/${key}/images/${newProject.images[0]}" alt="${newProject.title} Image">
                    <div class="proj-info-wrapper">
                        <h2 class="proj-name">${newProject.title}</h2>
                        <div class="proj-info">
                            <p class="proj-course">${display}</p>
                        </div>
                    </div>
                </a>
            </section>`;
        switch (newProject.category) {
            case 'spaces':
                nav.spacesNav += navItem;
                gal.spacesGal += html;
                break;
            case 'objects':
                nav.objectsNav += navItem;
                gal.objectsGal += html;
                break;
            case 'communities':
                nav.communitiesNav += navItem;
                gal.communitiesGal += html;
                break;
            case 'experiments':
                nav.experimentsNav += navItem;
                gal.experimentsGal += html;
                break;
        }
    });
    return {nav, gal};
}
    

// functon to replace html
function replaceHTML(template, fileName, nav, gal){
    let finalHTML = template
    .replace('{{spacesNav}}', nav.spacesNav)
    .replace('{{objectsNav}}', nav.objectsNav)
    .replace('{{communitiesNav}}', nav.communitiesNav)
    .replace('{{experimentsNav}}', nav.experimentsNav)
    .replace('{{spacesGal}}', gal.spacesGal)
    .replace('{{objectsGal}}', gal.objectsGal)
    .replace('{{communitiesGal}}', gal.communitiesGal)
    .replace('{{experimentsGal}}', gal.experimentsGal);
    fs.writeFileSync(fileName, finalHTML, 'utf8');
}

console.log('Homepage updated successfully!');
console.log('Workpage updated successfully!');


// Contact Form (forward to email)
// Create locked portion of website 