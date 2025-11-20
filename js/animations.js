// ==========================================
// GESTIONNAIRE D'ANIMATIONS ET D'EFFETS
// ==========================================

class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.initScrollAnimations();
        this.initNavigationScrolling();
        this.initAboutSectionAnimations();
        this.initTerminalEffects();
        this.initStatCards();
    }

    // ==========================================
    // ANIMATIONS AU SCROLL
    // ==========================================
    
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Éléments à observer
        const elementsToAnimate = document.querySelectorAll(`
            .about-text, 
            .about-visual, 
            .tags-container, 
            .stats-grid,
            .skill-domain,
            .timeline-item,
            .project-card,
            .ctf-card,
            .experience-item
        `);

        elementsToAnimate.forEach(el => {
            observer.observe(el);
        });

        this.observers.set('scroll', observer);
    }

    animateElement(element) {
        element.classList.add('visible');
        element.classList.add('animated');
        
        // Animations spécifiques par type d'élément
        if (element.classList.contains('tags-container')) {
            this.animateTags(element);
        }
        
        if (element.classList.contains('stats-grid')) {
            this.animateStats(element);
        }
        
        if (element.classList.contains('timeline-item')) {
            this.animateTimelineItem(element);
        }
    }

    // ==========================================
    // NAVIGATION ET DÉFILEMENT
    // ==========================================
    
    initNavigationScrolling() {
        // Défilement fluide pour les ancres
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            });
        });

        // Effet sur le header au scroll
        const header = document.querySelector('.en-tete');
        if (header) {
            let lastScrollY = window.scrollY;
            
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                // Effet de parallaxe subtil
                if (currentScrollY > lastScrollY) {
                    header.style.transform = 'translateY(-10px)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                
                lastScrollY = currentScrollY;
            });
        }
    }

    // ==========================================
    // ANIMATIONS SPÉCIFIQUES
    // ==========================================
    
    animateTags(container) {
        const tags = container.querySelectorAll('.tag');
        tags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.animation = 'tagPop 0.5s ease-out forwards';
                tag.style.opacity = '1';
                tag.style.transform = 'scale(1)';
            }, index * 100);
        });
    }

    animateStats(grid) {
        const cards = grid.querySelectorAll('.stat-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'statCardAppear 0.6s ease-out forwards';
                
                const statValue = card.querySelector('.stat-value');
                if (statValue) {
                    const originalText = statValue.textContent.trim();
                    this.animateStatValue(statValue, originalText);
                }
            }, index * 150);
        });
    }

    animateStatValue(element, originalText) {
        // Détection du type de valeur
        const numberWithPlus = originalText.match(/^(\d+)\+$/);
        const numberWithPercent = originalText.match(/^(\d+)%$/);
        const pureNumber = originalText.match(/^(\d+)$/);
        
        if (numberWithPlus || numberWithPercent || pureNumber) {
            let targetNumber, suffix;
            
            if (numberWithPlus) {
                targetNumber = parseInt(numberWithPlus[1]);
                suffix = '+';
            } else if (numberWithPercent) {
                targetNumber = parseInt(numberWithPercent[1]);
                suffix = '%';
            } else if (pureNumber) {
                targetNumber = parseInt(pureNumber[1]);
                suffix = '';
            }
            
            this.animateCounter(element, targetNumber, suffix);
        } else {
            this.typeWriter(element, originalText);
        }
    }

    animateCounter(element, target, suffix) {
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
                
                // Effet de pulse à la fin
                element.style.animation = 'pulse 0.6s ease-in-out';
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, duration / steps);
    }

    typeWriter(element, text) {
        element.textContent = '';
        let index = 0;
        const speed = 200;
        
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }

    animateTimelineItem(item) {
        const content = item.querySelector('.timeline-content');
        const circle = item.querySelector('.timeline-circle');
        
        if (content) {
            content.style.animation = 'slideInUp 0.8s ease-out forwards';
        }
        
        if (circle) {
            circle.style.animation = 'pulse 1s ease-in-out';
        }
    }

    // ==========================================
    // SECTION ABOUT ME - ANIMATIONS AVANCÉES
    // ==========================================
    
    initAboutSectionAnimations() {
        // Animation des cartes de statistiques
        setTimeout(() => {
            this.initStatCards();
        }, 100);
        
        // Effets sur les tags
        this.initTagEffects();
    }

    initStatCards() {
        const statCards = document.querySelectorAll('.stat-card');
        
        if (statCards.length === 0) {
            setTimeout(() => this.initStatCards(), 500);
            return;
        }
        
        statCards.forEach((card, index) => {
            // Effet au survol
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.stat-icon');
                const glow = card.querySelector('.stat-glow');
                
                if (icon) {
                    icon.style.animation = 'pulse 0.6s ease-in-out';
                }
                
                if (glow) {
                    glow.style.opacity = '1';
                }
                
                // Effet sur les cartes adjacentes
                this.rippleEffect(card, statCards);
            });

            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.stat-icon');
                const glow = card.querySelector('.stat-glow');
                
                if (icon) {
                    setTimeout(() => {
                        icon.style.animation = '';
                    }, 600);
                }
                
                if (glow) {
                    glow.style.opacity = '0';
                }
            });
        });
    }

    initTagEffects() {
        const tags = document.querySelectorAll('.tag, .tech-tag, .skill-tag');
        
        tags.forEach(tag => {
            tag.addEventListener('click', () => {
                this.tagClickEffect(tag);
            });
        });
    }

    tagClickEffect(tag) {
        // Effet de ondulation
        tag.style.transform = 'scale(0.95)';
        tag.style.background = 'rgba(18, 118, 158, 0.4)';
        
        setTimeout(() => {
            tag.style.transform = 'scale(1.05)';
            tag.style.background = 'rgba(18, 118, 158, 0.2)';
            
            setTimeout(() => {
                tag.style.transform = 'scale(1)';
                tag.style.background = 'rgba(18, 118, 158, 0.1)';
            }, 150);
        }, 100);
    }

    rippleEffect(targetCard, allCards) {
        allCards.forEach((card, index) => {
            if (card !== targetCard) {
                card.style.transform = 'translateY(-2px) scale(0.98)';
                card.style.opacity = '0.8';
                
                setTimeout(() => {
                    card.style.transform = 'translateY(0) scale(1)';
                    card.style.opacity = '1';
                }, 200);
            }
        });
    }

    // ==========================================
    // EFFETS TERMINAL
    // ==========================================
    
    initTerminalEffects() {
        const terminal = document.querySelector('.terminal-body');
        const terminalContainer = document.querySelector('.terminal-container');
        
        if (!terminal || !terminalContainer) return;

        // Effet au survol du terminal
        terminalContainer.addEventListener('mouseenter', () => {
            terminalContainer.style.boxShadow = '0 10px 40px rgba(18, 118, 158, 0.4)';
            terminalContainer.style.borderColor = 'var(--primary-color)';
        });

        terminalContainer.addEventListener('mouseleave', () => {
            terminalContainer.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.5)';
            terminalContainer.style.borderColor = 'rgba(18, 118, 158, 0.3)';
        });

        // Effet de glitch aléatoire
        this.startGlitchEffect(terminal);
        
        // Curseur clignotant
        this.initTypingCursor();
    }

    startGlitchEffect(terminal) {
        setInterval(() => {
            if (Math.random() > 0.95) {
                const lines = terminal.querySelectorAll('.terminal-line');
                lines.forEach(line => {
                    line.style.textShadow = '2px 0 rgba(18, 118, 158, 0.8), -2px 0 rgba(255, 0, 255, 0.8)';
                    line.style.transform = 'translateX(2px)';
                    
                    setTimeout(() => {
                        line.style.textShadow = 'none';
                        line.style.transform = 'translateX(0)';
                    }, 50);
                });
            }
        }, 3000);
    }

    initTypingCursor() {
        const cursor = document.querySelector('.typing-cursor');
        if (cursor) {
            // Le curseur clignote déjà avec l'animation CSS
            // Ajouter un effet de frappe occasionnel
            setInterval(() => {
                if (Math.random() > 0.7) {
                    cursor.textContent = Math.random() > 0.5 ? '|' : '_';
                }
            }, 500);
        }
    }

    // ==========================================
    // MÉTHODES UTILITAIRES
    // ==========================================
    
    addCustomAnimation(element, animationName, duration = '1s', easing = 'ease-out') {
        element.style.animation = `${animationName} ${duration} ${easing} forwards`;
    }

    removeAllAnimations(element) {
        element.style.animation = 'none';
    }

    pauseAllAnimations() {
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    }

    resumeAllAnimations() {
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }

    destroy() {
        // Nettoyer les observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        this.animatedElements.clear();
    }
}

// ==========================================
// NAVIGATION MANAGER
// ==========================================

class NavigationManager {
    constructor() {
        this.activeSection = 'home';
        this.init();
    }

    init() {
        this.setupSectionObserver();
        this.setupActiveLinks();
    }

    setupSectionObserver() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    this.setActiveSection(entry.target.id);
                    this.updateActiveLinks(entry.target.id);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-50px 0px -50px 0px'
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    setActiveSection(sectionId) {
        this.activeSection = sectionId;
    }

    updateActiveLinks(activeSectionId) {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeSectionId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setupActiveLinks() {
        // Ajouter les styles pour les liens actifs si pas déjà fait
        const style = document.createElement('style');
        style.textContent = `
            nav a.active {
                color: #26a4d6 !important;
                text-shadow: 0 0 15px rgba(38, 164, 214, 0.8) !important;
            }
            nav a.active::after {
                width: 100% !important;
                box-shadow: 0 0 15px var(--primary-color) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Auto-initialisation
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.animationManager = new AnimationManager();
        window.navigationManager = new NavigationManager();
        
        // Gestion de la visibilité de la page
        document.addEventListener('visibilitychange', () => {
            if (window.animationManager) {
                if (document.hidden) {
                    window.animationManager.pauseAllAnimations();
                } else {
                    window.animationManager.resumeAllAnimations();
                }
            }
        });
    });
}