// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 100; // Account for sticky header
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active class to navigation links based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    function highlightNavigation() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    
    // Add fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards and sections for animation
    const animatedElements = document.querySelectorAll('.content-card, .concept-card, .relevance-card, .historical-card, .glossary-term, .timeline-item, .challenge-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Mobile menu functionality
    const nav = document.querySelector('.nav-menu');
    let mobileMenuButton = document.querySelector('.mobile-menu-button');
    
    // Create mobile menu button if it doesn't exist
    if (!mobileMenuButton && window.innerWidth <= 768) {
        mobileMenuButton = document.createElement('button');
        mobileMenuButton.className = 'mobile-menu-button';
        mobileMenuButton.innerHTML = '☰';
        mobileMenuButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 30px;
            cursor: pointer;
            display: none;
        `;
        
        const navContainer = document.querySelector('.nav-container');
        navContainer.appendChild(mobileMenuButton);
        
        mobileMenuButton.addEventListener('click', function() {
            nav.classList.toggle('mobile-open');
            this.innerHTML = nav.classList.contains('mobile-open') ? '✕' : '☰';
        });
    }
    
    // Handle responsive navigation
    function handleResize() {
        if (window.innerWidth <= 768) {
            if (mobileMenuButton) {
                mobileMenuButton.style.display = 'block';
                nav.style.cssText = `
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: #2c3e50;
                    flex-direction: column;
                    padding: 20px;
                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                `;
            }
        } else {
            if (mobileMenuButton) {
                mobileMenuButton.style.display = 'none';
                nav.classList.remove('mobile-open');
                nav.style.cssText = '';
            }
        }
    }
    
    // Add CSS for mobile menu open state
    const style = document.createElement('style');
    style.textContent = `
        .nav-menu.mobile-open {
            transform: translateY(0) !important;
            opacity: 1 !important;
            visibility: visible !important;
        }
        
        .nav-menu a.active {
            background-color: rgba(255,255,255,0.2);
            border-radius: 5px;
        }
        
        @media (max-width: 768px) {
            .nav-container {
                position: relative;
            }
        }
    `;
    document.head.appendChild(style);
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Search functionality for glossary
    const glossarySection = document.getElementById('glossary');
    if (glossarySection) {
        // Create search input
        const searchContainer = document.createElement('div');
        searchContainer.style.cssText = `
            margin-bottom: 40px;
            text-align: center;
        `;
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search theological terms...';
        searchInput.style.cssText = `
            padding: 15px 20px;
            font-size: 24px;
            border: 2px solid #ddd;
            border-radius: 8px;
            width: 100%;
            max-width: 500px;
            margin-bottom: 20px;
        `;
        
        searchContainer.appendChild(searchInput);
        glossarySection.querySelector('.container').insertBefore(searchContainer, glossarySection.querySelector('.glossary-grid'));
        
        // Filter glossary terms
        const glossaryTerms = document.querySelectorAll('.glossary-term');
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            glossaryTerms.forEach(term => {
                const title = term.querySelector('.term-title').textContent.toLowerCase();
                const definition = term.querySelector('.term-definition').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || definition.includes(searchTerm) || searchTerm === '') {
                    term.style.display = 'block';
                } else {
                    term.style.display = 'none';
                }
            });
        });
    }
    
    // Back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #3498db;
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    // Print functionality
    const printButton = document.createElement('button');
    printButton.innerHTML = 'Print Study Guide';
    printButton.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        padding: 12px 20px;
        background-color: #27ae60;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 18px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(printButton);
    
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    // Show print button on hover over content
    const mainContent = document.querySelector('.main-content');
    
    mainContent.addEventListener('mouseenter', function() {
        printButton.style.opacity = '1';
        printButton.style.visibility = 'visible';
    });
    
    mainContent.addEventListener('mouseleave', function() {
        setTimeout(() => {
            if (!printButton.matches(':hover')) {
                printButton.style.opacity = '0';
                printButton.style.visibility = 'hidden';
            }
        }, 500);
    });
    
    printButton.addEventListener('mouseenter', function() {
        this.style.opacity = '1';
        this.style.visibility = 'visible';
    });
    
    printButton.addEventListener('mouseleave', function() {
        this.style.opacity = '0';
        this.style.visibility = 'hidden';
    });
    
    // Progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background-color: #e74c3c;
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
    
    console.log('Karl Rahner Study Guide loaded successfully!');
});
