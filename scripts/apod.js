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

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const apodContainer = document.getElementById('apod-container');
    const dateInput = document.getElementById('apod-date');
    const viewDateBtn = document.getElementById('view-date-btn');
    const randomBtn = document.getElementById('random-btn');
    const loadingEl = document.getElementById('loading');
    
    // Your NASA API Key
    const API_KEY = '92Z9D31r5LhqTH14qNIbPRBG2GM5HQz8XcleNwvA';
    const NASA_APOD_API = 'https://api.nasa.gov/planetary/apod';
    
    // Set date input max to today
    const today = new Date();
    const todayFormatted = formatDateForInput(today);
    dateInput.max = todayFormatted;
    
    // Set min date to when APOD started (June 16, 1995)
    dateInput.min = '1995-06-16';
    
    // Set default date to January 11, 2006
    const defaultDate = '2006-11-01';
    dateInput.value = defaultDate;
    
    // Load the default date's APOD
    getAPOD(defaultDate);
    
    // Event Listeners
    viewDateBtn.addEventListener('click', function() {
        getAPOD(dateInput.value);
    });
    
    // Today's button removed
    
    randomBtn.addEventListener('click', function() {
        // Generate random date between APOD start and today
        const start = new Date('1995-06-16');
        const randomDate = new Date(start.getTime() + Math.random() * (today.getTime() - start.getTime()));
        const randomDateFormatted = formatDateForInput(randomDate);
        
        dateInput.value = randomDateFormatted;
        getAPOD(randomDateFormatted);
    });
    
    // Functions
    function getAPOD(date) {
        // Show loading
        loadingEl.style.display = 'flex';
        
        // Clear previous content (except loading indicator)
        Array.from(apodContainer.children).forEach(child => {
            if (child !== loadingEl) {
                child.remove();
            }
        });
        
        // Build URL with API key and date
        const url = `${NASA_APOD_API}?api_key=${API_KEY}&date=${date}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Hide loading
                loadingEl.style.display = 'none';
                
                // Create APOD content
                const apodContent = document.createElement('div');
                apodContent.className = 'apod-content';
                
                // Handle media (image or video)
                if (data.media_type === 'image') {
                    // For images
                    const img = document.createElement('img');
                    img.src = data.hdurl || data.url;
                    img.alt = data.title;
                    img.className = 'apod-media';
                    
                    // Add click to view full size
                    img.addEventListener('click', function() {
                        window.open(data.hdurl || data.url, '_blank');
                    });
                    
                    apodContent.appendChild(img);
                } else if (data.media_type === 'video') {
                    // For videos (usually YouTube)
                    const videoContainer = document.createElement('div');
                    videoContainer.className = 'apod-video-container';
                    
                    const iframe = document.createElement('iframe');
                    iframe.src = data.url;
                    iframe.title = data.title;
                    iframe.frameBorder = '0';
                    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                    iframe.allowFullscreen = true;
                    
                    videoContainer.appendChild(iframe);
                    apodContent.appendChild(videoContainer);
                }
                
                // Create and append info section - now with just title and date
                const infoSection = document.createElement('div');
                infoSection.className = 'apod-info';
                
                const title = document.createElement('h2');
                title.className = 'apod-title';
                title.textContent = data.title;
                
                const dateDisplay = document.createElement('p');
                dateDisplay.className = 'apod-date';
                dateDisplay.textContent = formatDateForDisplay(date);
                
                // Only add title and date, no explanation text
                infoSection.appendChild(title);
                infoSection.appendChild(dateDisplay);
                
                apodContent.appendChild(infoSection);
                apodContainer.appendChild(apodContent);
            })
            .catch(error => {
                console.error('Error fetching APOD:', error);
                loadingEl.style.display = 'none';
                
                // Show error message
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Sorry, there was an error loading the astronomy picture. Please try again later.';
                apodContainer.appendChild(errorMsg);
            });
    }
    
    // Helper Functions
    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    function formatDateForDisplay(dateString, short = false) {
        const date = new Date(dateString);
        
        if (short) {
            // Short format: "Nov 5"
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
            // Full format: "November 5, 2023"
            return date.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
    }
});