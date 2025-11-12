// Configuration
const BACKEND_URL = 'https://auto-showcase-73.preview.emergentagent.com';
const API_URL = `${BACKEND_URL}/api`;
const AUTO_ROTATE_INTERVAL = 5000; // 6 seconds

// State
let products = [];
let currentIndex = 0;
let autoRotateTimer = null;

// DOM Elements
const elements = {
    loading: null,
    mainContent: null,
    productImage: null,
    productName: null,
    productDescription: null,
    productBadge: null,
    progressDots: null,
    prevButton: null,
    nextButton: null,
    appContainer: null,
    imageCard: null,
    infoContent: null
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    fetchProducts();
    setupEventListeners();
});

// Initialize DOM element references
function initializeElements() {
    elements.loading = document.getElementById('loading');
    elements.mainContent = document.getElementById('mainContent');
    elements.productImage = document.getElementById('productImage');
    elements.productName = document.getElementById('productName');
    elements.productDescription = document.getElementById('productDescription');
    elements.productBadge = document.getElementById('productBadge');
    elements.progressDots = document.getElementById('progressDots');
    elements.prevButton = document.getElementById('prevButton');
    elements.nextButton = document.getElementById('nextButton');
    elements.appContainer = document.getElementById('app');
    elements.imageCard = document.getElementById('imageCard');
    elements.infoContent = document.getElementById('infoContent');
}

// Fetch products from API
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        products = await response.json();
        
        if (products.length > 0) {
            initializeCarousel();
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        // Fallback to local products if API fails
        products = getFallbackProducts();
        initializeCarousel();
    }
}

// Fallback products in case API fails
function getFallbackProducts() {
    return [
        {
            id: 1,
            name: "Fone de Ouvido Premium",
            description: "Experimente som de alta qualidade com cancelamento de ruído ativo. Bateria de longa duração e design ergonômico para máximo conforto durante todo o dia.",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
            color: "#3b82f6"
        },
        {
            id: 2,
            name: "Smartwatch Elite",
            description: "Monitore sua saúde e fitness com precisão. Tela AMOLED vibrante, resistente à água e conectividade perfeita com seu smartphone.",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
            color: "#8b5cf6"
        },
        {
            id: 3,
            name: "Câmera Profissional",
            description: "Capture momentos incríveis com qualidade profissional. Sensor full-frame, 45MP de resolução e sistema de foco ultrarápido.",
            image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop",
            color: "#f97316"
        },
        {
            id: 4,
            name: "Notebook Ultra",
            description: "Potência e portabilidade em um só dispositivo. Processador de última geração, tela 4K e bateria que dura o dia inteiro.",
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop",
            color: "#10b981"
        },
        {
            id: 5,
            name: "Teclado Mecânico RGB",
            description: "Digite com precisão e estilo. Switches mecânicos premium, iluminação RGB personalizável e design compacto para gamers.",
            image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop",
            color: "#ec4899"
        }
    ];
}

// Initialize carousel after products are loaded
function initializeCarousel() {
    elements.loading.style.display = 'none';
    elements.mainContent.style.display = 'block';
    
    renderProgressDots();
    updateCarousel();
    startAutoRotate();
}

// Render progress dots
function renderProgressDots() {
    elements.progressDots.innerHTML = '';
    products.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `dot ${index === currentIndex ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        elements.progressDots.appendChild(dot);
    });
}

// Update carousel display
function updateCarousel() {
    const product = products[currentIndex];
    
    // Update content
    elements.productImage.src = product.image;
    elements.productImage.alt = product.name;
    elements.productName.textContent = product.name;
    elements.productDescription.textContent = product.description;
    elements.productBadge.textContent = `Produto ${currentIndex + 1} de ${products.length}`;
    
    // Update colors
    const rgb = hexToRgb(product.color);
    elements.appContainer.style.setProperty('--primary-color', product.color);
    elements.appContainer.style.setProperty('--primary-rgb', rgb);
    
    // Update active dot
    const dots = elements.progressDots.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.className = `dot ${index === currentIndex ? 'active' : ''}`;
    });
    
    // Trigger animations
    triggerAnimation();
}

// Trigger entrance animations
function triggerAnimation() {
    // Remove and re-add animation class for image
    elements.imageCard.style.animation = 'none';
    setTimeout(() => {
        elements.imageCard.style.animation = 'fadeInScale 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }, 10);
    
    // Remove and re-add animation class for info
    elements.infoContent.style.animation = 'none';
    setTimeout(() => {
        elements.infoContent.style.animation = 'fadeInSlide 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }, 10);
}

// Navigation functions
function goToNext() {
    currentIndex = (currentIndex + 1) % products.length;
    updateCarousel();
    resetAutoRotate();
}

function goToPrevious() {
    currentIndex = (currentIndex - 1 + products.length) % products.length;
    updateCarousel();
    resetAutoRotate();
}

function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
    resetAutoRotate();
}

// Auto-rotate functions
function startAutoRotate() {
    autoRotateTimer = setInterval(() => {
        goToNext();
    }, AUTO_ROTATE_INTERVAL);
}

function resetAutoRotate() {
    if (autoRotateTimer) {
        clearInterval(autoRotateTimer);
    }
    startAutoRotate();
}

// Setup event listeners
function setupEventListeners() {
    elements.prevButton.addEventListener('click', goToPrevious);
    elements.nextButton.addEventListener('click', goToNext);
    
    // Pause auto-rotate on hover
    elements.mainContent.addEventListener('mouseenter', () => {
        if (autoRotateTimer) {
            clearInterval(autoRotateTimer);
        }
    });
    
    elements.mainContent.addEventListener('mouseleave', () => {
        startAutoRotate();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToPrevious();
        } else if (e.key === 'ArrowRight') {
            goToNext();
        }
    });
}

// Utility function to convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '59, 130, 246';
}