// ========================================
// LOADING SCREEN
// ========================================

window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1000);
});

// ========================================
// THEME TOGGLE (Dark Mode)
// ========================================

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const body = document.body;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
});

// ========================================
// BANNER SLIDER
// ========================================

const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function startSlideshow() {
    slideInterval = setInterval(nextSlide, 4000); // Change slide every 3 seconds
}

function stopSlideshow() {
    clearInterval(slideInterval);
}

// Event listeners for navigation
nextBtn.addEventListener('click', () => {
    nextSlide();
    stopSlideshow();
    startSlideshow();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    stopSlideshow();
    startSlideshow();
});

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        stopSlideshow();
        startSlideshow();
    });
});

// Start slideshow
startSlideshow();

// Pause on hover
const bannerSlider = document.querySelector('.banner-slider');
bannerSlider.addEventListener('mouseenter', stopSlideshow);
bannerSlider.addEventListener('mouseleave', startSlideshow);

// ========================================
// PHOTO GALLERY LIGHTBOX
// ========================================

const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.querySelector('.lightbox-close');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.getAttribute('data-image');
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// ESC key to close lightbox
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
    if (e.key === 'Escape' && shareModal.classList.contains('active')) {
        closeShareModal();
    }
});

// ========================================
// SHARE MODAL & QR CODE
// ========================================

const shareBtn = document.getElementById('shareBtn');
const shareModal = document.getElementById('shareModal');
const shareClose = document.querySelector('.share-close');
const shareWhatsapp = document.getElementById('shareWhatsapp');
const shareFacebook = document.getElementById('shareFacebook');
const shareTwitter = document.getElementById('shareTwitter');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const copyFeedback = document.getElementById('copyFeedback');
const linkText = document.getElementById('linkText');

const currentURL = window.location.href;
const pageTitle = document.title;

// Display shortened URL in preview
if (linkText) {
    const maxLength = 35;
    if (currentURL.length > maxLength) {
        linkText.textContent = currentURL.substring(0, maxLength) + '...';
    } else {
        linkText.textContent = currentURL;
    }
    linkText.title = currentURL; // Show full URL on hover
}

// Generate QR Code
let qrGenerated = false;

shareBtn.addEventListener('click', () => {
    shareModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Generate QR code only once
    if (!qrGenerated && typeof QRCode !== 'undefined') {
        const qrcodeContainer = document.getElementById('qrcode');
        qrcodeContainer.innerHTML = ''; // Clear previous
        try {
            new QRCode(qrcodeContainer, {
                text: currentURL,
                width: 180,
                height: 180,
                colorDark: '#2D7A4F',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });
            qrGenerated = true;
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    }
});

shareClose.addEventListener('click', closeShareModal);
shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) {
        closeShareModal();
    }
});

function closeShareModal() {
    shareModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Share buttons
shareWhatsapp.addEventListener('click', (e) => {
    e.preventDefault();
    const shareText = `Leve na Marmita\n\nComida caseira e saudável feita com muito carinho!\n\nPeça pelo iFood, veja nosso cardápio completo e confira opções personalizadas para sua dieta.\n\n${currentURL}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappURL, '_blank');
});

shareFacebook.addEventListener('click', (e) => {
    e.preventDefault();
    const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentURL)}`;
    window.open(facebookURL, '_blank');
});

shareTwitter.addEventListener('click', (e) => {
    e.preventDefault();
    const tweetText = `🌱 ${pageTitle} - Alimentação saudável e caseira! 💚`;
    const twitterURL = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentURL)}&text=${encodeURIComponent(tweetText)}`;
    window.open(twitterURL, '_blank');
});

// Copy link functionality
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(currentURL);
        copyFeedback.classList.add('show');
        setTimeout(() => {
            copyFeedback.classList.remove('show');
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = currentURL;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        copyFeedback.classList.add('show');
        setTimeout(() => {
            copyFeedback.classList.remove('show');
        }, 2000);
    }
}

if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', copyToClipboard);
}

// ========================================
// PARTICLES ANIMATION
// ========================================

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const numberOfParticles = 50;

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(45, 122, 79, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particles
function init() {
    particlesArray.length = 0;
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        // Connect particles
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `rgba(45, 122, 79, ${0.2 - distance / 500})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

init();
animate();

// Resize canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// ========================================
// SMOOTH SCROLL REVEAL ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.link-card, .section-title').forEach(el => {
    observer.observe(el);
});

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ========================================
// ANALYTICS & TRACKING (Optional)
// ========================================

// Track link clicks
document.querySelectorAll('.link-card').forEach(link => {
    link.addEventListener('click', function() {
        const linkText = this.querySelector('h3').textContent;
        console.log('Link clicked:', linkText);
        // You can add Google Analytics or other tracking here
        // Example: gtag('event', 'click', { 'event_category': 'Link', 'event_label': linkText });
    });
});

// ========================================
// ACCESSIBILITY IMPROVEMENTS
// ========================================

// Trap focus in modals
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Apply focus trap to modals
const modals = [shareModal, lightbox];
modals.forEach(modal => {
    modal.addEventListener('transitionend', function() {
        if (modal.classList.contains('active')) {
            trapFocus(modal);
        }
    });
});

console.log('🌱 Leve na Marmita - Página carregada com sucesso!');
