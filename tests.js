const VAK_TESTS = [
    // --- VISUAL TESTS ---
    {
        id: 'v1',
        type: 'visual',
        title: 'Letter Recognition',
        instruction: 'Identify the letter shown below.',
        render: (container, onComplete) => {
            let done = false; 
            const finish = (s) => { if(done) return; done = true; onComplete(s); };
            const startTime = Date.now();
            container.innerHTML = `
                <div class="text-center">
                    <h1 style="font-size: 8rem; color: var(--text-main); font-family: var(--font-tamil); margin-bottom: 2rem;">அ</h1>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">
                        <button class="btn btn-premium" onclick="window.tm_submit(10)">அ</button>
                        <button class="btn btn-premium" onclick="window.tm_submit(0)">இ</button>
                        <button class="btn btn-premium" onclick="window.tm_submit(0)">உ</button>
                    </div>
                </div>
            `;
            window.tm_submit = (score) => {
                const speed = (Date.now() - startTime) / 1000;
                if(window.app) window.app.recordMetric('recognition_speed', speed);
                finish(score);
            };
        }
    },
    {
        id: 'v2',
        type: 'visual',
        title: 'Letter Matching',
        instruction: 'Match the letter to its twin.',
        render: (container, onComplete) => {
            let done = false; 
            const finish = (s) => { if(done) return; done = true; onComplete(s); };
            container.innerHTML = `
                <div class="text-center">
                    <div style="font-size: 3rem; margin-bottom: 2rem;">Match: <span style="font-family: var(--font-tamil); font-weight: 800; color: var(--info);">அ</span> → ?</div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">
                        <button class="btn btn-secondary" style="font-family: var(--font-tamil); font-size: 2.5rem; padding: 1.5rem;" onclick="window.tm_submit(10)">அ</button>
                        <button class="btn btn-secondary" style="font-family: var(--font-tamil); font-size: 2.5rem; padding: 1.5rem;" onclick="window.tm_submit(0)">ள</button>
                        <button class="btn btn-secondary" style="font-family: var(--font-tamil); font-size: 2.5rem; padding: 1.5rem;" onclick="window.tm_submit(0)">க</button>
                    </div>
                </div>
            `;
            window.tm_submit = (score) => finish(score);
        }
    },
    {
        id: 'v3',
        type: 'visual',
        title: 'Shape Identification',
        instruction: 'Which letter has this tongue-rolling shape?',
        render: (container, onComplete) => {
            let done = false;
            const finish = (s) => { if(done) return; done = true; onComplete(s); };
            container.innerHTML = `
                <div class="text-center">
                    <div class="glass-panel mb-2" style="padding: 2rem; border: 3px dashed var(--info); background: rgba(189, 224, 254, 0.1);">
                         <h2 style="font-family: var(--font-tamil); font-size: 6rem; opacity: 0.1; color: var(--info);">ழ</h2>
                    </div>
                    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem;">
                        <button class="btn btn-secondary" style="font-family: var(--font-tamil); font-size: 2.5rem; padding:1.5rem;" onclick="window.tm_submit(0)">ல</button>
                        <button class="btn btn-secondary" style="font-family: var(--font-tamil); font-size: 2.5rem; padding:1.5rem;" onclick="window.tm_submit(10)">ழ</button>
                        <button class="btn btn-secondary" style="font-family: var(--font-tamil); font-size: 2.5rem; padding:1.5rem;" onclick="window.tm_submit(0)">ள</button>
                    </div>
                </div>
            `;
            window.tm_submit = (score) => finish(score);
        }
    },

    // --- AUDITORY TESTS ---
    {
        id: 'a1',
        type: 'auditory',
        title: 'Sound Recognition',
        instruction: 'Listen to the sound and pick the letter.',
        render: (container, onComplete) => {
            let done = false;
            const finish = (s) => { if(done) return; done = true; onComplete(s); };
            container.innerHTML = `
                <div class="text-center">
                    <div style="font-size: 5rem; color: var(--primary); margin-bottom: 2rem; cursor:pointer; animation: pulse 2s infinite;" onclick="window.tm_audio()"><i class="fa-solid fa-circle-play"></i></div>
                    <p class="mb-2" style="font-weight:700;">Click the icon above to hear the sound.</p>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">
                        <button class="btn btn-premium" onclick="window.tm_submit(10)">ஆ</button>
                        <button class="btn btn-premium" onclick="window.tm_submit(0)">அ</button>
                        <button class="btn btn-premium" onclick="window.tm_submit(0)">இ</button>
                    </div>
                </div>
            `;
            window.tm_audio = () => { if(window.audioSys) window.audioSys.play('ஆ'); };
            window.tm_submit = (score) => finish(score);
            setTimeout(() => window.tm_audio(), 500);
        }
    },
    {
        id: 'a2',
        type: 'auditory',
        title: 'Sound Matching',
        instruction: 'Are these two sounds the same or different?',
        render: (container, onComplete) => {
            let done = false;
            const finish = (s) => { if(done) return; done = true; onComplete(s); };
            container.innerHTML = `
                <div class="text-center">
                    <h1 style="font-size: 6rem; font-family: var(--font-tamil); margin-bottom: 2.5rem; color: var(--text-main);">இ = ?</h1>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                        <button class="btn btn-premium" onclick="window.tm_submit(10)" style="padding: 2rem;"><i class="fa-solid fa-check"></i> Same</button>
                        <button class="btn btn-premium" onclick="window.tm_submit(0)" style="padding: 2rem; background: var(--secondary);"><i class="fa-solid fa-xmark"></i> Different</button>
                    </div>
                </div>
            `;
            window.tm_submit = (score) => finish(score);
        }
    },
    {
        id: 'a3',
        type: 'auditory',
        title: 'Pronunciation Test',
        instruction: 'Say the letter "ழ" aloud.',
        render: (container, onComplete) => {
            let done = false;
            const finish = (s) => { if(done) return; done = true; onComplete(s); };
            container.innerHTML = `
                <div class="text-center">
                    <div class="avatar-large mb-2" style="width:120px; height:120px; margin: 0 auto; background: var(--primary-light); display:flex; align-items:center; justify-content:center; border-radius:50%; font-size:4rem; color:white;">
                         <i class="fa-solid fa-microphone"></i>
                    </div>
                    <h2 class="mb-2" style="font-family:var(--font-tamil); font-size:4rem;">ழ</h2>
                    <button class="btn btn-primary btn-large" onclick="window.tm_submit(10)" style="width:100%; padding:1.5rem;">
                         I Have Said It! <i class="fa-solid fa-circle-check"></i>
                    </button>
                </div>
            `;
            window.tm_submit = (score) => finish(score);
        }
    },

    // --- KINESTHETIC TESTS ---
    {
        id: 'k1',
        type: 'kinesthetic',
        title: 'Letter Tracing',
        instruction: 'Trace the letter "அ" carefully.',
        render: (container, onComplete) => {
            let done = false;
            const finish = (s) => { if(done) return; done = true; onComplete(s); };
            container.innerHTML = `
                <div class="text-center">
                    <div style="position:relative; display:inline-block; background:white; padding:15px; border-radius:25px; border:6px solid var(--primary); box-shadow: var(--shadow-md);">
                        <canvas id="test-trace-canvas" width="300" height="300" style="touch-action: none; cursor: crosshair;"></canvas>
                    </div>
                    <p class="mt-2" style="font-weight:700; color: var(--text-muted);">Trace inside the light boundary.</p>
                    <button class="btn btn-primary" id="finish-trace-btn" style="margin-top:1.5rem; width:100%; display:none; padding:1.25rem; font-size:1.2rem; border-radius:50px;">
                        Done! Next Activity <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            `;
            const canvas = document.getElementById('test-trace-canvas');
            const ctx = canvas.getContext('2d');
            const finishBtn = document.getElementById('finish-trace-btn');

            // Draw Guide
            ctx.fillStyle = '#f8f8f8';
            ctx.font = "bold 230px 'Baloo Thambi 2'";
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("அ", 150, 150);

            let drawing = false;
            let points = 0;

            const getPos = (e) => {
                const rect = canvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return { x: clientX - rect.left, y: clientY - rect.top };
            };

            const start = (e) => {
                if(e.cancelable) e.preventDefault();
                drawing = true;
                const pos = getPos(e);
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
            };

            const move = (e) => {
                if(!drawing) return;
                if(e.cancelable) e.preventDefault();
                const pos = getPos(e);
                ctx.lineTo(pos.x, pos.y);
                ctx.strokeStyle = 'var(--primary)';
                ctx.lineWidth = 18;
                ctx.lineCap = 'round';
                ctx.stroke();
                points++;
                if(points > 40) {
                    finishBtn.style.display = 'block';
                    finishBtn.classList.add('pulse-cue');
                }
            };

            const stop = () => {
                drawing = false;
                if(points > 100) {
                    setTimeout(() => finish(10), 1200);
                }
            };

            canvas.addEventListener('mousedown', start);
            canvas.addEventListener('mousemove', move);
            window.addEventListener('mouseup', stop);
            canvas.addEventListener('touchstart', start, {passive: false});
            canvas.addEventListener('touchmove', move, {passive: false});
            canvas.addEventListener('touchend', stop);
            finishBtn.onclick = () => finish(10);
        }
    },
    {
        id: 'k2',
        type: 'kinesthetic',
        title: 'Free Writing',
        instruction: 'Write "த" from memory.',
        render: (container, onComplete) => {
            let done = false;
            const finish = (s) => { if(done) return; done = true; onComplete(s); };
            container.innerHTML = `
                <div class="text-center">
                    <div style="background:white; padding:10px; border-radius:20px; border:4px solid var(--glass-border);">
                         <canvas id="test-write-canvas" width="350" height="250" style="touch-action: none; cursor: crosshair;"></canvas>
                    </div>
                    <button class="btn btn-primary" onclick="window.tm_submit(10)" style="width:100%; margin-top:2rem; padding:1.25rem; font-size:1.2rem; border-radius:50px;">
                        I have written it! <i class="fa-solid fa-check"></i>
                    </button>
                </div>
            `;
            const canvas = document.getElementById('test-write-canvas');
            const ctx = canvas.getContext('2d');
            ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.strokeStyle = '#333';
            let drawing = false;
            const getPos = (e) => {
                const rect = canvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return { x: clientX - rect.left, y: clientY - rect.top };
            };
            const start = (e) => { if(e.cancelable) e.preventDefault(); drawing = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); };
            const move = (e) => { if(!drawing) return; if(e.cancelable) e.preventDefault(); const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
            canvas.addEventListener('mousedown', start);
            canvas.addEventListener('mousemove', move);
            window.addEventListener('mouseup', () => drawing = false);
            canvas.addEventListener('touchstart', start, {passive:false});
            canvas.addEventListener('touchmove', move, {passive:false});
            canvas.addEventListener('touchend', () => drawing = false);
            window.tm_submit = (score) => finish(score);
        }
    },
    {
        id: 'k3',
        type: 'kinesthetic',
        title: 'Stroke Order Test',
        instruction: 'How would you start writing "க"?',
        render: (container, onComplete) => {
            let done = false;
            const finish = (s) => { if(done) return; done = true; onComplete(s); };
            container.innerHTML = `
                <div class="text-center">
                    <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 3rem;">
                         <div class="card p-2 hover-float" style="width: 100px; height: 100px; font-size: 4rem; background: white; border: 4px solid var(--primary); display:flex; align-items:center; justify-content:center; border-radius:20px; cursor:pointer;" onclick="window.tm_submit(10)">ー</div>
                         <div class="card p-2 hover-float" style="width: 100px; height: 100px; font-size: 4rem; background: white; border: 4px solid var(--secondary); display:flex; align-items:center; justify-content:center; border-radius:20px; cursor:pointer;" onclick="window.tm_submit(0)">|</div>
                         <div class="card p-2 hover-float" style="width: 100px; height: 100px; font-size: 4rem; background: white; border: 4px solid var(--accent); display:flex; align-items:center; justify-content:center; border-radius:20px; cursor:pointer;" onclick="window.tm_submit(0)">◠</div>
                    </div>
                    <p style="font-weight:700; color:var(--text-muted);">Pick the correct starting stroke.</p>
                </div>
            `;
            window.tm_submit = (score) => finish(score);
        }
    }
];

class AssessmentSystem {
    constructor() {
        this.currentTestIndex = 0;
        this.tests = [...VAK_TESTS];
        this.container = document.getElementById('test-container');
        this.titleEl = document.getElementById('test-title');
        this.instructionEl = document.getElementById('test-instruction');
        this.categoryEl = document.getElementById('test-category');
        this.activityCountEl = document.getElementById('activity-count');
        this.progressBar = document.getElementById('progress-bar');
        
        if(this.container) {
            this.loadTest();
        }
    }

    loadTest() {
        if(this.currentTestIndex >= this.tests.length) {
            this.finishAssessment();
            return;
        }

        const testConfig = this.tests[this.currentTestIndex];
        
        if(this.categoryEl) this.categoryEl.innerText = `${testConfig.type.toUpperCase()} ACTIVITY`;
        if(this.activityCountEl) this.activityCountEl.innerText = `Activity ${this.currentTestIndex + 1} of ${this.tests.length}`;
        
        this.titleEl.innerText = testConfig.title;
        this.instructionEl.innerText = testConfig.instruction;
        
        const progressPercent = ((this.currentTestIndex + 1) / this.tests.length) * 100;
        if(this.progressBar) this.progressBar.style.width = `${progressPercent}%`;

        this.container.classList.remove('page-exit');
        this.container.classList.add('page-enter');

        // Render Test
        testConfig.render(this.container, (score) => {
            this.recordScore(testConfig.type, score);
            this.nextTest();
        });
    }

    recordScore(type, score) {
        if(!window.app) return;
        
        if(!window.app.state.assessment_scores) {
            window.app.state.assessment_scores = { visual: 0, auditory: 0, kinesthetic: 0 };
        }
        window.app.state.assessment_scores[type] += score;
        
        // Save compatibility
        this.saveStep();
    }

    saveStep() {
        if(window.app && window.app.saveState) window.app.saveState();
    }

    nextTest() {
        this.container.classList.remove('page-enter');
        this.container.classList.add('page-exit');
        
        setTimeout(() => {
            this.currentTestIndex++;
            this.loadTest();
        }, 500); 
    }

    finishAssessment() {
        if(window.app) {
            window.app.recalculateStyle();
            window.app.navigate('result.html');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('test-container')) {
        window.assessmentSys = new AssessmentSystem();
    }
});
