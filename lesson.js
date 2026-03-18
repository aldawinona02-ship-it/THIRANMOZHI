class LessonSystem {
    constructor() {
        this.container = document.getElementById('lesson-interaction');
        this.statusEl = document.getElementById('lesson-status');
        this.nextBtn = document.getElementById('next-btn');
        this.prevBtn = document.getElementById('prev-btn');
        
        this.currentIndex = 0;
        this.lessonPath = [];
        this.isCurrentStepComplete = false;
        
        this.style = (window.app && window.app.state && window.app.state.dominant_style) || 'visual';
        
        this.init();
    }

    async init() {
        // Wait for adaptive engine to be ready
        if (!window.adaptiveEngineSys) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        this.lessonPath = window.adaptiveEngineSys.getPersonalizedPath({ limit: 5 });
        this.updateUI();
        
        this.nextBtn.onclick = () => this.handleNext();
        this.prevBtn.onclick = () => this.handlePrev();
    }

    updateUI() {
        if (this.currentIndex >= this.lessonPath.length) {
            this.finishLesson();
            return;
        }

        const letterData = this.lessonPath[this.currentIndex];
        this.isCurrentStepComplete = false;
        this.lockNext();
        
        this.statusEl.innerText = `Letter ${this.currentIndex + 1} of ${this.lessonPath.length}`;
        
        // Render based on style
        switch(this.style) {
            case 'visual': this.renderVisual(letterData); break;
            case 'auditory': this.renderAuditory(letterData); break;
            case 'kinesthetic': this.renderKinesthetic(letterData); break;
            default: this.renderVisual(letterData);
        }
    }

    // --- VISUAL: Recognition Check ---
    renderVisual(data) {
        const distractors = this.getDistractors(data.l);
        const options = this.shuffle([data.l, ...distractors]);
        
        this.container.innerHTML = `
            <div class="visual-lesson">
                <h1 style="font-size: 8rem; font-family: var(--font-tamil); margin-bottom: 2rem;">${data.l}</h1>
                <p class="mb-2">Identify this letter to continue:</p>
                <div class="grid-3" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">
                    ${options.map(opt => `
                        <button class="btn btn-premium lesson-opt" data-val="${opt}">${opt}</button>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.container.querySelectorAll('.lesson-opt').forEach(btn => {
            btn.onclick = (e) => {
                if (e.target.dataset.val === data.l) {
                    this.markComplete("Great job! You recognized it.");
                    e.target.style.background = "var(--success)";
                    e.target.style.color = "white";
                } else {
                    app.recordMistake(data.l, e.target.dataset.val);
                    e.target.style.background = "var(--error)";
                    e.target.style.color = "white";
                    setTimeout(() => {
                        e.target.style.background = "";
                        e.target.style.color = "";
                    }, 1000);
                }
            };
        });
    }

    // --- AUDITORY: Listen & Confirm ---
    renderAuditory(data) {
        this.container.innerHTML = `
            <div class="auditory-lesson">
                <div style="font-size: 10rem; font-family: var(--font-tamil); margin-bottom: 1rem;">${data.l}</div>
                <button class="btn btn-primary btn-large mb-2" id="listen-btn" style="width: 100%; font-size: 1.5rem;">
                    <i class="fa-solid fa-volume-high"></i> Click to Listen
                </button>
                <div id="auditory-confirm" class="hidden">
                    <p class="mb-1">Did you hear the sound clearly?</p>
                    <button class="btn btn-green" id="confirm-btn" style="width: 100%;">Yes, I heard it!</button>
                </div>
            </div>
        `;
        
        const listenBtn = document.getElementById('listen-btn');
        listenBtn.onclick = () => {
            window.audioSys.play(data.l);
            document.getElementById('auditory-confirm').classList.remove('hidden');
            listenBtn.classList.add('btn-secondary');
        };
        
        document.getElementById('confirm-btn').onclick = () => {
            this.markComplete("Excellent listening!");
        };
    }

    // --- KINESTHETIC: Accuracy Tracing ---
    renderKinesthetic(data) {
        this.container.innerHTML = `
            <div class="kinesthetic-lesson" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;">
                <div class="letter-preview">
                    <div style="font-size: 10rem; font-family: var(--font-tamil);">${data.l}</div>
                    <button class="btn btn-premium" onclick="window.audioSys.play('${data.l}')">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>
                <div class="tracing-area">
                    <div class="canvas-wrapper" style="position: relative; background: white; border: 4px solid var(--glass-border); border-radius: var(--radius-md); aspect-ratio: 1/1;">
                        <canvas id="guide-canvas" width="400" height="400" style="position: absolute; top:0; left:0; width: 100%; height: 100%; opacity: 0.1;"></canvas>
                        <canvas id="tracing-canvas" width="400" height="400" style="width: 100%; height: 100%; cursor: crosshair;"></canvas>
                    </div>
                    <div id="trace-feedback" class="mt-1" style="font-weight: 700;">Trace the letter precisely</div>
                    <button class="btn btn-secondary mt-1" id="clear-trace" style="width: 100%;">Clear</button>
                </div>
            </div>
        `;
        
        this.initTracing(data.l);
    }

    initTracing(letter) {
        const canvas = document.getElementById('tracing-canvas');
        const guideCanvas = document.getElementById('guide-canvas');
        const ctx = canvas.getContext('2d');
        const gCtx = guideCanvas.getContext('2d');
        
        // Draw Guide
        gCtx.font = "bold 300px 'Baloo Thambi 2'";
        gCtx.textAlign = "center";
        gCtx.textBaseline = "middle";
        gCtx.fillStyle = "#000";
        gCtx.fillText(letter, 200, 200);
        
        let drawing = false;
        let points = [];
        
        const start = (e) => {
            drawing = true;
            ctx.beginPath();
            const pos = this.getPos(e, canvas);
            ctx.moveTo(pos.x, pos.y);
        };
        
        const move = (e) => {
            if (!drawing) return;
            const pos = this.getPos(e, canvas);
            ctx.lineTo(pos.x, pos.y);
            ctx.strokeStyle = "var(--primary)";
            ctx.lineWidth = 20;
            ctx.lineCap = "round";
            ctx.stroke();
            points.push(pos);
        };
        
        const stop = () => {
            if (!drawing) return;
            drawing = false;
            this.evaluateTrace(canvas, guideCanvas, points);
        };
        
        canvas.onmousedown = canvas.ontouchstart = start;
        canvas.onmousemove = canvas.ontouchmove = move;
        window.onmouseup = window.ontouchend = stop;
        
        document.getElementById('clear-trace').onclick = () => {
            ctx.clearRect(0,0,400,400);
            points = [];
            this.lockNext();
        };
    }

    evaluateTrace(canvas, guideCanvas, points) {
        if (points.length < 20) return;
        
        const ctx = canvas.getContext('2d');
        const gCtx = guideCanvas.getContext('2d');
        
        const userData = ctx.getImageData(0,0,400,400).data;
        const guideData = gCtx.getImageData(0,0,400,400).data;
        
        let targetPixels = 0;
        let coveredPixels = 0;
        
        for (let i = 3; i < guideData.length; i += 16) {
            if (guideData[i] > 10) {
                targetPixels++;
                if (userData[i] > 10) coveredPixels++;
            }
        }
        
        const accuracy = (coveredPixels / targetPixels) * 100;
        const feedbackEl = document.getElementById('trace-feedback');
        
        if (accuracy > 60) {
            this.markComplete(`Tracing accuracy: ${Math.round(accuracy)}%`);
            feedbackEl.innerText = "Beautiful work!";
            feedbackEl.style.color = "var(--success)";
        } else {
            feedbackEl.innerText = "Try to follow the lines more closely.";
            feedbackEl.style.color = "var(--error)";
        }
    }

    getPos(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    // --- Helpers ---
    markComplete(msg) {
        this.isCurrentStepComplete = true;
        this.unlockNext();
        window.audioSys.playFeedback('success');
        
        // Update local state metric
        const letter = this.lessonPath[this.currentIndex].l;
        app.recordMetric(this.style === 'kinesthetic' ? 'tracing_accuracy' : 'recognition_speed', 100);
        
        // Add to completed letters if not there
        if (!app.state.progress.completed_letters.includes(letter)) {
            app.state.progress.completed_letters.push(letter);
            app.saveState();
        }
    }

    lockNext() {
        this.nextBtn.disabled = true;
        this.nextBtn.style.opacity = "0.5";
        this.nextBtn.style.cursor = "not-allowed";
    }

    unlockNext() {
        this.nextBtn.disabled = false;
        this.nextBtn.style.opacity = "1";
        this.nextBtn.style.cursor = "pointer";
    }

    handleNext() {
        if (!this.isCurrentStepComplete) return;
        this.currentIndex++;
        this.updateUI();
    }

    handlePrev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateUI();
        }
    }

    finishLesson() {
        this.container.innerHTML = `
            <div class="lesson-complete">
                <i class="fa-solid fa-trophy fa-5x" style="color: var(--warning); margin-bottom: 2rem;"></i>
                <h1>Lesson Complete!</h1>
                <p class="mb-2">You've mastered ${this.lessonPath.length} new letters today.</p>
                <button class="btn btn-primary" onclick="window.location.href='dashboard.html'">Return to Dashboard</button>
            </div>
        `;
        this.nextBtn.classList.add('hidden');
        this.prevBtn.classList.add('hidden');
        this.statusEl.innerText = "Awesome Progress!";
        window.audioSys.playFeedback('excellent');
    }

    getDistractors(letter) {
        const all = ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ'];
        return all.filter(l => l !== letter).sort(() => 0.5 - Math.random()).slice(0, 2);
    }

    shuffle(array) {
        return array.sort(() => 0.5 - Math.random());
    }
}

window.lessonSys = new LessonSystem();
