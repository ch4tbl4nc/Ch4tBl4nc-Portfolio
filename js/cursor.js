// ==========================================
// GESTION DU CURSEUR PERSONNALISÉ CYBERPUNK
// ==========================================

class CursorManager {
    constructor() {
        this.cursor = null;
        this.cursorFollower = null;
        this.init();
    }

    init() {
        this.cursor = document.querySelector('.curseur');
        this.cursorFollower = document.querySelector('.suiveur-curseur');

        if (!this.cursor || !this.cursorFollower) {
            console.warn('Éléments curseur non trouvés');
            return;
        }

        this.bindEvents();
    }

    bindEvents() {
        // Gestion du mouvement de la souris
        document.addEventListener('mousemove', (e) => {
            this.updateCursorPosition(e.clientX, e.clientY);
        });

        // Gestion des éléments interactifs
        this.setupInteractiveElements();

        // Masquer le curseur quand il quitte la fenêtre
        document.addEventListener('mouseleave', () => {
            this.hideCursor();
        });

        document.addEventListener('mouseenter', () => {
            this.showCursor();
        });
    }

    updateCursorPosition(x, y) {
        if (!this.cursor || !this.cursorFollower) return;

        // Curseur principal
        this.cursor.style.left = x + 'px';
        this.cursor.style.top = y + 'px';
        
        // Suiveur avec délai
        setTimeout(() => {
            this.cursorFollower.style.left = x + 'px';
            this.cursorFollower.style.top = y + 'px';
        }, 50);
    }

    setupInteractiveElements() {
        const interactiveElements = document.querySelectorAll('a, button, i, .carte-profil, .ctf-card, .project-card, .stat-card, .tag, .skill-tag, .tech-tag');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.expandCursor();
            });

            element.addEventListener('mouseleave', () => {
                this.resetCursor();
            });
        });
    }

    expandCursor() {
        if (!this.cursor) return;
        
        this.cursor.style.width = '40px';
        this.cursor.style.height = '40px';
        this.cursor.style.background = 'rgba(18, 118, 158, 0.2)';
        this.cursor.style.border = '2px solid rgba(18, 118, 158, 0.8)';
    }

    resetCursor() {
        if (!this.cursor) return;
        
        this.cursor.style.width = '20px';
        this.cursor.style.height = '20px';
        this.cursor.style.background = 'transparent';
        this.cursor.style.border = '2px solid var(--primary-color)';
    }

    hideCursor() {
        if (this.cursor) this.cursor.style.opacity = '0';
        if (this.cursorFollower) this.cursorFollower.style.opacity = '0';
    }

    showCursor() {
        if (this.cursor) this.cursor.style.opacity = '1';
        if (this.cursorFollower) this.cursorFollower.style.opacity = '1';
    }

    // Méthode pour ajouter un effet de clic
    addClickEffect() {
        if (!this.cursor) return;
        
        this.cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        this.cursor.style.borderColor = '#26a4d6';
        
        setTimeout(() => {
            this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            this.cursor.style.borderColor = 'var(--primary-color)';
        }, 150);
    }
}

// Auto-initialisation
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cursorManager = new CursorManager();
        
        // Ajouter l'effet de clic
        document.addEventListener('click', () => {
            if (window.cursorManager) {
                window.cursorManager.addClickEffect();
            }
        });
    });
}