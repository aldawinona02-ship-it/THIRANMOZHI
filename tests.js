const VAK_TESTS = [
    // --- VISUAL TESTS ---
    {
        id: 'v1',
        type: 'visual',
        title: 'Diagram Interpretation',
        instruction: 'Look at the diagram for 30 seconds. Then we will ask a question!',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-visual-diagram text-center">
                    <div id="v1-show">
                        <h3 id="v1-timer" style="color: var(--primary-purple);">Observation Time: 30s</h3>
                        <div style="background: white; border-radius:10px; padding: 20px; display:inline-block; border:4px solid var(--primary-blue); margin-top: 15px;">
                            <div style="width:200px; height:50px; background:var(--primary-blue); margin-bottom:10px;"></div>
                            <div style="width:100px; height:50px; background:var(--primary-yellow); display:inline-block;"></div>
                            <div style="width:100px; height:50px; background:var(--primary-green); display:inline-block;"></div>
                        </div>
                    </div>
                    <div id="v1-ask" class="hidden">
                        <h3 class="mb-2">Which block was on top?</h3>
                        <div class="grid-3">
                            <button class="btn btn-green" onclick="window.submitTest(false)">Green Block</button>
                            <button class="btn btn-yellow" onclick="window.submitTest(false)">Yellow Block</button>
                            <button class="btn btn-blue" onclick="window.submitTest(true)">Blue Block</button>
                        </div>
                    </div>
                </div>
            `;
            // 30 seconds wait then ask
            let timeLeft = 30;
            const timerInterval = setInterval(() => {
                timeLeft--;
                const timerEl = document.getElementById('v1-timer');
                if(timerEl) timerEl.innerText = `Observation Time: ${timeLeft}s`;
                if(timeLeft <= 0) {
                    clearInterval(timerInterval);
                    document.getElementById('v1-show').classList.add('hidden');
                    document.getElementById('v1-ask').classList.remove('hidden');
                }
            }, 1000);
            
            window.submitTest = (isCorrect) => {
                clearInterval(timerInterval);
                onComplete(isCorrect ? 10 : 0);
            };
        }
    },
    {
        id: 'v2',
        type: 'visual',
        title: 'Picture Memory',
        instruction: 'Look at these 10 pictures for 30 seconds. Remember them!',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-visual-memory">
                    <div id="vm-timer-container" class="text-center mb-1">
                        <h3 id="vm-timer" style="color: var(--primary-purple);">Observation Time: 30s</h3>
                    </div>
                    <div class="grid-3 mb-2" id="vm-pics" style="grid-template-columns: repeat(5, 1fr) !important; gap: 10px;">
                        <div class="card p-1"><div class="card-icon" style="width:50px; height:50px; font-size:1.5rem">🍎</div>Apple</div>
                        <div class="card p-1"><div class="card-icon" style="width:50px; height:50px; font-size:1.5rem">🐘</div>Elephant</div>
                        <div class="card p-1"><div class="card-icon" style="width:50px; height:50px; font-size:1.5rem">🌞</div>Sun</div>
                        <div class="card p-1"><div class="card-icon" style="width:50px; height:50px; font-size:1.5rem">🌳</div>Tree</div>
                        <div class="card p-1"><div class="card-icon" style="width:50px; height:50px; font-size:1.5rem">🚗</div>Car</div>
                        <div class="card p-1"><div class="card-icon" style="width:50px; height:50px; font-size:1.5rem">💧</div>Water</div>
                        <div class="card p-1"><div class="card-icon" style="width:50px; height:50px; font-size:1.5rem">🦋</div>Butterfly</div>
                        <div class="card p-1"><div class="card-icon" style="width:50px; height:50px; font-size:1.5rem">🎸</div>Guitar</div>
                        <div class="card p-1"><div class="card-icon" style="width:50px; height:50px; font-size:1.5rem">🍕</div>Pizza</div>
                        <div class="card p-1"><div class="card-icon" style="width:50px; height:50px; font-size:1.5rem">⭐</div>Star</div>
                    </div>
                    <div id="vm-question" class="hidden text-center">
                        <h3 class="mb-2">Which one did you see?</h3>
                        <div class="grid-3">
                            <button class="btn btn-blue" onclick="window.submitTest(true)">🍎 Apple</button>
                            <button class="btn btn-blue" onclick="window.submitTest(false)">🦁 Lion</button>
                            <button class="btn btn-blue" onclick="window.submitTest(false)">📚 Book</button>
                        </div>
                    </div>
                </div>
            `;
            let timeLeft = 30;
            const timerInterval = setInterval(() => {
                timeLeft--;
                const timerEl = document.getElementById('vm-timer');
                if(timerEl) timerEl.innerText = `Observation Time: ${timeLeft}s`;
                if(timeLeft <= 0) {
                    clearInterval(timerInterval);
                    document.getElementById('vm-timer-container').classList.add('hidden');
                    document.getElementById('vm-pics').classList.add('hidden');
                    document.getElementById('vm-question').classList.remove('hidden');
                }
            }, 1000); 
            window.submitTest = (isCorrect) => {
                clearInterval(timerInterval);
                onComplete(isCorrect ? 10 : 0);
            };
        }
    },
    {
        id: 'v3',
        type: 'visual',
        title: 'Color Highlight Memory',
        instruction: 'Read this text. Notice the highlighted words. (20 seconds)',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-visual-color text-center">
                    <h3 id="v3-timer" style="color: var(--primary-purple); margin-bottom: 15px;">Observation Time: 20s</h3>
                    <div id="v3-show" style="font-size: 1.5rem; line-height: 2;">
                        The quick <span style="background: yellow; font-weight:bold;">brown</span> fox jumps over the lazy <span style="background: #a29bfe; font-weight:bold;">dog</span>. It was a very sunny <span style="background: #55efc4; font-weight:bold;">day</span> outside.
                    </div>
                    <div id="v3-ask" class="hidden">
                        <h3 class="mb-2">Which words were highlighted?</h3>
                        <div class="grid-3">
                            <button class="btn btn-green" onclick="window.submitTest(false)">fox, jumps, lazy</button>
                            <button class="btn btn-blue" onclick="window.submitTest(false)">quick, over, very</button>
                            <button class="btn btn-yellow" onclick="window.submitTest(true)">brown, dog, day</button>
                        </div>
                    </div>
                </div>
            `;
            let timeLeft = 20;
            const timerInterval = setInterval(() => {
                timeLeft--;
                const timerEl = document.getElementById('v3-timer');
                if(timerEl) timerEl.innerText = `Observation Time: ${timeLeft}s`;
                if(timeLeft <= 0) {
                    clearInterval(timerInterval);
                    document.getElementById('v3-timer').classList.add('hidden');
                    document.getElementById('v3-show').classList.add('hidden');
                    document.getElementById('v3-ask').classList.remove('hidden');
                }
            }, 1000); // 20s as requested
            window.submitTest = (isCorrect) => {
                clearInterval(timerInterval);
                onComplete(isCorrect ? 10 : 0);
            };
        }
    },

    // --- AUDITORY TESTS ---
    {
        id: 'a1',
        type: 'auditory',
        title: 'Lecture Recall',
        instruction: 'Listen to this short story. No reading allowed!',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-auditory text-center">
                    <button class="btn btn-yellow btn-large mb-2 pulse-cue" id="play-a1" style="border-radius:50%; width:100px; height:100px; font-size:2rem;">
                        <i class="fa-solid fa-play"></i>
                    </button>
                    <p id="a1-note">Click play to listen to a 1 minute explanation about animals.</p>
                    
                    <div id="a1-ask" class="hidden mt-2">
                        <h3 class="mb-2">What animal did the story say sleeps upside down?</h3>
                        <div class="grid-3">
                            <button class="btn btn-blue" onclick="window.submitTest(false)">Owl</button>
                            <button class="btn btn-blue" onclick="window.submitTest(false)">Monkey</button>
                            <button class="btn btn-blue" onclick="window.submitTest(true)">Bat</button>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('play-a1').onclick = () => {
                document.getElementById('play-a1').disabled = true;
                const synth = window.speechSynthesis;
                const utter = new SpeechSynthesisUtterance("Did you know bats are the only mammals capable of true flight? Also, bats are famous because they sleep completely upside down hanging from cave ceilings.");
                utter.rate = 0.9;
                
                utter.onend = () => {
                    document.getElementById('a1-ask').classList.remove('hidden');
                    document.getElementById('a1-note').classList.add('hidden');
                };
                synth.speak(utter);
            };
            window.submitTest = (isCorrect) => onComplete(isCorrect ? 10 : 0);
        }
    },
    {
        id: 'a2',
        type: 'auditory',
        title: 'Sound Identification',
        instruction: 'Listen carefully, then pick what made the sound!',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-auditory text-center">
                    <button class="btn btn-green btn-large mb-2 pulse-cue" id="play-sound-btn" style="border-radius:50%; width:100px; height:100px; font-size:2rem;">
                        <i class="fa-solid fa-bell"></i>
                    </button>
                    <div id="audio-options" class="grid-3 hidden mt-2">
                        <button class="card" onclick="window.submitTest(false)"><div class="card-icon">🐕</div>Dog</button>
                        <button class="card" onclick="window.submitTest(true)"><div class="card-icon" style="background:var(--primary-yellow)">🔔</div>Bell</button>
                        <button class="card" onclick="window.submitTest(false)"><div class="card-icon">🌬️</div>Whistle</button>
                    </div>
                </div>
            `;
            document.getElementById('play-sound-btn').onclick = () => {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
                osc.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 1);

                setTimeout(() => {
                    document.getElementById('audio-options').classList.remove('hidden');
                }, 1000);
            };
            window.submitTest = (isCorrect) => onComplete(isCorrect ? 10 : 0);
        }
    },
    {
        id: 'a3',
        type: 'auditory',
        title: 'Verbal Instruction Task',
        instruction: 'Click listen. Do exactly what the voice tells you.',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-auditory text-center">
                    <button class="btn btn-blue btn-large mb-2 pulse-cue" id="play-a3" style="border-radius:50%; width:100px; height:100px; font-size:2rem;">
                        <i class="fa-solid fa-ear-listen"></i>
                    </button>
                    
                    <div id="a3-canvas-area" class="hidden" style="margin: 0 auto; width: 300px; height: 300px; border: 4px dashed #ccc; position: relative;">
                        <!-- For MVP: Simulated drawing check. User must click circle then square internally -->
                        <div id="target-circle" style="width:100px; height:100px; border-radius:50%; border:2px solid black; position:absolute; top:50px; left:100px; display:none;" onclick="this.style.background='green'; window.kCircle=true;"></div>
                        <div id="target-square" style="width:80px; height:80px; border:2px solid black; position:absolute; top:60px; left:110px; display:none;" onclick="this.style.background='blue'; window.kSquare=true;"></div>
                        
                        <p style="padding-top:250px;">Draw inside the box</p>
                    </div>
                    
                    <button id="a3-submit" class="btn btn-green hidden mt-2">I finished drawing</button>
                </div>
            `;
            document.getElementById('play-a3').onclick = () => {
                const synth = window.speechSynthesis;
                const utter = new SpeechSynthesisUtterance("Draw a circle, and place a square inside it.");
                
                utter.onend = () => {
                    document.getElementById('a3-canvas-area').classList.remove('hidden');
                    document.getElementById('a3-submit').classList.remove('hidden');
                    
                    // Reveal the simulated shapes for the user to "draw/click"
                    document.getElementById('target-circle').style.display = 'block';
                    document.getElementById('target-square').style.display = 'block';
                };
                synth.speak(utter);
            };
            
            document.getElementById('a3-submit').onclick = () => {
                if(window.kCircle && window.kSquare) {
                    onComplete(10);
                } else {
                    onComplete(0); // Failed to follow instructions completely
                }
            };
        }
    },

    // --- KINESTHETIC TESTS ---
    {
        id: 'k1',
        type: 'kinesthetic',
        title: 'Gesture Puzzle',
        instruction: 'Rotate the puzzle pieces so they fit together to make a square.',
        render: (container, onComplete) => {
            window.k1Rotation = [0, 90]; // State
            
            container.innerHTML = `
                <div class="test-kinesthetic text-center">
                    <div style="display:flex; justify-content:center; gap: 20px; align-items:center;">
                        <div id="kp-1" style="width:100px; height:100px; background:var(--primary-blue); cursor:pointer; clip-path: polygon(0 0, 100% 0, 0 100%); transition: transform 0.3s;" onclick="rotateKP(1)"></div>
                        <div id="kp-2" style="width:100px; height:100px; background:var(--primary-green); cursor:pointer; clip-path: polygon(100% 100%, 100% 0, 0 100%); transition: transform 0.3s; transform: rotate(90deg);" onclick="rotateKP(2)"></div>
                    </div>
                    <button class="btn btn-green mt-2" onclick="checkKP()">Check Fit</button>
                    <p class="mt-1" style="color:var(--text-muted)">Click a piece to rotate it 90 degrees.</p>
                </div>
            `;
            
            window.rotateKP = (id) => {
                if(id===1) {
                    window.k1Rotation[0] = (window.k1Rotation[0] + 90) % 360;
                    document.getElementById('kp-1').style.transform = `rotate(${window.k1Rotation[0]}deg)`;
                } else {
                    window.k1Rotation[1] = (window.k1Rotation[1] + 90) % 360;
                    document.getElementById('kp-2').style.transform = `rotate(${window.k1Rotation[1]}deg)`;
                }
            };
            
            window.checkKP = () => {
                // To form a square with these specific CSS clip paths, angles must complement
                if(window.k1Rotation[0] === 0 && window.k1Rotation[1] === 0) {
                    onComplete(10);
                } else {
                    onComplete(0);
                }
            };
        }
    },
    {
        id: 'k2',
        type: 'kinesthetic',
        title: 'Simulation Activity (Circuit)',
        instruction: 'Connect the wire from the Battery to the Bulb to light it up.',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-kinesthetic text-center">
                    <div style="display:flex; justify-content:space-around; align-items:center; min-height: 200px;">
                        <div id="battery-node" style="padding:10px; background:#333; color:white; border-radius:5px; cursor:pointer;" onclick="connectCircuit('battery')">
                            🔋 Battery (Tap here)
                        </div>
                        <div id="bulb-node" style="font-size: 3rem; color: #ccc; cursor:pointer;" onclick="connectCircuit('bulb')">
                            <i class="fa-solid fa-lightbulb"></i>
                        </div>
                    </div>
                    <p id="circuit-wire" style="height: 4px; background: transparent; width: 100%; transition: background 0.5s;"></p>
                </div>
            `;
            
            window.circuitState = '';
            window.connectCircuit = (type) => {
                if(type === 'battery') {
                    window.circuitState = 'connected_battery';
                    document.getElementById('battery-node').style.border = "4px solid yellow";
                }
                if(type === 'bulb' && window.circuitState === 'connected_battery') {
                    document.getElementById('bulb-node').style.color = "#f1c40f";
                    document.getElementById('bulb-node').style.textShadow = "0 0 20px yellow";
                    document.getElementById('circuit-wire').style.background = "red";
                    setTimeout(() => onComplete(10), 1000); // 1 sec success delay
                }
            };
        }
    },
    {
        id: 'k3',
        type: 'kinesthetic',
        title: 'Interactive Tracing',
        instruction: 'Trace the letter shape quickly with your mouse or finger.',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-kinesthetic text-center" style="display:flex; flex-direction:column; align-items:center;">
                    <div style="width:200px; height:200px; border:2px dashed #999; border-radius:10px; position:relative; overflow:hidden;" id="trace-zone">
                        <span style="font-family: 'Baloo Thambi 2', cursive; font-size: 10rem; color: #eee; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); pointer-events:none;">அ</span>
                        <canvas id="k3-canvas" width="200" height="200" style="position:absolute; top:0; left:0; cursor:crosshair;"></canvas>
                    </div>
                </div>
            `;
            
            const canvas = document.getElementById('k3-canvas');
            const ctx = canvas.getContext('2d');
            let isDrawing = false;
            let drawCount = 0;
            
            const start = (e) => { isDrawing = true; };
            const draw = (e) => {
                if(!isDrawing) return;
                const rect = canvas.getBoundingClientRect();
                const x = (e.clientX || e.touches[0].clientX) - rect.left;
                const y = (e.clientY || e.touches[0].clientY) - rect.top;
                
                ctx.fillStyle = 'var(--primary-green)';
                ctx.beginPath();
                ctx.arc(x, y, 10, 0, Math.PI*2);
                ctx.fill();
                
                drawCount++;
                if(drawCount > 50) {
                    isDrawing = false;
                    onComplete(10);
                }
            };
            const stop = () => { isDrawing = false; };
            
            canvas.addEventListener('mousedown', start);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stop);
            
            canvas.addEventListener('touchstart', start, {passive:false});
            canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, {passive:false});
            canvas.addEventListener('touchend', stop);
        }
    }
];

class AssessmentSystem {
    constructor() {
        this.currentTestIndex = 0;
        // The array is shuffled so the 9 tests are completely randomized every time
        this.tests = this.shuffleTests([...VAK_TESTS]); 
        
        this.container = document.getElementById('test-container');
        this.titleEl = document.getElementById('test-title');
        this.instructionEl = document.getElementById('test-instruction');
        this.progressEl = document.getElementById('test-progress');
        this.progressFillEl = document.getElementById('progress-bar');
        
        if(this.container) {
            this.loadTest();
        }
    }

    shuffleTests(array) {
        // Modern Fisher-Yates Array Shuffle
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    loadTest() {
        if(this.currentTestIndex >= this.tests.length) {
            this.finishAssessment();
            return;
        }

        const testConfig = this.tests[this.currentTestIndex];
        
        // Progress display (e.g. Activity 1 of 9)
        this.progressEl.innerText = `Activity ${this.currentTestIndex + 1} of ${this.tests.length}`;
        if(this.progressFillEl) {
            const percent = ((this.currentTestIndex) / this.tests.length) * 100;
            this.progressFillEl.style.width = `${percent}%`;
        }
        
        this.titleEl.innerText = testConfig.title;
        this.instructionEl.innerText = testConfig.instruction;
        
        // Add Enter animation
        this.container.classList.remove('page-exit');
        this.container.classList.add('page-enter');

        // Render inner HTML & Logic
        testConfig.render(this.container, (score) => {
            this.recordScore(testConfig.type, score);
            this.nextTest();
        });
    }

    recordScore(type, score) {
        if(type === 'visual') app.state.score_v += score;
        if(type === 'auditory') app.state.score_a += score;
        if(type === 'kinesthetic') app.state.score_k += score;
    }

    nextTest() {
        // Exit Animation
        this.container.classList.remove('page-enter');
        this.container.classList.add('page-exit');
        
        if(this.progressFillEl) {
            const percent = ((this.currentTestIndex + 1) / this.tests.length) * 100;
            this.progressFillEl.style.width = `${percent}%`;
        }

        setTimeout(() => {
            this.currentTestIndex++;
            this.loadTest();
        }, 400); // Wait for CSS transition finish
    }

    finishAssessment() {
        // Save to global storage
        app.saveState();
        app.recalculateStyle();
        // Redirect to new specified result page file
        app.navigate('learner-result.html');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Only init inside the test runner page 
    if(document.getElementById('test-container')) {
        window.assessmentSys = new AssessmentSystem();
    }
});
