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

            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
                contactForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    showToast('Thank You!', 'Your quote request has been sent successfully. Our team will reach out shortly.');
                    contactForm.reset();
                });
            }

            const newsletterForm = document.getElementById('newsletter-form');
            if (newsletterForm) {
                newsletterForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    showToast('Subscribed!', 'You have been subscribed to our monthly HR Insights.');
                    newsletterForm.reset();
                });
            }

            const playVideoBtn = document.getElementById('play-video-btn');
            if (playVideoBtn) {
                playVideoBtn.addEventListener('click', function () {
                    const videoModal = document.createElement('div');
                    videoModal.className = 'fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4';
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
                    `;
                    document.body.appendChild(videoModal);

                    document.getElementById('close-video-modal').addEventListener('click', () => videoModal.remove());
                    videoModal.addEventListener('click', (e) => {
                        if (e.target === videoModal) videoModal.remove();
                    });
                });
            }

        });

        function showToast(title, message) {
            const alertBox = document.createElement('div');
            alertBox.className = 'fixed bottom-6 right-6 bg-tealDark text-white border-2 border-goldAccent p-4 sm:p-5 rounded-2xl shadow-2xl z-50 flex items-center gap-4 transition-all duration-500 transform translate-y-10 opacity-0 max-w-sm';
            alertBox.innerHTML = `
                <div class="w-10 h-10 rounded-full bg-goldAccent text-tealDeep flex items-center justify-center font-bold text-lg flex-shrink-0">
                    <i class="fa-solid fa-check"></i>
                </div>
                <div>
                    <h5 class="text-xs font-bold text-goldAccent uppercase tracking-wider">${title}</h5>
                    <p class="text-xs text-gray-200 mt-0.5 leading-tight">${message}</p>
                </div>
            `;
            document.body.appendChild(alertBox);

            setTimeout(() => alertBox.classList.remove('translate-y-10', 'opacity-0'), 50);
            setTimeout(() => {
                alertBox.classList.add('translate-y-10', 'opacity-0');
                setTimeout(() => alertBox.remove(), 500);
            }, 4000);
        }

        function triggerSearch() {
            const query = document.getElementById('search-input').value;
            if (query.trim()) {
                showToast('Search Triggered', `Searching for: "${query}"...`);
                document.getElementById('search-modal').classList.add('opacity-0');
                setTimeout(() => document.getElementById('search-modal').classList.add('hidden'), 300);
            }
        }

        function toggleAccordion(id) {
            const body = document.getElementById(`acc-body-${id}`);
            const icon = document.getElementById(`acc-icon-${id}`);
            const isActive = body.classList.contains('active');

            for (let i = 1; i <= 3; i++) {
                const b = document.getElementById(`acc-body-${i}`);
                const ic = document.getElementById(`acc-icon-${i}`);
                if (b) b.classList.remove('active');
                if (ic) ic.classList.remove('rotate-180');
            }

            if (!isActive) {
                body.classList.add('active');
                icon.classList.add('rotate-180');
            }
        }

        function openServiceModal(title, desc) {
            document.getElementById('modal-service-title').innerText = title;
            document.getElementById('modal-service-desc').innerText = desc;
            const modal = document.getElementById('service-modal');
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.remove('opacity-0'), 10);
        }

        function closeServiceModal() {
            const modal = document.getElementById('service-modal');
            modal.classList.add('opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }

        function readArticle(title, text) {
            document.getElementById('modal-article-title').innerText = title;
            document.getElementById('modal-article-body').innerText = text;
            const modal = document.getElementById('article-modal');
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.remove('opacity-0'), 10);
        }

        function closeArticleModal() {
            const modal = document.getElementById('article-modal');
            modal.classList.add('opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }

        let isYearly = false;
        function togglePricing() {
            isYearly = !isYearly;
            const toggleDot = document.getElementById('toggle-dot');
            const monthlyLabel = document.getElementById('plan-monthly-label');
            const yearlyLabel = document.getElementById('plan-yearly-label');

            if (isYearly) {
                toggleDot.classList.add('translate-x-6');
                monthlyLabel.classList.replace('text-tealDark', 'text-gray-400');
                yearlyLabel.classList.replace('text-gray-400', 'text-tealDark');

                document.getElementById('price-starter').innerText = '$399';
                document.getElementById('period-starter').innerText = '/ month (billed yearly)';
                
                document.getElementById('price-growth').innerText = '$799';
                document.getElementById('period-growth').innerText = '/ month (billed yearly)';
                
                document.getElementById('price-enterprise').innerText = '$1,499';
                document.getElementById('period-enterprise').innerText = '/ month (billed yearly)';
            } else {
                toggleDot.classList.remove('translate-x-6');
                monthlyLabel.classList.replace('text-gray-400', 'text-tealDark');
                yearlyLabel.classList.replace('text-tealDark', 'text-gray-400');

                document.getElementById('price-starter').innerText = '$499';
                document.getElementById('period-starter').innerText = '/ per placement';
                
                document.getElementById('price-growth').innerText = '$999';
                document.getElementById('period-growth').innerText = '/ monthly retainer';
                
                document.getElementById('price-enterprise').innerText = '$1,899';
                document.getElementById('period-enterprise').innerText = '/ custom retainer';
            }
        }

        let currentSlide = 0;
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.slide-dot');

        function setSlide(index) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.replace('bg-goldAccent', 'bg-tealLight');
            
            currentSlide = index;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.replace('bg-tealLight', 'bg-goldAccent');
        }

        function nextSlide() {
            let next = (currentSlide + 1) % slides.length;
            setSlide(next);
        }

        function prevSlide() {
            let prev = (currentSlide - 1 + slides.length) % slides.length;
            setSlide(prev);
        }