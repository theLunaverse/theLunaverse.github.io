document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const missionButtons = document.querySelectorAll('.mission-button');
    const missionSections = document.querySelectorAll('.mission-section');
    
    // Function to pause all videos
    function pauseAllVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
        });
    }
    
    pauseAllVideos();
    
    // Play the video for the active section (on page load)
    const initialActiveSection = document.querySelector('.mission-section.active');
    if (initialActiveSection) {
        const initialVideo = initialActiveSection.querySelector('video');
        if (initialVideo) {
            // Reset to beginning and play
            initialVideo.currentTime = 0;
            initialVideo.play().catch(error => {
                console.warn('Auto-play was prevented:', error);
                // Add a play button overlay if autoplay is blocked
                addPlayButtonOverlay(initialActiveSection, initialVideo);
            });
        }
    }
    
    // Add click event listeners to tab buttons
    missionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            missionButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Pause all videos
            pauseAllVideos();
            
            // Hide all mission sections
            missionSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the corresponding mission section
            const missionId = this.getAttribute('data-mission');
            const activeSection = document.getElementById(`${missionId}-section`);
            activeSection.classList.add('active');
            
            // Play the video for the selected section
            const activeVideo = activeSection.querySelector('video');
            if (activeVideo) {
                // Reset to beginning and play
                activeVideo.currentTime = 0;
                activeVideo.play().catch(error => {
                    console.warn('Auto-play was prevented:', error);
                    // Add a play button overlay if autoplay is blocked
                    addPlayButtonOverlay(activeSection, activeVideo);
                });
            }
        });
    });
    
    // Function to add a play button overlay (for browsers that block autoplay)
    function addPlayButtonOverlay(section, video) {
        // Check if overlay already exists
        if (section.querySelector('.video-play-overlay')) return;
        
        const overlay = document.createElement('div');
        overlay.className = 'video-play-overlay';
        overlay.innerHTML = '<div class="play-button"><i class="fas fa-play"></i></div>';
        section.querySelector('.mission-background').appendChild(overlay);
        
        overlay.addEventListener('click', function() {
            video.play().then(() => {
                // Remove overlay when video plays
                overlay.remove();
            }).catch(error => {
                console.error('Video play failed:', error);
            });
        });
    }
    
    // Add a small animation effect when hovering over statistics
    const statisticItems = document.querySelectorAll('.statistic-item');
    statisticItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Scale up slightly and add a glow effect
            this.querySelector('.statistic-number').style.transform = 'scale(1.05)';
            this.querySelector('.statistic-number').style.textShadow = '0 0 15px rgba(255, 215, 0, 0.7)';
        });
        
        item.addEventListener('mouseleave', function() {
            // Return to normal
            this.querySelector('.statistic-number').style.transform = 'scale(1)';
            this.querySelector('.statistic-number').style.textShadow = 'none';
        });
    });
});

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
});
