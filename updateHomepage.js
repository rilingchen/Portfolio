const fs = require('fs');
const template = fs.readFileSync('homeTemplate.html', 'utf8'); // Use your homepage template
const projects = JSON.parse(fs.readFileSync('data.json', 'utf8'));

let spacesNav = '', objectsNav = '', communitiesNav = '', experimentsNav = '';
let spacesGal = '', objectsGal = '', communitiesGal = '', experimentsGal = '';

Object.keys(projects).forEach(key => {
    let newProject = projects[key];
    let navItem = `<li id="scroll-to-${key}">${newProject.title}</li>`;
    let html = `
        <section class="proj-item">
            <a class="proj-link" href="projects/${key}/index.html">
                <img id="${key}" src="projects/${key}/images/${newProject.images[0]}" alt="${newProject.title} Image">
                <div class="proj-info-wrapper">
                    <h2 class="proj-name">${newProject.title}</h2>
                    <div class="proj-info">
                        <p class="proj-course">${newProject.courseName}</p>
                        <p class="proj-collaborators">${newProject.collaborators}</p>
                    </div>
                </div>
            </a>
        </section>`;
    switch (newProject.category) {
        case 'spaces':
            spacesNav += navItem;
            spacesGal += html;
            break;
        case 'objects':
            objectsNav += navItem;
            objectsGal += html;
            break;
        case 'communities':
            communitiesNav += navItem;
            communitiesGal += html;
            break;
        case 'experiments':
            experimentsNav += navItem;
            experimentsGal += html;
            break;
    }
});

let finalHTML = template
    .replace('{{spacesNav}}', spacesNav)
    .replace('{{objectsNav}}', objectsNav)
    .replace('{{communitiesNav}}', communitiesNav)
    .replace('{{experimentsNav}}', experimentsNav)
    .replace('{{spacesGal}}', spacesGal)
    .replace('{{objectsGal}}', objectsGal)
    .replace('{{communitiesGal}}', communitiesGal)
    .replace('{{experimentsGal}}', experimentsGal);

fs.writeFileSync('index.html', finalHTML, 'utf8');
console.log('Homepage updated successfully!');

// Contact Form (forward to email)
// Create locked portion of website 