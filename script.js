document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoryContainers = document.querySelectorAll('.category-container');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const categoryButtonsContainer = document.querySelector('.category-buttons');
    
    // Initialize category view
    let currentCategory = 'all';
    
    // Mobile menu toggle function
    function toggleMobileMenu() {
        mobileNav.classList.toggle('active');
        
        // Toggle menu button icon between menu and close
        const svg = mobileMenuBtn.querySelector('svg');
        if (mobileNav.classList.contains('active')) {
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
        } else {
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        }
    }
    
    // Close mobile menu function
    function closeMobileMenu() {
        mobileNav.classList.remove('active');
        const svg = mobileMenuBtn.querySelector('svg');
        svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
    }
    
    // Add click event to mobile menu button
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Add click events to mobile navigation links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Function to switch between categories
    function switchCategory(category) {
        // Update active state of buttons
        categoryButtons.forEach(btn => {
            btn.classList.remove('active');
            if(btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
                // Scroll the button into view on mobile
                if(window.innerWidth <= 768) {
                    const containerRect = categoryButtonsContainer.getBoundingClientRect();
                    const buttonRect = btn.getBoundingClientRect();
                    const scrollLeft = buttonRect.left - containerRect.left - 
                                    (containerRect.width - buttonRect.width) / 2;
                    categoryButtonsContainer.scrollTo({
                        left: categoryButtonsContainer.scrollLeft + scrollLeft,
                        behavior: 'smooth'
                    });
                }
            }
        });

        // Hide all containers with fade effect
        categoryContainers.forEach(container => {
            if(container.id === `category-${category}`) {
                container.style.opacity = '0';
                container.style.display = 'grid';
                setTimeout(() => {
                    container.style.opacity = '1';
                }, 50);
            } else {
                container.style.opacity = '0';
                setTimeout(() => {
                    container.style.display = 'none';
                }, 300);
            }
        });

        currentCategory = category;
    }

    // Add touch scroll for category buttons on mobile
    let isScrolling = false;
    let startX;
    let scrollLeft;

    categoryButtonsContainer.addEventListener('touchstart', (e) => {
        isScrolling = true;
        startX = e.touches[0].pageX - categoryButtonsContainer.offsetLeft;
        scrollLeft = categoryButtonsContainer.scrollLeft;
    });

    categoryButtonsContainer.addEventListener('touchmove', (e) => {
        if(!isScrolling) return;
        e.preventDefault();
        const x = e.touches[0].pageX - categoryButtonsContainer.offsetLeft;
        const walk = (x - startX) * 2;
        categoryButtonsContainer.scrollLeft = scrollLeft - walk;
    });

    categoryButtonsContainer.addEventListener('touchend', () => {
        isScrolling = false;
    });

    // Category button clicks
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            if(category !== currentCategory) {
                switchCategory(category);
            }
        });
    });

    // Initialize with 'all' category
    switchCategory('all');

    // Add scroll snap behavior for smoother mobile scrolling
    if('scrollBehavior' in document.documentElement.style) {
        categoryButtonsContainer.style.scrollBehavior = 'smooth';
        categoryButtonsContainer.style.scrollSnapType = 'x mandatory';
        categoryButtons.forEach(btn => {
            btn.style.scrollSnapAlign = 'center';
        });
    }

    // Prevent click events while scrolling on mobile
    let touchMoved = false;
    categoryButtonsContainer.addEventListener('touchstart', () => {
        touchMoved = false;
    });
    
    categoryButtonsContainer.addEventListener('touchmove', () => {
        touchMoved = true;
    });
    
    categoryButtonsContainer.addEventListener('touchend', (e) => {
        if (touchMoved) {
            e.preventDefault();
        }
    });

    // Add keyboard navigation for accessibility
    categoryButtonsContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const currentBtn = document.querySelector('.category-btn.active');
            const buttons = Array.from(categoryButtons);
            const currentIndex = buttons.indexOf(currentBtn);
            let newIndex;

            if (e.key === 'ArrowRight') {
                newIndex = (currentIndex + 1) % buttons.length;
            } else {
                newIndex = (currentIndex - 1 + buttons.length) % buttons.length;
            }

            const newCategory = buttons[newIndex].getAttribute('data-category');
            switchCategory(newCategory);
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });

    // Add fade-in animation to elements as they scroll into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.card, .product-card, .section-title, .section-description').forEach(el => {
        observer.observe(el);
    });
});

<nav class="nav">
    <a href="#home" class="nav-link">HOME</a>
    <a href="#about" class="nav-link">ABOUT US</a>
    <a href="#collection" class="nav-link">COLLECTION</a>
    <a href="#contact" class="nav-link">CONTACT US</a>
</nav>