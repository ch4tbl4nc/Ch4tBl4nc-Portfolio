// ==========================================
// SYSTÈME DE PARTICULES CYBERPUNK
// ==========================================

class ParticleSystem {
    constructor() {
        this.container = null;
        this.particles = [];
        this.animationId = null;
        this.init();
    }

    init() {
        this.container = document.getElementById('particules');
        if (!this.container) {
            console.warn('Conteneur de particules non trouvé');
            return;
        }

        this.createFloatingParticles();
        this.createMatrixEffect();
    }

    // ==========================================
    // PARTICULES FLOTTANTES
    // ==========================================
    
    createFloatingParticles() {
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particule';
            
            // Position et timing aléatoires
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 8 + 12) + 's';
            
            // Variations de taille et d'opacité
            const size = 2 + Math.random() * 4;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Couleur avec variations
            const colorVariation = Math.random() * 0.3 + 0.7;
            particle.style.background = `rgba(18, 118, 158, ${colorVariation})`;
            
            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    // ==========================================
    // EFFET MATRIX CYBERPUNK
    // ==========================================
    
    createMatrixEffect() {
        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-canvas';
        canvas.style.cssText = `
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%;
            pointer-events: none; 
            z-index: 1; 
            opacity: 0.1;
        `;
        
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.ctx = ctx;
        
        this.setupMatrix();
        this.startMatrixAnimation();
        
        // Redimensionnement
        window.addEventListener('resize', () => {
            this.resizeMatrix();
        });
    }

    setupMatrix() {
        this.resizeMatrix();
        
        // Caractères pour l'effet matrix
        this.chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.fontSize = 14;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }

    resizeMatrix() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        if (this.ctx) {
            this.columns = Math.floor(this.canvas.width / this.fontSize);
            this.drops = Array(this.columns).fill(1);
        }
    }

    startMatrixAnimation() {
        const animate = () => {
            // Fond semi-transparent pour créer l'effet de traînée
            this.ctx.fillStyle = 'rgba(5, 20, 28, 0.05)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Couleur des caractères
            this.ctx.fillStyle = '#12769E';
            this.ctx.font = this.fontSize + 'px monospace';
            
            // Dessiner les caractères
            for (let i = 0; i < this.drops.length; i++) {
                const text = this.chars[Math.floor(Math.random() * this.chars.length)];
                const x = i * this.fontSize;
                const y = this.drops[i] * this.fontSize;
                
                this.ctx.fillText(text, x, y);
                
                // Réinitialiser la colonne si elle atteint le bas
                if (y > this.canvas.height && Math.random() > 0.975) {
                    this.drops[i] = 0;
                }
                
                // Faire descendre la goutte
                this.drops[i]++;
            }
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    // ==========================================
    // PARTICULES INTERACTIVES
    // ==========================================
    
    createBurstEffect(x, y) {
        const burstCount = 8;
        
        for (let i = 0; i < burstCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 3px;
                height: 3px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: burst 0.6s ease-out forwards;
                transform-origin: center;
                --angle: ${(360 / burstCount) * i}deg;
            `;
            
            // Animation CSS dynamique
            const style = document.createElement('style');
            style.textContent = `
                @keyframes burst {
                    0% {
                        transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) rotate(var(--angle)) translateX(50px) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(particle);
            
            // Nettoyer après l'animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            }, 600);
        }
    }

    // ==========================================
    // MÉTHODES UTILITAIRES
    // ==========================================
    
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (!this.animationId) {
            this.startMatrixAnimation();
        }
    }

    destroy() {
        this.pause();
        
        // Nettoyer les particules
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        
        // Nettoyer le canvas
        const canvas = document.getElementById('matrix-canvas');
        if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }
        
        this.particles = [];
    }

    // ==========================================
    // EFFETS SPÉCIAUX
    // ==========================================
    
    addPulseEffect() {
        this.particles.forEach((particle, index) => {
            setTimeout(() => {
                particle.style.animation = 'none';
                particle.offsetHeight; // Trigger reflow
                particle.style.animation = particle.style.animationDuration + ' remontee infinite linear, 0.5s pulse ease-in-out';
            }, index * 100);
        });
    }

    changeParticleColor(color) {
        this.particles.forEach(particle => {
            particle.style.background = color;
            particle.style.boxShadow = `0 0 6px ${color}`;
        });
    }
}

// Auto-initialisation
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.particleSystem = new ParticleSystem();
        
        // Ajouter effet de burst au clic
        document.addEventListener('click', (e) => {
            if (window.particleSystem && e.clientX && e.clientY) {
                window.particleSystem.createBurstEffect(e.clientX, e.clientY);
            }
        });
        
        // Gestion de la visibilité de la page
        document.addEventListener('visibilitychange', () => {
            if (window.particleSystem) {
                if (document.hidden) {
                    window.particleSystem.pause();
                } else {
                    window.particleSystem.resume();
                }
            }
        });
    });
}