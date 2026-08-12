window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');

    if (!dropdown || !button) return;
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');

    if (!container || !dropdown || !button) return;
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        if (!dropdown || !button) return;
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Copied!';

            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Copied!';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

function setupComparisonSliders() {
    const sliders = document.querySelectorAll('.comparison-slider');

    sliders.forEach((slider) => {
        const slides = Array.from(slider.querySelectorAll('.comparison-slide'));
        const dotsContainer = slider.querySelector('.comparison-slider-dots');
        const autoplayMs = Number(slider.dataset.autoplayMs || 4500);

        if (slides.length === 0 || !dotsContainer) return;

        let currentIndex = 0;
        let intervalId = null;

        function renderDots() {
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.setAttribute('aria-label', `Show slide ${index + 1}`);
                if (index === currentIndex) {
                    dot.classList.add('is-active');
                }
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateSlides();
                    restartAutoplay();
                });
                dotsContainer.appendChild(dot);
            });
        }

        function updateSlides() {
            slides.forEach((slide, index) => {
                slide.classList.toggle('is-active', index === currentIndex);
            });

            Array.from(dotsContainer.children).forEach((dot, index) => {
                dot.classList.toggle('is-active', index === currentIndex);
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlides();
        }

        function startAutoplay() {
            if (slides.length <= 1) return;
            intervalId = window.setInterval(nextSlide, autoplayMs);
        }

        function stopAutoplay() {
            if (intervalId !== null) {
                window.clearInterval(intervalId);
                intervalId = null;
            }
        }

        function restartAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        renderDots();
        updateSlides();
        startAutoplay();

        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
    });
}

// Auto-cycling GT / init / refined widget
function setupMergeDial() {
    const dial = document.querySelector('.merge-dial');
    if (!dial) return;

    const wrap = dial.querySelector('.merge-dial-image-wrap');
    const frames = Array.from(dial.querySelectorAll('.merge-dial-frame'));
    const labels = Array.from(dial.querySelectorAll('.merge-dial-label'));
    const tabs = Array.from(dial.querySelectorAll('.merge-dial-tab'));

    const scenes = {
        figurines: { id: '00005', label: 'Figurines' },
        ramen: { id: '00001', label: 'Ramen' },
        blue_sofa: { id: '00027', label: 'Blue Sofa' },
        teatime: { id: '00000', label: 'Teatime' },
        room: { id: '00007', label: 'Room' },
        snacks: { id: '00019', label: 'Snacks' },
        covered_desk: { id: '00022', label: 'Covered Desk' },
    };

    let index = 0;
    let intervalId = null;
    const cycleMs = 2400;

    function setIndex(next) {
        index = ((next % frames.length) + frames.length) % frames.length;
        frames.forEach((frame, i) => frame.classList.toggle('is-active', i === index));
        labels.forEach((label, i) => label.classList.toggle('is-active', i === index));
    }

    function startCycle() {
        stopCycle();
        intervalId = window.setInterval(() => setIndex(index + 1), cycleMs);
    }

    function stopCycle() {
        if (intervalId !== null) {
            window.clearInterval(intervalId);
            intervalId = null;
        }
    }

    wrap.addEventListener('mouseenter', stopCycle);
    wrap.addEventListener('mouseleave', startCycle);

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const scene = scenes[tab.dataset.scene];
            if (!scene) return;

            tabs.forEach((t) => t.classList.remove('is-active'));
            tab.classList.add('is-active');

            const suffixes = ['gt', 'init', 'refined'];
            frames.forEach((frame, i) => {
                frame.src = `asset/slide/${tab.dataset.scene}/${scene.id}_${suffixes[i]}.png`;
                frame.alt = `${scene.label} ${suffixes[i] === 'gt' ? 'ground truth' : suffixes[i] === 'init' ? 'SAM initial mask' : 'refined mask'}`;
            });
            setIndex(0);
            startCycle();
        });
    });

    setIndex(0);
    startCycle();
}

// Floating section navigator with scrollspy highlighting
function setupSectionNav() {
    const links = Array.from(document.querySelectorAll('.section-nav-link'));
    if (links.length === 0) return;

    const sections = links
        .map((link) => document.getElementById(link.dataset.section))
        .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const link = links.find((l) => l.dataset.section === entry.target.id);
                if (!link) return;
                link.classList.toggle('is-active', entry.isIntersecting);
            });
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
}

// Click-to-zoom lightbox for figure images
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    if (!lightbox || !lightboxImg || !closeBtn) return;

    function openLightbox(img) {
        lightboxImg.src = img.currentSrc || img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.lightbox-trigger').forEach((img) => {
        img.addEventListener('click', () => openLightbox(img));
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeLightbox();
    });
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();

    // Setup qualitative comparison sliders
    setupComparisonSliders();

    // Setup interactive init/refined drag-compare widget
    setupMergeDial();

    // Setup floating section navigator
    setupSectionNav();

    // Setup image lightbox
    setupLightbox();

})
