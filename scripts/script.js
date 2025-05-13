document.addEventListener('DOMContentLoaded', () => {
    // Navigation functionality (common to both pages)
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        // Set initial hamburger icon
        navToggle.innerHTML = '☰';
        
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Change icon based on menu state
            navToggle.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            // Reset icon when closing menu
            if (navToggle) {
                navToggle.innerHTML = '☰';
            }
        }
    });
    
    // Stars functionality (only for the home page)
    const container = document.getElementById('container');
    const video = document.getElementById('moonVideo'); // Element only on home page
    
    // Only create stars if we're on the home page (checking for the video element)
    let stars = [];
    if (container && video) {
        function createStar() {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = Math.random() * 3 + 1 + 'px';
            star.style.height = star.style.width;
            star.style.left = Math.random() * window.innerWidth + 'px';
            star.style.top = Math.random() * window.innerHeight + 'px';
            star.style.animation = `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`;
            container.appendChild(star);
            return star;
        }
    
        stars = Array(200).fill().map(() => createStar());
    
        // Parallax effect for stars (only on home page)
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const moonRect = video.getBoundingClientRect();
            const moonCenterX = moonRect.left + moonRect.width / 2;
            const moonCenterY = moonRect.top + moonRect.height / 2;
    
            stars.forEach(star => {
                const speed = parseFloat(star.style.width) / 10;
                const cursorXOffset = (mouseX - window.innerWidth / 2) * speed;
                const cursorYOffset = (mouseY - window.innerHeight / 2) * speed;
                
                const starRect = star.getBoundingClientRect();
                const starX = starRect.left + starRect.width / 2;
                const starY = starRect.top + starRect.height / 2;
                const moonPullStrength = 0.05;
                const moonXOffset = (moonCenterX - starX) * moonPullStrength;
                const moonYOffset = (moonCenterY - starY) * moonPullStrength;
    
                const finalXOffset = cursorXOffset + moonXOffset;
                const finalYOffset = cursorYOffset + moonYOffset;
    
                star.style.transform = `translate(${finalXOffset}px, ${finalYOffset}px)`;
            });
        });
    }
    
    // Home page specific functionality
    if (video) {
        // Video hover functionality
        video.addEventListener('mouseover', () => video.play());
        video.addEventListener('mouseout', () => video.pause());
        video.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (video.paused) video.play();
            else video.pause();
        });
    
        // Carousel functionality
        initCarousel();
    }
    
    // About page specific functionality
    const timelineSection = document.querySelector('.timeline-section');
    if (timelineSection) {
        // Timeline animation
        function animateTimeline() {
            const timelineItems = document.querySelectorAll('.timeline-item');
            timelineItems.forEach(item => {
                if (isElementInViewport(item)) {
                    item.classList.add('visible');
                } else {
                    item.classList.remove('visible');
                }
            });
        }
    
        window.addEventListener('scroll', animateTimeline);
        window.addEventListener('load', animateTimeline);
    
        // Stats counter
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounters();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
    
            observer.observe(statsSection);
        }
    }
});

// Carousel initialization and functionality
function initCarousel() {
const track = document.querySelector('.carousel-track');
if (!track) return; // Exit if not on home page

const slides = Array.from(track.children);
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');
let currentIndex = 0;

function updateCards() {
    slides.forEach((slide, index) => {
        let position = ((index - currentIndex) % slides.length + slides.length) % slides.length;
        
        if(position <= 1 || position === slides.length - 1) {
            slide.style.display = 'block';
            
            if(position === 0) {
                slide.classList.add('active');
                slide.style.transform = 'translateY(-50px) scale(1.1)';
                slide.style.zIndex = '2';
            } else {
                slide.classList.remove('active');
                slide.style.transform = position === slides.length - 1 ? 
                    'translateX(-100%) scale(0.8)' : 'translateX(100%) scale(0.8)';
                slide.style.zIndex = '1';
            }
        } else {
            slide.style.display = 'none';
        }
    });
}

if (nextButton) {
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCards();
    });
}

if (prevButton) {
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCards();
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCards();
    }
    if(e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCards();
    }
});

// Initialize carousel
updateCards();

}

// Stats counter animation
function animateCounters() {
const stats = document.querySelectorAll('.stat-number');
const duration = 1000; // 1 second duration
const frameRate = 60;
const totalFrames = duration * (frameRate / 1000);

stats.forEach(stat => {
    const targetValue = +stat.getAttribute('data-count');
    let currentFrame = 0;

    function easeOutQuad(t) {
        return t * (2 - t);
    }

    function updateCounter() {
        if (currentFrame <= totalFrames) {
            const progress = easeOutQuad(currentFrame / totalFrames);
            const currentValue = Math.round(targetValue * progress);
            stat.textContent = currentValue.toLocaleString();
            currentFrame++;
            requestAnimationFrame(updateCounter);
        } else {
            stat.textContent = targetValue.toLocaleString();
        }
    }

    updateCounter();
});

}

// Check if element is in viewport
function isElementInViewport(el) {
const rect = el.getBoundingClientRect();
const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
return (rect.top <= windowHeight * 0.8 && rect.bottom >= windowHeight * 0.2);
}

// Fade up animation for elements
function checkScroll() {
const elements = document.querySelectorAll('.fade-up');
elements.forEach(element => {
const elementTop = element.getBoundingClientRect().top;
const elementBottom = element.getBoundingClientRect().bottom;
const triggerPoint = window.innerHeight * 0.8;

if (elementTop < triggerPoint && elementBottom > 0) {
    element.classList.add('active');
} else {
    element.classList.remove('active');
}
});

}

// Scroll indicator functionality
document.addEventListener('scroll', function() {
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
if (window.scrollY > 0) {
scrollIndicator.style.display = 'none';
} else {
scrollIndicator.style.display = 'flex';
}
}
});

// Smooth scroll functionality
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function(e) {
e.preventDefault();
const target = document.querySelector(this.getAttribute('href'));
if (target) {
target.scrollIntoView({
behavior: 'smooth'
});
}
});
});

// Add scroll event listeners
window.addEventListener('scroll', checkScroll);
window.addEventListener('load', checkScroll);