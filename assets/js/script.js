document.addEventListener('DOMContentLoaded', function () {

    const mobileMenuBtn = document.getElementById('mobile-menu-btn'); 
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) { 
        mobileMenuBtn.addEventListener('click', function () { 
            mobileMenu.classList.toggle('hidden'); 
        });
    }

    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    mobileLinks.forEach(link => { 
        link.addEventListener('click', () => { 
            mobileMenu.classList.add('hidden'); 
        });
    });

    const header = document.getElementById('main-header');
    window.addEventListener('scroll', function () { 
        if (window.scrollY > 40) { 
            header.classList.add('shadow-md');
        } else {
            header.classList.remove('shadow-md');
        }
    });

    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signin-email').value;
            localStorage.setItem('userEmail', email);
            window.location.href = 'dashboard.html';
        });
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            localStorage.setItem('userName', name);
            window.location.href = 'dashboard.html';
        });
    }

    const userDisplayName = document.getElementById('user-display-name');
    if (userDisplayName) {
        const storedName = localStorage.getItem('userName');
        const storedEmail = localStorage.getItem('userEmail');
        if (storedName) {
            userDisplayName.textContent = storedName;
        } else if (storedEmail) {
            userDisplayName.textContent = storedEmail.split('@')[0];
        }
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }

    const signinBtns = document.querySelectorAll('a[href="#signin"]');
    signinBtns.forEach(btn => btn.setAttribute('href', 'signin.html'));

    const signupBtns = document.querySelectorAll('a[href="#signup"]');
    signupBtns.forEach(btn => btn.setAttribute('href', 'signup.html'));

    const searchBtn = document.getElementById('search-btn'); 
    const searchBtnMobile = document.getElementById('search-btn-mobile'); 
    const searchModal = document.getElementById('search-modal'); 
    const closeSearch = document.getElementById('close-search'); 

    function openSearchModal() { 
        searchModal.classList.remove('hidden');
        setTimeout(() => searchModal.classList.remove('opacity-0'), 10); 
    }

    function closeSearchModal() { 
        searchModal.classList.add('opacity-0');
        setTimeout(() => searchModal.classList.add('hidden'), 300);
    }

    if (searchBtn) searchBtn.addEventListener('click', openSearchModal);
    if (searchBtnMobile) searchBtnMobile.addEventListener('click', openSearchModal);
    if (closeSearch) closeSearch.addEventListener('click', closeSearchModal);

    document.addEventListener('keydown', function(e) { 
        if (e.key === 'Escape') closeSearchModal(); 
    });

    const contactForm = document.getElementById('contact-form'); //[cite: 4]
    if (contactForm) { //[cite: 4]
        contactForm.addEventListener('submit', function (e) { //[cite: 4]
            e.preventDefault(); //[cite: 4]
            showToast('Thank You!', 'Your quote request has been sent successfully. Our team will reach out shortly.'); //[cite: 4]
            contactForm.reset(); //[cite: 4]
        });
    }

    const newsletterForm = document.getElementById('newsletter-form'); //[cite: 4]
    if (newsletterForm) { //[cite: 4]
        newsletterForm.addEventListener('submit', function (e) { //[cite: 4]
            e.preventDefault(); //[cite: 4]
            showToast('Subscribed!', 'You have been subscribed to our monthly HR Insights.'); //[cite: 4]
            newsletterForm.reset(); //[cite: 4]
        });
    }

    const playVideoBtn = document.getElementById('play-video-btn'); //[cite: 4]
    if (playVideoBtn) { //[cite: 4]
        playVideoBtn.addEventListener('click', function () { //[cite: 4]
            const videoModal = document.createElement('div'); //[cite: 4]
            videoModal.className = 'fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4'; //[cite: 4]
            videoModal.innerHTML = `
                <div class="bg-white rounded-3xl p-6 max-w-2xl w-full text-center space-y-4 relative shadow-2xl">
                    <button id="close-video-modal" class="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    <h3 class="text-xl font-bold text-tealDark">Workforce Strategic Presentation</h3>
                    <div class="aspect-video bg-tealDeep rounded-2xl flex flex-col items-center justify-center text-white p-6 shadow-inner">
                        <i class="fa-solid fa-circle-play text-5xl mb-3 text-goldAccent"></i>
                        <p class="text-sm font-semibold text-gray-200">Interactive Video Overview Placeholder</p>
                        <p class="text-xs text-gray-400 mt-1">Discover how our executive recruitment engines drive corporate growth.</p>
                    </div>
                </div>
            `; //[cite: 4]
            document.body.appendChild(videoModal); //[cite: 4]

            document.getElementById('close-video-modal').addEventListener('click', () => videoModal.remove()); //[cite: 4]
            videoModal.addEventListener('click', (e) => { //[cite: 4]
                if (e.target === videoModal) videoModal.remove(); //[cite: 4]
            });
        });
    }

});

function showToast(title, message) { //[cite: 4]
    const alertBox = document.createElement('div'); //[cite: 4]
    alertBox.className = 'fixed bottom-6 right-6 bg-tealDark text-white border-2 border-goldAccent p-4 sm:p-5 rounded-2xl shadow-2xl z-50 flex items-center gap-4 transition-all duration-500 transform translate-y-10 opacity-0 max-w-sm'; //[cite: 4]
    alertBox.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-goldAccent text-tealDeep flex items-center justify-center font-bold text-lg flex-shrink-0">
            <i class="fa-solid fa-check"></i>
        </div>
        <div>
            <h5 class="text-xs font-bold text-goldAccent uppercase tracking-wider">${title}</h5>
            <p class="text-xs text-gray-200 mt-0.5 leading-tight">${message}</p>
        </div>
    `; //[cite: 4]
    document.body.appendChild(alertBox); //[cite: 4]

    setTimeout(() => alertBox.classList.remove('translate-y-10', 'opacity-0'), 50); //[cite: 4]
    setTimeout(() => { //[cite: 4]
        alertBox.classList.add('translate-y-10', 'opacity-0'); //[cite: 4]
        setTimeout(() => alertBox.remove(), 500); //[cite: 4]
    }, 4000);
}

function triggerSearch() { //[cite: 4]
    const query = document.getElementById('search-input').value; //[cite: 4]
    if (query.trim()) { //[cite: 4]
        showToast('Search Triggered', `Searching for: "${query}"...`); //[cite: 4]
        document.getElementById('search-modal').classList.add('opacity-0'); //[cite: 4]
        setTimeout(() => document.getElementById('search-modal').classList.add('hidden'), 300); //[cite: 4]
    }
}

function toggleAccordion(id) { //[cite: 4]
    const body = document.getElementById(`acc-body-${id}`); //[cite: 4]
    const icon = document.getElementById(`acc-icon-${id}`); //[cite: 4]
    const isActive = body.classList.contains('active'); //[cite: 4]

    for (let i = 1; i <= 3; i++) { //[cite: 4]
        const b = document.getElementById(`acc-body-${i}`); //[cite: 4]
        const ic = document.getElementById(`acc-icon-${i}`); //[cite: 4]
        if (b) b.classList.remove('active'); //[cite: 4]
        if (ic) ic.classList.remove('rotate-180'); //[cite: 4]
    }

    if (!isActive) { //[cite: 4]
        body.classList.add('active'); //[cite: 4]
        icon.classList.add('rotate-180'); //[cite: 4]
    }
}

function openServiceModal(title, desc) { //[cite: 4]
    document.getElementById('modal-service-title').innerText = title; //[cite: 4]
    document.getElementById('modal-service-desc').innerText = desc; //[cite: 4]
    const modal = document.getElementById('service-modal'); //[cite: 4]
    modal.classList.remove('hidden'); //[cite: 4]
    setTimeout(() => modal.classList.remove('opacity-0'), 10); //[cite: 4]
}

function closeServiceModal() { //[cite: 4]
    const modal = document.getElementById('service-modal'); //[cite: 4]
    modal.classList.add('opacity-0'); //[cite: 4]
    setTimeout(() => modal.classList.add('hidden'), 300); //[cite: 4]
}

function readArticle(title, text) { //[cite: 4]
    document.getElementById('modal-article-title').innerText = title; //[cite: 4]
    document.getElementById('modal-article-body').innerText = text; //[cite: 4]
    const modal = document.getElementById('article-modal'); //[cite: 4]
    modal.classList.remove('hidden'); //[cite: 4]
    setTimeout(() => modal.classList.remove('opacity-0'), 10); //[cite: 4]
}

function closeArticleModal() { //[cite: 4]
    const modal = document.getElementById('article-modal'); //[cite: 4]
    modal.classList.add('opacity-0'); //[cite: 4]
    setTimeout(() => modal.classList.add('hidden'), 300); //[cite: 4]
}

let isYearly = false; //[cite: 4]
function togglePricing() { //[cite: 4]
    isYearly = !isYearly; //[cite: 4]
    const toggleDot = document.getElementById('toggle-dot'); //[cite: 4]
    const monthlyLabel = document.getElementById('plan-monthly-label'); //[cite: 4]
    const yearlyLabel = document.getElementById('plan-yearly-label'); //[cite: 4]

    if (isYearly) { //[cite: 4]
        toggleDot.classList.add('translate-x-6'); //[cite: 4]
        monthlyLabel.classList.replace('text-tealDark', 'text-gray-400'); //[cite: 4]
        yearlyLabel.classList.replace('text-gray-400', 'text-tealDark'); //[cite: 4]

        document.getElementById('price-starter').innerText = '$399'; //[cite: 4]
        document.getElementById('period-starter').innerText = '/ month (billed yearly)'; //[cite: 4]
        
        document.getElementById('price-growth').innerText = '$799'; //[cite: 4]
        document.getElementById('period-growth').innerText = '/ month (billed yearly)'; //[cite: 4]
        
        document.getElementById('price-enterprise').innerText = '$1,499'; //[cite: 4]
        document.getElementById('period-enterprise').innerText = '/ month (billed yearly)'; //[cite: 4]
    } else {
        toggleDot.classList.remove('translate-x-6'); //[cite: 4]
        monthlyLabel.classList.replace('text-gray-400', 'text-tealDark'); //[cite: 4]
        yearlyLabel.classList.replace('text-tealDark', 'text-gray-400'); //[cite: 4]

        document.getElementById('price-starter').innerText = '$499'; //[cite: 4]
        document.getElementById('period-starter').innerText = '/ per placement'; //[cite: 4]
        
        document.getElementById('price-growth').innerText = '$999'; //[cite: 4]
        document.getElementById('period-growth').innerText = '/ monthly retainer'; //[cite: 4]
        
        document.getElementById('price-enterprise').innerText = '$1,899'; //[cite: 4]
        document.getElementById('period-enterprise').innerText = '/ custom retainer'; //[cite: 4]
    }
}

let currentSlide = 0; //[cite: 4]
const slides = document.querySelectorAll('.testimonial-slide'); //[cite: 4]
const dots = document.querySelectorAll('.slide-dot'); //[cite: 4]

function setSlide(index) { //[cite: 4]
    slides[currentSlide].classList.remove('active'); //[cite: 4]
    dots[currentSlide].classList.replace('bg-goldAccent', 'bg-tealLight'); //[cite: 4]
    
    currentSlide = index; //[cite: 4]
    
    slides[currentSlide].classList.add('active'); //[cite: 4]
    dots[currentSlide].classList.replace('bg-tealLight', 'bg-goldAccent'); //[cite: 4]
}

function nextSlide() { //[cite: 4]
    let next = (currentSlide + 1) % slides.length; //[cite: 4]
    setSlide(next); //[cite: 4]
}

function prevSlide() { //[cite: 4]
    let prev = (currentSlide - 1 + slides.length) % slides.length; //[cite: 4]
    setSlide(prev); //[cite: 4]
}