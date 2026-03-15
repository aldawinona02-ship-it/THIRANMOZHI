const VAK_TESTS = [
    // --- VISUAL (VISIONARY) LEARNER QUESTIONS ---
    {
        id: 'v1',
        type: 'visual',
        title: 'Diagram Interpretation',
        instruction: 'Look at the diagram of the water cycle.',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-diagram text-center">
                    <div class="diagram-placeholder mb-3" style="background:#eef2f3; border-radius:20px; padding:20px; border:2px dashed #b2bec3;">
                        <svg viewBox="0 0 200 120" style="width:100%; max-height:200px;">
                            <circle cx="160" cy="30" r="15" fill="#feca57" /> <!-- Sun -->
                            <path d="M20,100 Q100,80 180,100" stroke="#0984e3" stroke-width="4" fill="none" /> <!-- Water -->
                            <path d="M40,90 Q40,60 40,40" stroke="#0984e3" stroke-dasharray="2,2" fill="none" /> <!-- Evaporation -->
                            <g transform="translate(100,30)"> <!-- Cloud -->
                                <circle cx="0" cy="0" r="10" fill="#dfe6e9" />
                                <circle cx="10" cy="0" r="12" fill="#dfe6e9" />
                                <circle cx="20" cy="0" r="10" fill="#dfe6e9" />
                            </g>
                        </svg>
                    </div>
                    <h3 class="mb-2">Which process happens when water vapor turns into clouds?</h3>
                    <div class="grid-2">
                        <button class="btn btn-secondary" onclick="window.submitTest(false)">Evaporation</button>
                        <button class="btn btn-secondary" onclick="window.submitTest(true)">Condensation</button>
                        <button class="btn btn-secondary" onclick="window.submitTest(false)">Precipitation</button>
                        <button class="btn btn-secondary" onclick="window.submitTest(false)">Collection</button>
                    </div>
                </div>
            `;
            window.submitTest = (isCorrect) => onComplete(isCorrect ? 10 : 0);
        }
    },
    {
        id: 'v2',
        type: 'visual',
        title: 'Picture Memory',
        instruction: 'Memorize these 8 images!',
        render: (container, onComplete) => {
            const images = [
                {icon: '🌳', label: 'tree'}, {icon: '🚗', label: 'car'}, {icon: '🐕', label: 'dog'}, {icon: '🏠', label: 'house'},
                {icon: '🍎', label: 'apple'}, {icon: '📖', label: 'book'}, {icon: '☀️', label: 'sun'}, {icon: '🚲', label: 'bicycle'}
            ];
            const distractors = [
                {icon: '🐱', label: 'cat'}, {icon: '🚁', label: 'heli'}, {icon: '⚽', label: 'ball'}
            ];

            container.innerHTML = `
                <div class="test-memory text-center">
                    <div class="grid-4 mb-2" id="memory-grid">
                        \${images.map(img => `<div class="card" style="font-size:2rem; padding:10px;">\${img.icon}</div>`).join('')}
                    </div>
                    <div id="countdown" style="font-size:3rem; font-weight:800; color:var(--primary);">20s</div>
                </div>
            `;

            let timeLeft = 20;
            const timer = setInterval(() => {
                timeLeft--;
                document.getElementById('countdown').innerText = timeLeft + 's';
                if(timeLeft <= 0) {
                    clearInterval(timer);
                    showSelection();
                }
            }, 1000);

            function showSelection() {
                const allOptions = [...images, ...distractors].sort(() => Math.random() - 0.5);
                container.innerHTML = `
                    <div class="test-selection text-center">
                        <h3 class="mb-2">Which images were shown earlier?</h3>
                        <div class="grid-4 mb-2">
                            \${allOptions.map((img, i) => `
                                <button class="card memory-opt" id="opt-\${i}" onclick="window.toggleMemory('\${img.label}', \${i})">
                                    <div style="font-size:2rem;">\${img.icon}</div>
                                </button>
                            `).join('')}
                        </div>
                        <button class="btn btn-primary" onclick="window.finishMemory()">Submit Answers</button>
                    </div>
                `;
                window.selectedMemory = [];
                window.toggleMemory = (label, index) => {
                    const el = document.getElementById(\`opt-\${index}\`);
                    if(window.selectedMemory.includes(label)) {
                        window.selectedMemory = window.selectedMemory.filter(l => l !== label);
                        el.style.borderColor = "#edf2f7";
                    } else {
                        window.selectedMemory.push(label);
                        el.style.borderColor = "var(--primary-green)";
                        el.style.background = "rgba(46, 204, 113, 0.1)";
                    }
                };
                window.finishMemory = () => {
                    const correctCount = window.selectedMemory.filter(l => images.some(img => img.label === l)).length;
                    const wrongCount = window.selectedMemory.length - correctCount;
                    const score = Math.max(0, (correctCount - wrongCount) * 1.25);
                    onComplete(score);
                };
            }
        }
    },
    {
        id: 'v3',
        type: 'visual',
        title: 'Color Highlight Recognition',
        instruction: 'Read the paragraph below.',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-highlight text-center">
                    <div class="glass-panel text-left p-2 mb-3" style="text-align:left; line-height:1.6;">
                        During photosynthesis, plants take in <span style="color:#2ecc71; font-weight:bold;">Chlorophyll</span> to capture sunlight. 
                        They transform energy into Glucose while releasing Oxygen as a byproduct.
                    </div>
                    <h3 class="mb-2">Which word was highlighted in green?</h3>
                    <div class="grid-2">
                        <button class="btn btn-secondary" onclick="window.submitTest(false)">Oxygen</button>
                        <button class="btn btn-secondary" onclick="window.submitTest(true)">Chlorophyll</button>
                        <button class="btn btn-secondary" onclick="window.submitTest(false)">Carbon dioxide</button>
                        <button class="btn btn-secondary" onclick="window.submitTest(false)">Glucose</button>
                    </div>
                </div>
            `;
            window.submitTest = (isCorrect) => onComplete(isCorrect ? 10 : 0);
        }
    },

    // --- AUDITORY LEARNER QUESTIONS ---
    {
        id: 'a1',
        type: 'auditory',
        title: 'Lecture Recall',
        instruction: 'Listen to this explanation about climate change.',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-audio text-center">
                    <button class="btn btn-primary btn-large mb-3" id="play-lecture">
                        <i class="fa-solid fa-volume-high"></i> Play Audio
                    </button>
                    <div id="lecture-q" class="hidden">
                        <h3 class="mb-2">What is one major cause of climate change mentioned?</h3>
                        <div class="grid-2">
                            <button class="btn btn-secondary" onclick="window.submitTest(true)">Deforestation</button>
                            <button class="btn btn-secondary" onclick="window.submitTest(false)">Volcano eruption</button>
                            <button class="btn btn-secondary" onclick="window.submitTest(false)">Ocean waves</button>
                            <button class="btn btn-secondary" onclick="window.submitTest(false)">Earth rotation</button>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('play-lecture').onclick = () => {
                const text = "Climate change is a global challenge. One major cause is deforestation, as trees are being cut down at an alarming rate.";
                const ut = new SpeechSynthesisUtterance(text);
                speechSynthesis.speak(ut);
                setTimeout(() => {
                    document.getElementById('lecture-q').classList.remove('hidden');
                }, 5000);
            };
            window.submitTest = (isCorrect) => onComplete(isCorrect ? 10 : 0);
        }
    },
    {
        id: 'a2',
        type: 'auditory',
        title: 'Sound Identification',
        instruction: 'What sound do you hear?',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-sound text-center">
                    <button class="btn btn-warning btn-large mb-3" id="play-sound">
                        <i class="fa-solid fa-music"></i> Play Sound
                    </button>
                    <div class="grid-2">
                        <button class="btn btn-secondary" onclick="window.submitTest(false)">Rain falling</button>
                        <button class="btn btn-secondary" onclick="window.submitTest(false)">Dog barking</button>
                        <button class="btn btn-secondary" onclick="window.submitTest(true)">Bell ringing</button>
                        <button class="btn btn-secondary" onclick="window.submitTest(false)">Door closing</button>
                    </div>
                </div>
            `;
            document.getElementById('play-sound').onclick = () => {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
                const gain = audioCtx.createGain();
                gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
                osc.connect(gain); gain.connect(audioCtx.destination);
                osc.start(); osc.stop(audioCtx.currentTime + 1.5);
            };
            window.submitTest = (isCorrect) => onComplete(isCorrect ? 10 : 0);
        }
    },
    {
        id: 'a3',
        type: 'auditory',
        title: 'Verbal Instruction Task',
        instruction: 'Listen to the instructions carefully.',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-verbal text-center">
                    <button class="btn btn-info btn-large mb-3" id="play-instr">
                        <i class="fa-solid fa-ear-listen"></i> Listen
                    </button>
                    <div id="instr-options" class="grid-2 hidden">
                        <div class="card p-1" onclick="window.submitTest(false)"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" stroke="black" fill="none"/><rect x="40" y="40" width="20" height="20" fill="none" stroke="black"/></svg></div>
                        <div class="card p-1" onclick="window.submitTest(true)"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" stroke="black" fill="none"/><rect x="42.5" y="42.5" width="15" height="15" fill="none" stroke="black"/><path d="M40,20 L60,20 L50,5 Z" fill="none" stroke="black"/></svg></div>
                    </div>
                </div>
            `;
            document.getElementById('play-instr').onclick = () => {
                const ut = new SpeechSynthesisUtterance("Draw a circle. Inside the circle draw a small square. Above the circle draw a triangle.");
                speechSynthesis.speak(ut);
                setTimeout(() => {
                    document.getElementById('instr-options').classList.remove('hidden');
                }, 5000);
            };
            window.submitTest = (isCorrect) => onComplete(isCorrect ? 10 : 0);
        }
    },

    // --- KINESTHETIC LEARNER TASKS ---
    {
        id: 'k1',
        type: 'kinesthetic',
        title: 'Interactive Tracing Task',
        instruction: 'Trace the path from Start to Finish!',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-maze text-center">
                    <canvas id="maze-canvas" width="300" height="150" style="border:5px solid #bdc3c7; border-radius:15px; background:white;"></canvas>
                    <p class="mt-1">Follow the line!</p>
                </div>
            `;
            const canvas = document.getElementById('maze-canvas');
            const ctx = canvas.getContext('2d');
            ctx.lineWidth = 15; ctx.lineCap = 'round'; ctx.strokeStyle = '#3498db';
            
            ctx.beginPath();
            ctx.moveTo(30, 75); ctx.lineTo(270, 75);
            ctx.globalAlpha = 0.1; ctx.stroke(); ctx.globalAlpha = 1.0;
            ctx.strokeStyle = '#e74c3c';

            let drawing = false;
            let success = false;
            canvas.onmousedown = (e) => { drawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); };
            canvas.onmousemove = (e) => { 
                if(!drawing) return; 
                ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); 
                if(e.offsetX > 260) success = true;
            };
            canvas.onmouseup = () => { 
                drawing = false; 
                if(success) onComplete(10);
            };
        }
    },
    {
        id: 'k2',
        type: 'kinesthetic',
        title: 'Plant Simulation',
        instruction: 'Adjust sliders to grow the plant.',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-sim text-center">
                    <div id="plant" style="font-size:3rem; min-height:100px;">🌱</div>
                    <div class="mt-2">
                        <label>Water</label> <input type="range" id="water" value="0">
                        <label>Sunlight</label> <input type="range" id="sun" value="0">
                    </div>
                </div>
            `;
            const check = () => {
                const w = document.getElementById('water').value;
                const s = document.getElementById('sun').value;
                if(w > 70 && s > 70) {
                    document.getElementById('plant').innerText = '🌳';
                    setTimeout(() => onComplete(10), 1000);
                } else if(w > 30 || s > 30) {
                    document.getElementById('plant').innerText = '🌿';
                }
            };
            document.getElementById('water').oninput = check;
            document.getElementById('sun').oninput = check;
        }
    },
    {
        id: 'k3',
        type: 'kinesthetic',
        title: 'Gesture Puzzle',
        instruction: 'Click the shape to rotate and complete it!',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-puzzle text-center">
                    <div id="puzzle-piece" style="width:100px; height:100px; background:#f1c40f; margin: 20px auto; cursor:pointer; transform:rotate(45deg); transition:transform 0.3s; border-radius:10px;"></div>
                    <p>Rotate it to 0 degrees (Upright Square)</p>
                </div>
            `;
            let rotation = 45;
            document.getElementById('puzzle-piece').onclick = () => {
                rotation = (rotation + 45) % 360;
                document.getElementById('puzzle-piece').style.transform = \`rotate(\${rotation}deg)\`;
                if(rotation === 0) {
                    document.getElementById('puzzle-piece').style.background = '#2ecc71';
                    setTimeout(() => onComplete(10), 800);
                }
            };
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
        
        this.progressEl.innerText = \`Phase: \${testConfig.type.toUpperCase()}\`;
        this.titleEl.innerText = testConfig.title;
        this.instructionEl.innerText = testConfig.instruction;
        
        // Update Progress Bar
        const progressPercent = ((this.currentTestIndex) / this.tests.length) * 100;
        if(this.progressBar) this.progressBar.style.width = \`\${progressPercent}%\`;

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
