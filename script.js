// 1.Prevent right-click on all images
document.addEventListener('contextmenu', function(e) {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

// 2. Highlight the current project in the navigation
// When the image scrolls into view, highlight the corresponding navigation item
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const imgID = entry.target.id;
            const navItem = document.querySelector(`li#scroll-to-${imgID}`);
            const parentId = navItem.parentElement.id.replace('-list', '');
            const catItem = document.getElementById(parentId);
            const currentProj = document.querySelector(`.highlight`);
            const currentCat = document.querySelector(`.cat-active`);
            if (navItem) {
                // Remove highlight from item with the class
                if (currentProj) {
                    currentProj.classList.remove('highlight');
                    currentCat.classList.remove('cat-active');
                }
                // Add highlight to the current item
                navItem.classList.add('highlight');
                catItem.classList.add('cat-active');
            }
        };
    });
}, { threshold: 0.5 });

const projectImages = document.querySelectorAll('.proj-item img');
projectImages.forEach(image => {
    observer.observe(image);
});

//Add click event to the category headings
const catHeadings = document.querySelectorAll('.proj-category h2');
catHeadings.forEach(cat => {
    scrollToFirstProject(cat);
});

function addClick(link, scrollToID) {
    link.addEventListener('click', () => {
        document.getElementById(scrollToID).scrollIntoView({behavior: 'smooth'});
    });
};

function scrollToFirstProject(category) {
    const catItem = category.id;
    const list = document.querySelector(`#${catItem}-list`);
    const firstProj = list.querySelector(`li`);
    console.log(firstProj);
    if (!firstProj) return; // If no projects in the category, do nothing
    
    const firstProjID = firstProj.id.replace('scroll-to-', ''); 
    console.log(category);
    addClick(category, firstProjID);
}

//add click event to each project item in the navigation
const projectItems = document.querySelectorAll('.proj-category li');


projectItems.forEach(item => {
    const imgID = item.id.replace('scroll-to-', '');
    const img = document.getElementById(imgID);
    if (!img) return; // If no image with that ID, do nothing
    addClick(item, imgID);
});



// Project Page Animations
// 2. Hide all images, except the first one
const images = document.querySelectorAll('.image-stack img, .image-stack video');
const vid = document.querySelectorAll('.image-stack video');
let currentIndex = 0; // Track the current image index

function hideImages(images, currentIndex){
    images.forEach((img, i) => {
        if (i !== currentIndex) {
            img.className = 'hide';
            if (img.tagName === 'VIDEO') img.pause();
        } else {
            img.className = 'current-image';
            if (img.tagName === 'VIDEO') img.play();
        }
    });
}

function showImageCount(currentIndex, totalImages) {
    const imgNumber = document.querySelector('.proj-img-number');
    imgNumber.textContent = `${currentIndex + 1}/${totalImages}`;
}

// 3. create a function where clicking on the next or previous button will show the next or previous image
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
const gallery = document.querySelector('.proj-pg-gallery');
const imagesCount = images.length;

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    hideImages(images, currentIndex);
    showImageCount(currentIndex,imagesCount);
});

prevBtn.addEventListener('click', () => {
    if (currentIndex == 0) {
        currentIndex = images.length - 1; // Wrap around to the last image
    } else {
        currentIndex = (currentIndex - 1) % images.length;
    }
    hideImages(images, currentIndex);
    showImageCount(currentIndex,imagesCount);
    
});

if (gallery){
    gallery.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        nextBtn.click();
      } else {
        prevBtn.click();
      }
    showImageCount(currentIndex,imagesCount);
    });
};

//add keypress event listener
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        nextBtn.click();
    } else if (e.key === 'ArrowLeft') {
        prevBtn.click();
    }
});

// 4. Add a swipe to all project page galleries for touchscreen devices
if ('ontouchstart' in window) {
    // Show swipe hint
    const swipeHint = document.createElement('p');
    const scrollHint = document.createElement('p');
    swipeHint.textContent = '→ Swipe to scroll through gallery';
    scrollHint.textContent = '↓ Scroll down for description'
    swipeHint.classList.add('instructions');
    scrollHint.classList.add('instructions');
    document.querySelector('.proj-pg-gallery').after(swipeHint);
    document.querySelector('.proj-pg-gallery').after(scrollHint);

    // Hide hint after first swipe
    gallery.addEventListener('touchend', () => {
        swipeHint.style.display = 'none';
    }, { once: true });

    // Hide scroll hint after first scroll
    window.addEventListener('scroll', () => {
        scrollHint.style.display = 'none';
    }, { once: true });
}

// Swipe detection for gallery
let touchStartX = 0;
let touchEndX = 0;

gallery.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

gallery.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50; // minimum px to count as a swipe
    const diff = touchStartX - touchEndX;

    if (diff > swipeThreshold) {
        // swiped left → next image
        nextBtn.click();
    } else if (diff < -swipeThreshold) {
        // swiped right → previous image
        prevBtn.click();
    }
}





// 4. Unmute videos on click, show unmute button on hover
vid.addEventListener('click', () => {
  vid.muted = !vid.muted;
  vid.title = vid.muted ? 'Unmute' : 'Mute';
});
