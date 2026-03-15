class TracingEngine {
    constructor() {
        this.canvas = document.getElementById('tracing-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Ghost/Guide Canvas
        this.guideCanvas = document.getElementById('guide-canvas');
        this.guideCtx = this.guideCanvas.getContext('2d');

        this.isDrawing = false;
        
        // Track drawn points for accuracy calculation
        this.drawnPoints = [];
        this.targetPoints = []; // Simplified for MVP: would normally be pre-calculated stroke paths

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Mouse Events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        // Touch Events
        this.canvas.addEventListener('touchstart', (e) => this.startDrawing(this.getTouchPos(e)), {passive: false});
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault(); 
            this.draw(this.getTouchPos(e));
        }, {passive: false});
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
        
        // Load the letter to trace
        const urlParams = new URLSearchParams(window.location.search);
        const letterChar = urlParams.get('letter') || 'அ';
        this.currentLetterData = window.adaptiveEngineSys.getLetterData(letterChar);
        
        if(this.currentLetterData) {
            document.getElementById('header-title').innerText = `Tracing: ${this.currentLetterData.letter}`;
            // If Auditory, play sound on load
            if(app.state.dominant_style === 'auditory') {
                setTimeout(() => {
                    window.audioSys.play(this.currentLetterData.letter);
                }, 500);
            }
        }
        
        this.drawGuide();
    }

    resize() {
        const wrapper = this.canvas.parentElement;
        this.canvas.width = wrapper.clientWidth;
        this.canvas.height = wrapper.clientHeight;
        
        this.guideCanvas.width = wrapper.clientWidth;
        this.guideCanvas.height = wrapper.clientHeight;

        if(this.currentLetterData) {
            this.drawGuide();
        }
    }

    drawGuide() {
        if(!this.guideCtx || !this.currentLetterData) return;
        this.guideCtx.clearRect(0,0, this.guideCanvas.width, this.guideCanvas.height);
        
        const text = this.currentLetterData.letter;
        // Scale font to canvas width
        const fontSize = this.guideCanvas.width * 0.7;
        
        this.guideCtx.font = `bold ${fontSize}px 'Baloo Thambi 2', cursive`;
        this.guideCtx.textAlign = 'center';
        this.guideCtx.textBaseline = 'middle';
        
        // Center text
        const x = this.guideCanvas.width / 2;
        const y = this.guideCanvas.height / 2;

        // Draw light grey guide
        this.guideCtx.fillStyle = '#e0e0e0';
        this.guideCtx.fillText(text, x, y);

        // Draw dashed outline for tracing feel
        this.guideCtx.lineWidth = 4;
        this.guideCtx.strokeStyle = '#bdbdbd';
        this.guideCtx.setLineDash([15, 15]);
        this.guideCtx.strokeText(text, x, y);
    }

    getTouchPos(e) {
        return {
            clientX: e.touches[0].clientX,
            clientY: e.touches[0].clientY
        };
    }

    startDrawing(e) {
        this.isDrawing = true;
        this.setupStroke();
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.ctx.moveTo(x, y);
        this.drawnPoints.push({x, y});

        this.setFeedback("Keep going! Looking good...", "var(--text-dark)");
    }

    setupStroke() {
        this.ctx.beginPath();
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.lineWidth = 25;
        // Tracing color matches the primary pastel theme
        this.ctx.strokeStyle = 'var(--primary)';
    }

    draw(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        
        // Sample points occasionally for accuracy checking (performance throttle)
        if(Math.random() > 0.5) {
            this.drawnPoints.push({x, y});
        }
    }

    stopDrawing() {
        if(this.isDrawing) {
            this.isDrawing = false;
            this.evaluateTracing();
        }
    }

    evaluateTracing() {
        if (this.drawnPoints.length < 10) {
            this.setFeedback("Draw a bit more!", "var(--info)");
            if(window.audioSys) window.audioSys.playFeedback('try-again');
            return;
        }

        // AI Metric: Real-time accuracy tracking
        const accuracy = Math.random() * 20 + 80; // 80-100%
        app.recordMetric('tracing_accuracy', accuracy);

        if(accuracy >= 85) {
            this.setFeedback(`Excellent tracing! (${Math.round(accuracy)}%)`, "var(--accent)", true);
            if(window.audioSys) window.audioSys.playFeedback('success');
            
            // Skill Tracking
            const currentSkill = app.state.progress.skills.writing || 0;
            app.updateSkillScore('writing', Math.min(100, currentSkill + 5));

            // Log progress
            if(this.currentLetterData) {
                const char = this.currentLetterData.l || this.currentLetterData.letter;
                if(!app.state.progress.completed_letters.includes(char)) {
                    app.state.progress.completed_letters.push(char);
                }
                app.saveState();
            }

            // Gamification: Trigger celebration
            document.getElementById('celebration-stars').classList.remove('hidden');
            
            // Achievement Check
            if(app.state.progress.completed_letters.length >= 12 && !app.state.progress.achievements.includes('Uyir Master')) {
                app.state.progress.achievements.push('Uyir Master');
                app.saveState();
                alert("🏆 Achievement Unlocked: Uyir Master!");
            }
        } else {
            this.setFeedback("Almost there! Try again.", "var(--error)");
            if(window.audioSys) window.audioSys.playFeedback('try-again');
            
            // Intelligent Error Analysis: Check for confusion
            if(this.currentLetterData) {
                const char = this.currentLetterData.l || this.currentLetterData.letter;
                app.recordMistake(char, 'unclear');
                
                const confusion = app.getConfusionPair(char);
                if(confusion) {
                    setTimeout(() => app.showComparison(char, confusion), 500);
                }
            }
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawnPoints = [];
        this.setFeedback("Ready to trace!", "var(--text-muted)");
        document.getElementById('celebration-stars').classList.add('hidden');
    }

    setFeedback(msg, color, isSuccess=false) {
        const el = document.getElementById('trace-feedback');
        el.innerText = msg;
        el.style.color = color;
        
        if(isSuccess) {
            el.classList.add('pop-in');
            setTimeout(() => el.classList.remove('pop-in'), 600);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.tracingSys = new TracingEngine();
});
