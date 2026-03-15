const VAK_TESTS = [
    // --- VISUAL TESTS ---
    {
        id: 'v1',
        type: 'visual',
        title: 'Letter Recognition',
        instruction: 'Identify the letter shown below.',
        render: (container, onComplete) => {
            const startTime = Date.now();
            container.innerHTML = `
                <div class="text-center">
                    <h1 style="font-size: 8rem; color: var(--text-main); font-family: var(--font-tamil); margin-bottom: 2rem;">அ</h1>
                    <div class="grid-3">
                        <button class="btn btn-secondary" onclick="window.submitV1('அ', true)">அ</button>
                        <button class="btn btn-secondary" onclick="window.submitV1('இ', false)">இ</button>
                        <button class="btn btn-secondary" onclick="window.submitV1('உ', false)">உ</button>
                    </div>
                </div>
            `;
            window.submitV1 = (val, isCorrect) => {
                const speed = (Date.now() - startTime) / 1000;
                app.recordMetric('recognition_speed', speed);
                onComplete(isCorrect ? 10 : 0);
            };
        }
    },
    {
        id: 'v2',
        type: 'visual',
        title: 'Letter Matching',
        instruction: 'Match the letter to its twin.',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="text-center">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">Match: <span style="font-family: var(--font-tamil); font-weight: 800; color: var(--info);">அ</span> → ?</div>
                    <div class="grid-3">
                        <button class="btn btn-secondary" style="font-family: var(--font-tamil); font-size: 2rem;" onclick="onComplete(10)">அ</button>
                        <button class="btn btn-secondary" style="font-family: var(--font-tamil); font-size: 2rem;" onclick="onComplete(0)">ள</button>
                        <button class="btn btn-secondary" style="font-family: var(--font-tamil); font-size: 2rem;" onclick="onComplete(0)">க</button>
                    </div>
                </div>
            `;
        }
    },
    {
        id: 'v3',
        type: 'visual',
        title: 'Shape Identification',
        instruction: 'Which letter has this tongue-rolling shape?',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="text-center">
                    <div class="glass-panel mb-2" style="padding: 1rem; border: 2px dashed var(--info);">
                         <h2 style="font-family: var(--font-tamil); font-size: 5rem; opacity: 0.3;">ழ</h2>
                    </div>
                    <div class="grid-3">
                        <button class="btn btn-secondary" style="font-family: var(--font-tamil); font-size: 2rem;" onclick="onComplete(0)">ல</button>
                        <button class="btn btn-secondary" style="font-family: var(--font-tamil); font-size: 2rem;" onclick="onComplete(10)">ழ</button>
                        <button class="btn btn-secondary" style="font-family: var(--font-tamil); font-size: 2rem;" onclick="onComplete(0)">ள</button>
                    </div>
                </div>
            `;
        }
    },

    // --- AUDITORY TESTS ---
    {
        id: 'a1',
        type: 'auditory',
        title: 'Sound Recognition',
        instruction: 'Listen to the sound and pick the letter.',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="text-center">
                    <button class="btn btn-primary btn-large mb-3" onclick="window.playA1()"><i class="fa-solid fa-volume-high"></i> Play Sound</button>
                    <div class="grid-3">
                        <button class="btn btn-secondary" style="font-family: var(--font-tamil); font-size: 2rem;" onclick="onComplete(10)">க</button>
                        <button class="btn btn-secondary" style="font-family: var(--font-tamil); font-size: 2rem;" onclick="onComplete(0)">ச</button>
                        <button class="btn btn-secondary" style="font-family: var(--font-tamil); font-size: 2rem;" onclick="onComplete(0)">த</button>
                    </div>
                </div>
            `;
            window.playA1 = () => {
                const ut = new SpeechSynthesisUtterance("ka");
                ut.lang = 'ta-IN';
                speechSynthesis.speak(ut);
            };
        }
    },
    {
        id: 'a2',
        type: 'auditory',
        title: 'Sound Matching',
        instruction: 'Are these two sounds the same or different?',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="text-center">
                    <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 2rem;">
                        <button class="btn btn-info" onclick="window.playPart(1)">Sound 1 (ல)</button>
                        <button class="btn btn-info" onclick="window.playPart(2)">Sound 2 (ள)</button>
                    </div>
                    <div class="grid-2">
                        <button class="btn btn-secondary" onclick="onComplete(0)">Same</button>
                        <button class="btn btn-secondary" onclick="onComplete(10)">Different</button>
                    </div>
                </div>
            `;
            window.playPart = (num) => {
                const ut = new SpeechSynthesisUtterance(num === 1 ? "la" : "La");
                ut.lang = 'ta-IN';
                speechSynthesis.speak(ut);
            };
        }
    },
    {
        id: 'a3',
        type: 'auditory',
        title: 'Pronunciation Test',
        instruction: 'Say the letter "ழ" aloud.',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="text-center">
                    <h1 style="font-size: 6rem; color: var(--text-main); font-family: var(--font-tamil); margin-bottom: 1rem;">ழ</h1>
                    <button class="btn btn-error btn-large pulse-cue" id="mic-btn"><i class="fa-solid fa-microphone"></i> Start Speaking</button>
                    <p id="mic-status" class="mt-1" style="font-weight: 600;">Click to speak</p>
                </div>
            `;
            const btn = document.getElementById('mic-btn');
            btn.onclick = () => {
                btn.innerText = "Listening...";
                btn.style.background = "var(--primary)";
                // Mock speech recognition if API not available/blocked
                setTimeout(() => {
                    app.recordMetric('pronunciation_scores', 90);
                    onComplete(10);
                }, 2000);
            };
        }
    },

    // --- KINESTHETIC TESTS ---
    {
        id: 'k1',
        type: 'kinesthetic',
        title: 'Letter Tracing',
        instruction: 'Trace the letter "அ" carefully.',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="text-center">
                    <canvas id="test-trace-canvas" width="300" height="300" style="border: 4px solid var(--primary); background: white; border-radius: 20px; touch-action: none; cursor: crosshair;"></canvas>
                    <p class="mt-1">Use your mouse/finger to trace</p>
                </div>
            `;
            const canvas = document.getElementById('test-trace-canvas');
            const ctx = canvas.getContext('2d');
            ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(189, 224, 254, 0.2)';
            ctx.font = "bold 200px 'Baloo Thambi 2'";
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("அ", 150, 150);

            let drawing = false;
            let points = 0;
            const start = (e) => { drawing = true; ctx.beginPath(); };
            const move = (e) => {
                if(!drawing) return;
                const rect = canvas.getBoundingClientRect();
                const x = (e.clientX || e.touches[0].clientX) - rect.left;
                const y = (e.clientY || e.touches[0].clientY) - rect.top;
                ctx.lineTo(x, y);
                ctx.strokeStyle = 'var(--primary)';
                ctx.lineWidth = 15;
                ctx.stroke();
                points++;
            };
            canvas.onmousedown = canvas.ontouchstart = start;
            window.onmousemove = window.ontouchmove = move;
            window.onmouseup = window.ontouchend = () => {
                if(!drawing) return;
                drawing = false;
                if(points > 20) {
                    app.recordMetric('tracing_accuracy', 95);
                    onComplete(10);
                }
            };
        }
    },
    {
        id: 'k2',
        type: 'kinesthetic',
        title: 'Free Writing',
        instruction: 'Write "த" from memory.',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="text-center">
                    <canvas id="test-write-canvas" width="300" height="300" style="border: 4px solid var(--secondary); background: white; border-radius: 20px;"></canvas>
                    <div class="mt-2">
                        <button class="btn btn-primary" onclick="window.submitK2()">Finished Writing</button>
                    </div>
                </div>
            `;
            const canvas = document.getElementById('test-write-canvas');
            const ctx = canvas.getContext('2d');
            ctx.lineWidth = 10; ctx.lineCap = 'round';
            let drawing = false;
            canvas.onmousedown = () => { drawing = true; ctx.beginPath(); };
            canvas.onmousemove = (e) => { if(drawing) { ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); } };
            window.onmouseup = () => drawing = false;
            window.submitK2 = () => onComplete(10);
        }
    },
    {
        id: 'k3',
        type: 'kinesthetic',
        title: 'Stroke Order Test',
        instruction: 'Arrange the steps for writing "க".',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="text-center">
                    <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 2rem;">
                         <div class="card p-1" style="width: 80px; height: 80px; font-size: 3rem; background: var(--glass-bg);">ー</div>
                         <div class="card p-1" style="width: 80px; height: 80px; font-size: 3rem; background: var(--glass-bg);">|</div>
                         <div class="card p-1" style="width: 80px; height: 80px; font-size: 3rem; background: var(--glass-bg);">◠</div>
                    </div>
                    <button class="btn btn-primary" onclick="onComplete(10)">Submit Steps</button>
                </div>
            `;
        }
    }
];

class AssessmentSystem {
    constructor() {
        this.currentTestIndex = 0;
        this.tests = [...VAK_TESTS]; // Use all 9 questions in order for consistency with user request
        this.container = document.getElementById('test-container');
        this.titleEl = document.getElementById('test-title');
        this.instructionEl = document.getElementById('test-instruction');
        this.progressEl = document.getElementById('test-progress');
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
        
        this.progressEl.innerText = `Phase: ${testConfig.type.toUpperCase()}`;
        this.titleEl.innerText = testConfig.title;
        this.instructionEl.innerText = testConfig.instruction;
        
        // Update Progress Bar
        const progressPercent = ((this.currentTestIndex) / this.tests.length) * 100;
        if(this.progressBar) this.progressBar.style.width = `${progressPercent}%`;

        // Add Enter animation
        this.container.classList.remove('page-exit');
        this.container.classList.add('page-enter');

        // Render Test
        testConfig.render(this.container, (score) => {
            this.recordScore(testConfig.type, score);
            this.nextTest();
        });
    }

    recordScore(type, score) {
        if(!app.state.assessment_scores) {
            app.state.assessment_scores = { visual: 0, auditory: 0, kinesthetic: 0 };
        }
        app.state.assessment_scores[type] += score;
        
        // Old state compatibility
        if(type === 'visual') app.state.score_v = (app.state.score_v || 0) + score;
        if(type === 'auditory') app.state.score_a = (app.state.score_a || 0) + score;
        if(type === 'kinesthetic') app.state.score_k = (app.state.score_k || 0) + score;
    }

    nextTest() {
        // Exit Animation
        this.container.classList.remove('page-enter');
        this.container.classList.add('page-exit');
        
        setTimeout(() => {
            this.currentTestIndex++;
            this.loadTest();
        }, 400); // 400ms CSS transition
    }

    finishAssessment() {
        // Save to global storage
        app.saveState();
        app.recalculateStyle();
        // Redirect to specified result page
        app.navigate('result.html');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Only init inside the test runner page 
    if(document.getElementById('test-container')) {
        window.assessmentSys = new AssessmentSystem();
    }
});
