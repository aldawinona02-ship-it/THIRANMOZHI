/**
 * THIRANMOZHI - App Controller (app.js)
 * Logic: Manages navigation, Assessment results, and Canvas Tracing
 */

class ThiranmozhiApp {
    constructor() {
        this.currentStyle = localStorage.getItem('userStyle') || 'Visual';
        this.isDrawing = false;
        this.ctx = null;
        this.canvas = null;
        this.tracePoints = [];

        // Check if AdaptiveEngine exists before initializing
        this.engine = typeof AdaptiveEngine !== 'undefined' ? new AdaptiveEngine() : null;
        
        this.currentLessonPath = [];
        this.currentLetterIdx = 0;
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupCanvas();
        this.syncUIWithStyle();
        console.log("Thiranmozhi Web App initialized!");
    }

    // --- Navigation Logic ---
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
        // Update Nav Active State
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        const navItem = document.querySelector(`.nav-item[data-target="${viewId}"]`);
        if (navItem) navItem.classList.add('active');

        // Toggle Views
        document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
        const targetView = document.getElementById(`view-${viewId}`);
        if (targetView) targetView.classList.add('active');

        // Specialized initialization
        if (viewId === 'learn') {
            this.resizeCanvas();
        }
    }

    // --- Sync UI with Assessment Style ---
    syncUIWithStyle() {
        const badge = document.getElementById('current-style-badge');
        if (badge) {
            badge.innerText = `Style: ${this.currentStyle}`;
            badge.style.background = 'var(--primary)';
        }
    }

    // --- Assessment Logic ---
    recordStyle(selectedStyle) {
        this.currentStyle = selectedStyle;
        localStorage.setItem('userStyle', selectedStyle);

        // UI Updates
        const questionCard = document.querySelector('.question-card');
        if (questionCard) questionCard.classList.add('hidden');

        const resultCard = document.getElementById('assessment-result');
        if (resultCard) resultCard.classList.remove('hidden');

        const styleName = document.getElementById('result-style');
        if (styleName) styleName.innerText = selectedStyle;

        this.syncUIWithStyle();
    }

    // --- Canvas & Tracing Logic ---
    setupCanvas() {
        this.canvas = document.getElementById('tracing-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');

        // Mouse Listeners
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseleave', () => this.stopDrawing());

        // Touch Listeners
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.cancelable) e.preventDefault();
            this.startDrawing(this.getTouchPos(e));
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            if (e.cancelable) e.preventDefault();
            this.draw(this.getTouchPos(e));
        }, { passive: false });

        this.canvas.addEventListener('touchend', () => this.stopDrawing());

        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();
    }

    resizeCanvas() {
        if (!this.canvas) return;
        const wrapper = this.canvas.parentElement;
        this.canvas.width = wrapper.clientWidth;
        this.canvas.height = wrapper.clientHeight;

        // Reset Styles (Canvas clears on resize)
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.lineWidth = 15;
        this.ctx.strokeStyle = '#FF6B6B';
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
        const x = (e.clientX || e.pageX) - rect.left;
        const y = (e.clientY || e.pageY) - rect.top;
        
        this.ctx.moveTo(x, y);
        this.tracePoints = [{ x, y }];

        const feedback = document.getElementById('trace-feedback');
        if (feedback) {
            feedback.innerText = "Awesome, keep tracing!";
            feedback.style.color = '#F9C74F';
            feedback.classList.add('pulse');
        }
    }

    draw(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX || e.pageX) - rect.left;
        const y = (e.clientY || e.pageY) - rect.top;

        this.tracePoints.push({ x, y });

        // Dynamic Stroke Effect (Luxury Look)
        const hue = (this.tracePoints.length % 360);
        this.ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = `hsl(${hue}, 80%, 60%)`;
        this.ctx.lineWidth = 18 - (Math.min(this.tracePoints.length / 10, 8));

        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    stopDrawing() {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        this.ctx.shadowBlur = 0;
        this.calculateAccuracy();
    }

    calculateAccuracy() {
        // Logic: Length of trace relative to expected complexity
        const score = Math.min(Math.floor(this.tracePoints.length / 4), 100);
        
        // XP System
        let xp = parseInt(localStorage.getItem('tm_xp')) || 0;
        xp += Math.floor(score / 10);
        localStorage.setItem('tm_xp', xp);

        const feedback = document.getElementById('trace-feedback');
        if (feedback) {
            feedback.innerText = score > 80 ? "Great job!" : "Ready to trace!";
            feedback.style.color = score > 80 ? '#4361EE' : '#FF6B6B';
            feedback.classList.remove('pulse');
        }

        const badge = document.getElementById('accuracy-badge');
        if (badge) {
            badge.innerText = `${score}% Match`;
            badge.style.display = 'inline-block';
            badge.style.background = score > 80 ? 'var(--success)' : 'var(--warning)';
        }
    }

    clearCanvas() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const feedback = document.getElementById('trace-feedback');
        if (feedback) {
            feedback.innerText = "Ready to trace!";
            feedback.style.color = 'var(--text-muted)';
        }
    }

    // Pronunciation using Tamil TTS
    playPronunciation() {
        const letterEl = document.getElementById('current-letter') || document.getElementById('target-letter');
        const letter = letterEl?.innerText || "அ";
        
        if ('speechSynthesis' in window) {
            const msg = new SpeechSynthesisUtterance(letter);
            msg.lang = 'ta-IN';
            msg.rate = 0.8;
            window.speechSynthesis.cancel(); 
            window.speechSynthesis.speak(msg);
        }
    }

    async startLesson() {
        if (this.engine) {
            this.currentLessonPath = this.engine.getLettersForStage(localStorage.getItem('tm_current_stage') || 'basic');
            this.currentLetterIdx = 0;
            this.renderCurrentLetter();
        }
    }

    renderCurrentLetter() {
        const letterData = this.currentLessonPath[this.currentLetterIdx];
        if (!letterData) return;

        const letterEl = document.getElementById('current-letter');
        if (letterEl) letterEl.innerText = letterData.l;

        const progressBar = document.getElementById('lesson-progress-bar');
        if (progressBar) {
            const percent = ((this.currentLetterIdx + 1) / this.currentLessonPath.length) * 100;
            progressBar.style.width = `${percent}%`;
        }

        this.clearCanvas();
        this.playPronunciation();
    }

    nextLetter() {
        if (this.currentLetterIdx < this.currentLessonPath.length - 1) {
            this.currentLetterIdx++;
            this.renderCurrentLetter();
        } else {
            alert("Congrats! Lesson completed.");
            window.location.href = 'map.html';
        }
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ThiranmozhiApp();
});
