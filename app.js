class ThiranmozhiApp {
    constructor() {
        this.currentStyle = null;
        this.isDrawing = false;
        this.ctx = null;
        this.canvas = null;

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupCanvas();
        console.log("Thiranmozhi Web App initialized!");
    }

    // --- Navigation ---
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetViewId = item.getAttribute('data-target');
                this.navigateTo(targetViewId);
            });
        });
    }

    navigateTo(viewId) {
        // 1. Update navigation active state
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        const navItem = document.querySelector(`.nav-item[data-target="${viewId}"]`);
        if (navItem) navItem.classList.add('active');

        // 2. Hide all views and show target
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        const targetView = document.getElementById(`view-${viewId}`);
        if(targetView) {
            targetView.classList.add('active');
        }

        // 3. Special initialization for specific views
        if(viewId === 'learn') {
            this.resizeCanvas();
        }
    }

    // --- Assessment Wizard ---
    recordStyle(selectedStyle) {
        this.currentStyle = selectedStyle;
        
        // Hide questions
        document.querySelector('.question-card').classList.add('hidden');
        
        // Update user badge
        const badge = document.getElementById('current-style-badge');
        badge.innerText = `Style: ${selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1)}`;
        badge.style.background = 'var(--accent)';
        badge.style.color = '#b78a00';

        // Update result card and show
        document.getElementById('result-style').innerText = selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1);
        document.getElementById('assessment-result').classList.remove('hidden');

        // Modify the learning module slightly based on style
        const adaptationBadge = document.getElementById('adaptation-badge');
        adaptationBadge.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Adaptive Mode: ${selectedStyle.toUpperCase()}`;
    }

    // --- Learning Module (Canvas & Audio) ---
    setupCanvas() {
        this.canvas = document.getElementById('tracing-canvas');
        if(!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        
        // Mouse Events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        // Touch Events
        this.canvas.addEventListener('touchstart', (e) => this.startDrawing(this.getTouchPos(e)), {passive: false});
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling while tracing
            this.draw(this.getTouchPos(e));
        }, {passive: false});
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
        
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        this.resizeCanvas();
    }

    resizeCanvas() {
        if(!this.canvas) return;
        const wrapper = this.canvas.parentElement;
        this.canvas.width = wrapper.clientWidth;
        this.canvas.height = wrapper.clientHeight;
        
        // Set context properties again after resize
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.lineWidth = 15;
        this.ctx.strokeStyle = '#FF6B6B'; // Primary color
    }

    getTouchPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            clientX: e.touches[0].clientX,
            clientY: e.touches[0].clientY
        };
    }

    startDrawing(e) {
        this.isDrawing = true;
        this.ctx.beginPath();
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.ctx.moveTo(x, y);

        // Feedback Update
        document.getElementById('trace-feedback').innerText = "Awesome, keep tracing!";
        document.getElementById('trace-feedback').style.color = 'var(--warning)';
    }

    draw(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    stopDrawing() {
        if(this.isDrawing) {
            this.isDrawing = false;
            document.getElementById('trace-feedback').innerText = "Great job!";
            document.getElementById('trace-feedback').style.color = 'var(--success)';
        }
    }

    clearCanvas() {
        if(!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        document.getElementById('trace-feedback').innerText = "Ready to trace!";
        document.getElementById('trace-feedback').style.color = 'var(--text-muted)';
    }

    // Mocks audio playing by using the SpeechSynthesis feature in browser
    playPronunciation() {
        const letter = document.getElementById('target-letter').innerText;
        
        // Simple visual feedback
        const btn = document.querySelector('.fa-volume-high').parentElement;
        btn.style.transform = "scale(1.2)";
        btn.style.backgroundColor = "var(--success)";
        
        setTimeout(() => {
            btn.style.transform = "scale(1)";
            btn.style.backgroundColor = "var(--info)";
        }, 300);

        if ('speechSynthesis' in window) {
            // "அ" sound representation roughly. 
            // Setting lang to ta-IN to use Tamil TTS if available 
            const msg = new SpeechSynthesisUtterance(letter);
            msg.lang = 'ta-IN';
            window.speechSynthesis.speak(msg);
        } else {
            console.log("Audio mock triggered: " + letter);
        }
    }

    showTracingGuide() {
        alert("In the full app, this will show a glowing path indicating stroke order for the letter.");
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ThiranmozhiApp();
});
