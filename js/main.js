// ==========================================
// PORTFOLIO CYBERPUNK - GESTIONNAIRE PRINCIPAL
// ==========================================

class CyberPortfolio {
    constructor() {
        this.modules = new Map();
        this.init();
    }

    // ==========================================
    // INITIALISATION DE L'APPLICATION
    // ==========================================
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        this.initCursor();
        this.initParticles();
        this.initNavigation();
        this.initEffects();
        console.log('🎯 Portfolio initialisé avec succès');
    }

    // ==========================================
    // GESTION DU CURSEUR PERSONNALISÉ
    // ==========================================
    
    initCursor() {
        const cursor = document.querySelector('.curseur');
        const cursorFollower = document.querySelector('.suiveur-curseur');

        if (!cursor || !cursorFollower) return;

        // Gestion du mouvement de la souris
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 50);
        });

        // Effet hover sur les éléments interactifs
        document.querySelectorAll('a, button, i, .carte-profil').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.background = 'rgba(18, 118, 158, 0.2)';
            });

            element.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.background = 'transparent';
            });
        });
    }

    // ==========================================
    // SYSTÈME DE PARTICULES FLOTTANTES
    // ==========================================
    
    initParticles() {
        const container = document.getElementById('particules');
        if (!container) return;

        // Création de 30 particules avec propriétés aléatoires
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particule';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 8 + 12) + 's';
            container.appendChild(particle);
        }
    }

    // ==========================================
    // NAVIGATION ET DÉFILEMENT FLUIDE
    // ==========================================
    
    initNavigation() {
        // Défilement fluide pour les liens d'ancrage
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Effet de header au scroll
        const header = document.querySelector('.en-tete');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
    }

    // ==========================================
    // EFFETS VISUELS CYBERPUNK
    // ==========================================
    
    initEffects() {
        this.createMatrix();
    }

    // Création de l'effet Matrix en arrière-plan
    createMatrix() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 1; opacity: 0.1;
        `;
        
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const chars = '01アイウエオABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = Array(columns).fill(1);

        // Animation de l'effet Matrix
        const animate = () => {
            // Fond semi-transparent pour l'effet de traînée
            ctx.fillStyle = 'rgba(5, 20, 28, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#12769E';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        setInterval(animate, 50);
    }
}

new CyberPortfolio();