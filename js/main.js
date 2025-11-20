// ==========================================
// PORTFOLIO CYBERPUNK - GESTIONNAIRE PRINCIPAL
// ==========================================

class CyberPortfolio {
    constructor() {
        this.modules = new Map();
        this.isInitialized = false;
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
        if (this.isInitialized) return;
        
        console.log('🚀 Initialisation du Portfolio Cyberpunk...');
        
        // Vérifier que tous les modules sont disponibles
        this.waitForModules().then(() => {
            this.initializeAllModules();
            this.isInitialized = true;
            console.log('✅ Portfolio Cyberpunk initialisé avec succès!');
        }).catch(error => {
            console.error('❌ Erreur lors de l\'initialisation:', error);
        });
    }

    // ==========================================
    // ATTENTE ET INITIALISATION DES MODULES
    // ==========================================
    
    async waitForModules() {
        const maxAttempts = 50;
        let attempts = 0;

        return new Promise((resolve, reject) => {
            const checkModules = () => {
                attempts++;
                
                const modulesReady = 
                    window.cursorManager && 
                    window.particleSystem && 
                    window.animationManager && 
                    window.navigationManager;

                if (modulesReady) {
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error('Timeout: Modules non chargés'));
                } else {
                    setTimeout(checkModules, 100);
                }
            };
            
            checkModules();
        });
    }

    initializeAllModules() {
        // Enregistrer les modules
        this.modules.set('cursor', window.cursorManager);
        this.modules.set('particles', window.particleSystem);
        this.modules.set('animations', window.animationManager);
        this.modules.set('navigation', window.navigationManager);

        // Initialiser les événements globaux
        this.initGlobalEvents();
        
        // Initialiser les interactions spéciales
        this.initSpecialInteractions();
        
        console.log('📦 Modules chargés:', Array.from(this.modules.keys()));
    }

    // ==========================================
    // ÉVÉNEMENTS GLOBAUX
    // ==========================================
    
    initGlobalEvents() {
        // Événements de performance
        this.handlePerformance();
        
        // Événements de visibilité
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAllEffects();
            } else {
                this.resumeAllEffects();
            }
        });

        // Gestion des erreurs
        window.addEventListener('error', (e) => {
            console.warn('⚠️ Erreur capturée:', e.error);
        });
    }

    initSpecialInteractions() {
        // Effet Konami code (Easter egg)
        this.initKonamiCode();
        
        // Effets de souris spéciaux
        this.initMouseEffects();
        
        // Mode debug
        this.initDebugMode();
    }

    // ==========================================
    // EFFETS SPÉCIAUX ET EASTER EGGS
    // ==========================================
    
    initKonamiCode() {
        const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
        let currentCode = [];

        document.addEventListener('keydown', (e) => {
            currentCode.push(e.keyCode);
            
            if (currentCode.length > konamiCode.length) {
                currentCode.shift();
            }
            
            if (currentCode.length === konamiCode.length && 
                currentCode.every((code, index) => code === konamiCode[index])) {
                this.activateSpecialMode();
            }
        });
    }

    activateSpecialMode() {
        console.log('🎉 Mode spécial activé!');
        
        // Changer la couleur des particules
        if (this.modules.get('particles')) {
            this.modules.get('particles').changeParticleColor('#ff6b6b');
        }
        
        // Effet de pulse global
        document.body.style.animation = 'pulse 2s ease-in-out infinite';
        
        // Créer un message
        const message = document.createElement('div');
        message.textContent = '🎊 CYBER MODE ACTIVATED! 🎊';
        message.style.cssText = `
            position: fixed; top: 50%; left: 50%; 
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
            background-size: 200% 200%;
            animation: gradient 2s ease infinite, fadeOut 4s ease-in-out;
            color: white; padding: 20px 40px; 
            border-radius: 15px; font-size: 24px; 
            font-family: 'Orbitron', sans-serif;
            z-index: 10000; text-align: center;
            box-shadow: 0 0 50px rgba(255, 107, 107, 0.5);
        `;

        // Ajouter l'animation gradient
        const style = document.createElement('style');
        style.textContent = `
            @keyframes gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes fadeOut {
                0%, 70% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
            document.body.style.animation = '';
        }, 4000);
    }

    initMouseEffects() {
        let clickCount = 0;
        let clickTimer = null;

        document.addEventListener('click', (e) => {
            clickCount++;
            
            // Triple click pour effet spécial
            if (clickCount === 3) {
                this.createFireworks(e.clientX, e.clientY);
                clickCount = 0;
            }
            
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 1000);
        });
    }

    createFireworks(x, y) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7d794', '#a8e6cf'];
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const angle = (Math.PI * 2 * i) / 20;
            const distance = 100 + Math.random() * 100;
            
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 6px;
                height: 6px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: firework 1.5s ease-out forwards;
                --x: ${Math.cos(angle) * distance}px;
                --y: ${Math.sin(angle) * distance}px;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1500);
        }

        // Animation CSS pour les feux d'artifice
        if (!document.getElementById('firework-style')) {
            const style = document.createElement('style');
            style.id = 'firework-style';
            style.textContent = `
                @keyframes firework {
                    0% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    initDebugMode() {
        // Activer le mode debug avec Ctrl+Shift+D
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
                this.toggleDebugMode();
            }
        });
    }

    toggleDebugMode() {
        const debugInfo = document.getElementById('debug-info');
        
        if (debugInfo) {
            debugInfo.remove();
        } else {
            this.createDebugPanel();
        }
    }

    createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'debug-info';
        panel.style.cssText = `
            position: fixed; top: 10px; right: 10px;
            background: rgba(0, 0, 0, 0.8); color: #00ff00;
            padding: 15px; border-radius: 8px; 
            font-family: monospace; font-size: 12px;
            z-index: 10000; max-width: 300px;
            border: 1px solid var(--primary-color);
        `;
        
        const updateDebugInfo = () => {
            const info = {
                'Modules actifs': Array.from(this.modules.keys()).join(', '),
                'Particules': document.querySelectorAll('.particule').length,
                'Résolution': `${window.innerWidth}x${window.innerHeight}`,
                'Scroll Y': Math.round(window.scrollY),
                'Timestamp': new Date().toLocaleTimeString()
            };
            
            panel.innerHTML = '<h4 style="color: var(--primary-color); margin: 0 0 10px 0;">🐛 Debug Panel</h4>' +
                Object.entries(info).map(([key, value]) => 
                    `<div><strong>${key}:</strong> ${value}</div>`
                ).join('');
        };
        
        updateDebugInfo();
        setInterval(updateDebugInfo, 1000);
        
        document.body.appendChild(panel);
    }

    // ==========================================
    // GESTION DE LA PERFORMANCE
    // ==========================================
    
    handlePerformance() {
        // Réduire les effets sur les appareils moins performants
        const isLowPerformance = navigator.hardwareConcurrency < 4 || 
                                navigator.deviceMemory < 4;
        
        if (isLowPerformance) {
            console.log('🔧 Mode performance réduite activé');
            this.enableLowPerformanceMode();
        }
        
        // Surveillance FPS
        this.monitorFPS();
    }

    enableLowPerformanceMode() {
        // Réduire le nombre de particules
        const particles = document.querySelectorAll('.particule');
        particles.forEach((particle, index) => {
            if (index % 2 === 0) particle.remove();
        });
        
        // Désactiver certaines animations coûteuses
        document.documentElement.style.setProperty('--transition-fast', '0.1s ease');
        document.documentElement.style.setProperty('--transition-slow', '0.2s ease');
    }

    monitorFPS() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const checkFPS = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                const fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;
                
                if (fps < 30) {
                    console.warn('⚠️ FPS faible détecté:', fps);
                    this.enableLowPerformanceMode();
                }
            }
            
            requestAnimationFrame(checkFPS);
        };
        
        requestAnimationFrame(checkFPS);
    }

    // ==========================================
    // CONTRÔLE DES EFFETS
    // ==========================================
    
    pauseAllEffects() {
        this.modules.forEach(module => {
            if (module && typeof module.pause === 'function') {
                module.pause();
            }
        });
    }

    resumeAllEffects() {
        this.modules.forEach(module => {
            if (module && typeof module.resume === 'function') {
                module.resume();
            }
        });
    }

    // ==========================================
    // MÉTHODES UTILITAIRES
    // ==========================================
    
    getModule(name) {
        return this.modules.get(name);
    }

    destroy() {
        this.modules.forEach(module => {
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        this.modules.clear();
        this.isInitialized = false;
        
        console.log('🔥 Portfolio Cyberpunk détruit');
    }
}

// Initialisation globale
window.cyberPortfolio = new CyberPortfolio();