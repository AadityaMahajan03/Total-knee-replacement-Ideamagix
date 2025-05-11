document.addEventListener('DOMContentLoaded', function() {
    
    initializePage();
    
    
    setupSmoothScrolling();
    
    
    setupScrollSpy();
    
   
    setupFaqAccordion();
});

function initializePage() {
    // Remove page loader when page is fully loaded
    window.addEventListener('load', function() {
        const pageLoader = document.querySelector('.page-loader');
        if (pageLoader) {
            setTimeout(function() {
                pageLoader.style.opacity = '0';
                setTimeout(function() {
                    pageLoader.style.display = 'none';
                }, 500);
            }, 1000);
        }
    });
}


function setupSmoothScrolling() {
    // Get all tab items and setup click handlers
    const tabItems = document.querySelectorAll('.tab-item');
    
    tabItems.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
        
            const targetId = this.getAttribute('data-tab');
            const targetSection = document.querySelector(`[data-section="${targetId}"]`);
            
            if (!targetSection) return;
           
            setActiveTab(this);
            
      
            scrollToSection(targetSection);
        });
    });
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not(.tab-item)');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetSection = document.querySelector(href);
            if (!targetSection) return;
            

            scrollToSection(targetSection);
        
            const sectionId = targetSection.getAttribute('data-section');
            if (sectionId) {
                const correspondingTab = document.querySelector(`.tab-item[data-tab="${sectionId}"]`);
                if (correspondingTab) {
                    setActiveTab(correspondingTab);
                }
            }
        });
    });
}

/**
 * Scroll to target section with smooth animation
 */
function scrollToSection(targetElement) {
    if (!targetElement) return;
    
    // Calculate header height for offset
    const tabsSection = document.querySelector('.tabs-section');
    const headerOffset = tabsSection ? tabsSection.offsetHeight : 0;
    
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // 20px extra padding
    
    // Smooth scroll to the target
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

/**
 * Set up scroll spy to update active tab based on scroll position
 */
function setupScrollSpy() {
    // Add data-section attributes to content sections
    const contentSections = document.querySelectorAll('.treatment-content');
    const tabItems = document.querySelectorAll('.tab-item');
    
    // Map tab items to their content sections
    tabItems.forEach(tab => {
        const tabId = tab.getAttribute('data-tab');
        // Find first section that contains this section title
        const section = Array.from(contentSections).find(section => {
            const sectionTitle = section.querySelector('.section-title');
            if (!sectionTitle) return false;
            
            return sectionTitle.textContent.toLowerCase().includes(tabId.toLowerCase());
        });
        
        if (section) {
            section.setAttribute('data-section', tabId);
        }
    });
    
    // Listen for scroll events
    window.addEventListener('scroll', debounce(function() {
        // Get current scroll position
        const scrollPosition = window.scrollY;
        
        // Find all sections with data-section attribute
        const sections = document.querySelectorAll('[data-section]');
        
        // Calculate header height for offset
        const tabsSection = document.querySelector('.tabs-section');
        const headerOffset = tabsSection ? tabsSection.offsetHeight : 0;
        
        // Find the section that is currently in view
        let currentSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerOffset - 100; // 100px tolerance
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section;
            }
        });
        
        // Update active tab based on current section
        if (currentSection) {
            const sectionId = currentSection.getAttribute('data-section');
            const correspondingTab = document.querySelector(`.tab-item[data-tab="${sectionId}"]`);
            
            if (correspondingTab) {
                setActiveTab(correspondingTab);
            }
        }
    }, 100));
}

/**
 * Set active state for a tab and remove from others
 */
function setActiveTab(activeTab) {
    if (!activeTab) return;
    
    // Remove active class from all tabs
    const allTabs = document.querySelectorAll('.tab-item');
    allTabs.forEach(tab => tab.classList.remove('active'));
    
    // Add active class to the clicked tab
    activeTab.classList.add('active');
    
    // Optional: Ensure the active tab is visible in the scrollable tabs
    ensureTabVisible(activeTab);
}

/**
 * Ensure the active tab is visible in the scrollable tab container
 */
function ensureTabVisible(activeTab) {
    const tabsContainer = document.querySelector('.tabs');
    if (!tabsContainer) return;
    
    const tabRect = activeTab.getBoundingClientRect();
    const containerRect = tabsContainer.getBoundingClientRect();
    
    // If tab is not fully visible on the right
    if (tabRect.right > containerRect.right) {
        tabsContainer.scrollLeft += (tabRect.right - containerRect.right + 20);
    }
    
    // If tab is not fully visible on the left
    if (tabRect.left < containerRect.left) {
        tabsContainer.scrollLeft -= (containerRect.left - tabRect.left + 20);
    }
}

/**
 * Set up FAQ accordion functionality
 */
function setupFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Toggle active class
            this.classList.toggle('active');
            
            // Get the answer element
            const answer = this.nextElementSibling;
            
            // Toggle icon rotation
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = this.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
            
            // Toggle display with animation
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                setTimeout(() => {
                    answer.style.display = 'none';
                }, 300);
            } else {
                answer.style.display = 'block';
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// Add animation to elements when they come into view
document.addEventListener('DOMContentLoaded', function() {
    // Setup intersection observer for animations
    setupScrollAnimations();
});

/**
 * Set up animations for elements as they scroll into view
 */
function setupScrollAnimations() {
    // Add animation classes to elements
    const animatedElements = [
        '.treatment-image',
        '.treatment-content',
        '.doctor-card',
        '.hospital-card',
        '.story-card',
        '.contact-form'
    ];
    
    // Add animation-ready class to all elements that should animate
    animatedElements.forEach(selector => {
        document.querySelectorAll(selector).forEach((element, index) => {
            element.classList.add('animation-ready');
            // Add staggered delay for items that appear in groups
            element.style.transitionDelay = (index * 0.1) + 's';
        });
    });
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class when element is visible
                entry.target.classList.add('animate-in');
                // Unobserve after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2, // Trigger when 20% of element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust trigger area (top right bottom left)
    });
    
    // Observe all elements that should animate
    document.querySelectorAll('.animation-ready').forEach(element => {
        observer.observe(element);
    });
}

/**
 * Add CSS animation styles dynamically
 */
(function addAnimationStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .animation-ready {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .treatment-image.animate-in {
            animation: fadeInRight 0.8s ease forwards;
        }
        
        .doctor-card.animate-in,
        .hospital-card.animate-in,
        .story-card.animate-in {
            animation: popIn 0.5s ease forwards;
        }
        
        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes popIn {
            0% {
                opacity: 0;
                transform: scale(0.8);
            }
            70% {
                opacity: 1;
                transform: scale(1.05);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        /* Smooth transition for FAQ items */
        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }
        
        /* Add smooth rotation for tab icons */
        .tab-item i {
            transition: transform 0.3s ease;
        }
        
        /* Make sure tabs have smooth transitions */
        .tab-item {
            position: relative;
            transition: color 0.3s ease;
        }
        
        .tab-item::after {
            transition: width 0.3s ease;
        }
    `;
    document.head.appendChild(styleElement);
})();


        // Page Loader
        window.addEventListener('load', function() {
            setTimeout(function() {
                document.querySelector('.page-loader').style.opacity = '0';
                setTimeout(function() {
                    document.querySelector('.page-loader').style.display = 'none';
                }, 500);
            }, 1000);
        });
        
        new Swiper('.patient-swiper', {
          slidesPerView: 2,
          spaceBetween: 30,
          loop: true,
          autoplay: {
            delay: 3500,
            disableOnInteraction: false,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          breakpoints: {
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            }
          }
        });
      document.addEventListener('DOMContentLoaded', function() {
    // Initialize all sliders
    initSlider('doctors');
    initSlider('hospitals');
    initSlider('patients');
    
    // Handle navigation links
    setupNavigation();
    
    function setupNavigation() {
        // Get all navigation links
        const navLinks = document.querySelectorAll('.nav-links a');
        
        // Add click event listeners to each link
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // For dropdown toggles, don't navigate immediately
                if (this.classList.contains('has-dropdown')) {
                    e.preventDefault();
                    toggleDropdown(this);
                } 
                // For the Hospitals link specifically
                else if (this.textContent.trim() === 'Hospitals') {
                    e.preventDefault();
                    navigateToHospitalsPage();
                }
                // Other links can use their href attribute normally
            });
        });
        
        // Handle dropdown menu interactions
        setupDropdowns();
    }
    
    function toggleDropdown(dropdownToggle) {
        // Find the dropdown menu associated with this toggle
        const dropdown = dropdownToggle.nextElementSibling;
        
        // Toggle the active class on the dropdown
        dropdown.classList.toggle('active');
        
        // Close other open dropdowns
        document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
            if (menu !== dropdown) {
                menu.classList.remove('active');
            }
        });
    }
    
    function navigateToHospitalsPage() {
        // You can either redirect to a hospitals page
        // window.location.href = 'hospitals.html';
        
        // Or, if you're using a single-page approach, scroll to the hospitals section
        const hospitalsSection = document.querySelector('.hospitals-section');
        if (hospitalsSection) {
            hospitalsSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // For demo purposes, let's also highlight the hospitals section temporarily
        if (hospitalsSection) {
            hospitalsSection.classList.add('highlight-section');
            setTimeout(() => {
                hospitalsSection.classList.remove('highlight-section');
            }, 1500);
        }
    }
    
    function setupDropdowns() {
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.has-dropdown') && !e.target.closest('.dropdown-menu')) {
                document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
                    menu.classList.remove('active');
                });
            }
        });
        
        // Add hover effects for desktop
        const dropdownItems = document.querySelectorAll('.has-dropdown');
        dropdownItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                if (window.innerWidth >= 992) { // Desktop only
                    const dropdown = this.nextElementSibling;
                    dropdown.classList.add('active');
                }
            });
            
            const parentLi = item.closest('li');
            if (parentLi) {
                parentLi.addEventListener('mouseleave', function() {
                    if (window.innerWidth >= 992) { // Desktop only
                        const dropdown = this.querySelector('.dropdown-menu');
                        if (dropdown) {
                            dropdown.classList.remove('active');
                        }
                    }
                });
            }
        });
    }
    
    // Slider functionality
    function initSlider(sliderType) {
        const slider = document.querySelector(`.${sliderType}-slider`);
        const dotsContainer = document.querySelector(`.${sliderType}-dots`);
        const prevBtn = document.querySelector(`.nav-btn.prev-btn[data-slider="${sliderType}"]`);
        const nextBtn = document.querySelector(`.nav-btn.next-btn[data-slider="${sliderType}"]`);
        const cards = document.querySelectorAll(`.${sliderType}-slider .${sliderType.slice(0, -1)}-card`);
        
        if (!slider || cards.length === 0) return; // Exit if elements don't exist
        
        let currentSlide = 0;
        let cardsPerView = getCardsPerView();
        let totalSlides = Math.ceil(cards.length / cardsPerView);
        let autoSlideInterval;
        
        // Initialize the slider
        updateSliderWidth();
        createDots();
        updateSlider();
        startAutoSlide();
        
        // Add event listeners
        window.addEventListener('resize', handleResize);
        
        if (dotsContainer) {
            dotsContainer.addEventListener('click', handleDotClick);
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', goToPrevSlide);
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', goToNextSlide);
        }
        
        function handleResize() {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                totalSlides = Math.ceil(cards.length / cardsPerView);
                currentSlide = Math.min(currentSlide, totalSlides - 1);
                updateSliderWidth();
                createDots();
                updateSlider();
            }
        }
        
        function handleDotClick(e) {
            if (e.target.classList.contains('dot')) {
                currentSlide = parseInt(e.target.getAttribute('data-index'));
                updateSlider();
                updateDots();
                restartAutoSlide();
            }
        }
        
        function goToPrevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
            updateDots();
            restartAutoSlide();
        }
        
        function goToNextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
            updateDots();
            restartAutoSlide();
        }
        
        function getCardsPerView() {
            // For patients slider, we always want 2 cards (except on mobile)
            if (sliderType === 'patients') {
                return window.innerWidth < 576 ? 1 : 2;
            }
            // For other sliders, keep the original logic
            if (window.innerWidth < 576) return 1;
            if (window.innerWidth < 992) return 2;
            return 3;
        }
        
        function updateSliderWidth() {
            const percent = 100 / cardsPerView;
            cards.forEach(card => {
                card.style.minWidth = `calc(${percent}% - 20px)`;
            });
        }
        
        function updateSlider() {
            const cardWidth = cards[0].offsetWidth + 20; // 20px for margin
            const translateX = -currentSlide * cardWidth * Math.min(cardsPerView, cards.length - currentSlide * cardsPerView);
            slider.style.transform = `translateX(${translateX}px)`;
        }
        
        function createDots() {
            if (!dotsContainer) return;
            
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                dot.setAttribute('data-index', i);
                if (i === currentSlide) dot.classList.add('active');
                dotsContainer.appendChild(dot);
            }
        }
        
        function updateDots() {
            if (!dotsContainer) return;
            
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        function startAutoSlide() {
            // Different intervals for each slider
            const intervals = {
                'doctors': 3000, 
                'hospitals': 5000,
                'patients': 4000
            };
            
            const interval = intervals[sliderType] || 4000;
            autoSlideInterval = setInterval(goToNextSlide, interval);
        }
        
        function restartAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
    }
});
    
document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector('.enquire-btn');
    console.log(button);  // Check if this logs the correct button element
    if (button) {
        button.addEventListener('click', function() {
            alert('Button clicked!');
        });
    }
});
