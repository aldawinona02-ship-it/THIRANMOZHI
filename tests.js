const VAK_TESTS = [
    // --- VISUAL TESTS ---
    {
        id: 'v1',
        type: 'visual',
        title: 'Picture Memory',
        instruction: 'Look at these 6 pictures. Remember them!',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-visual-memory">
                    <div class="grid-3 mb-2" id="vm-pics">
                        <div class="card"><div class="card-icon" style="background:#ff9ff3">🍎</div>Apple</div>
                        <div class="card"><div class="card-icon" style="background:#54a0ff">🐘</div>Elephant</div>
                        <div class="card"><div class="card-icon" style="background:#feca57">🌞</div>Sun</div>
                        <div class="card"><div class="card-icon" style="background:#1dd1a1">🌳</div>Tree</div>
                        <div class="card"><div class="card-icon" style="background:#ff6b6b">🚗</div>Car</div>
                        <div class="card"><div class="card-icon" style="background:#48dbfb">💧</div>Water</div>
                    </div>
                    <div id="vm-question" class="hidden">
                        <h3 class="mb-2">Which one did you see?</h3>
                        <div class="grid-3">
                            <button class="btn btn-blue" onclick="window.submitTest(true)">🍎 Apple</button>
                            <button class="btn btn-blue" onclick="window.submitTest(false)">🎸 Guitar</button>
                            <button class="btn btn-blue" onclick="window.submitTest(false)">📚 Book</button>
                        </div>
                    </div>
                </div>
            `;
            // Hide after 4 seconds (simulating 10s for brevity in testing)
            setTimeout(() => {
                document.getElementById('vm-pics').classList.add('hidden');
                document.getElementById('vm-question').classList.remove('hidden');
                document.querySelector('.instruction-text').innerText = "Which one did you see?";
            }, 4000);
            
            window.submitTest = (isCorrect) => onComplete(isCorrect ? 10 : 0);
        }
    },
    // --- AUDITORY TESTS ---
    {
        id: 'a1',
        type: 'auditory',
        title: 'Sound Identification',
        instruction: 'Listen carefully, then pick what made the sound!',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-auditory text-center">
                    <button class="btn btn-yellow btn-large mb-2 pulse-cue" id="play-sound-btn" style="border-radius:50%; width:100px; height:100px; font-size:2rem;">
                        <i class="fa-solid fa-bell"></i>
                    </button>
                    <div id="audio-options" class="grid-3 hidden mt-2">
                        <button class="card" onclick="window.submitTest(false)"><div class="card-icon">🐕</div>Dog</button>
                        <button class="card" onclick="window.submitTest(true)"><div class="card-icon" style="background:var(--primary-yellow)">🔔</div>Bell</button>
                        <button class="card" onclick="window.submitTest(false)"><div class="card-icon">🚗</div>Car</button>
                    </div>
                </div>
            `;
            
            document.getElementById('play-sound-btn').onclick = () => {
                // Synthesize Bell sound using Oscillator
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
    // --- KINESTHETIC TESTS ---
    {
        id: 'k1',
        type: 'kinesthetic',
        title: 'Drag and Sort',
        instruction: 'Drag the Red Square into the Red Box.',
        render: (container, onComplete) => {
            container.innerHTML = `
                <div class="test-kinesthetic text-center">
                    <div style="display:flex; justify-content:space-around; align-items:center; min-height: 250px;">
                        <!-- Draggable item -->
                        <div id="drag-item" draggable="true" 
                             style="width:80px; height:80px; background:#ff6b6b; cursor:grab; border-radius:10px; box-shadow:0 4px 6px rgba(0,0,0,0.1)">
                        </div>

                        <!-- Drop Zone -->
                        <div id="drop-zone" 
                             style="width:120px; height:120px; border:4px dashed #ff6b6b; border-radius:10px; display:flex; align-items:center; justify-content:center;">
                             Drop Here
                        </div>
                    </div>
                </div>
            `;

            const item = document.getElementById('drag-item');
            const zone = document.getElementById('drop-zone');

            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', 'red-square');
                setTimeout(() => item.style.visibility = 'hidden', 0);
            });

            item.addEventListener('dragend', () => {
                item.style.visibility = 'visible';
            });

            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.style.background = '#ffe5e5';
            });

            zone.addEventListener('dragleave', () => {
                zone.style.background = 'transparent';
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.style.background = '#ff6b6b';
                zone.style.color = '#fff';
                zone.innerText = "Done!";
                item.style.display = 'none';
                
                // Complete after a short delay for feedback
                setTimeout(() => onComplete(10), 1000);
            });
            
            // Touch fallback for mobile (simulating auto success on touch for MVP demo)
            item.addEventListener('touchstart', (e) => {
                e.preventDefault();
                zone.style.background = '#ff6b6b';
                zone.style.color = '#fff';
                zone.innerText = "Done!";
                item.style.display = 'none';
                setTimeout(() => onComplete(10), 800);
            });
        }
    }
];

class AssessmentSystem {
    constructor() {
        this.currentTestIndex = 0;
        this.tests = this.shuffleTests([...VAK_TESTS]); // in real production, pick 3 of each randomly (9 total)
        this.container = document.getElementById('test-container');
        this.titleEl = document.getElementById('test-title');
        this.instructionEl = document.getElementById('test-instruction');
        this.progressEl = document.getElementById('test-progress');
        
        if(this.container) {
            this.loadTest();
        }
    }

    shuffleTests(array) {
        // Simple fisher-yates shuffle
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
        
        this.progressEl.innerText = `Test ${this.currentTestIndex + 1} of ${this.tests.length}`;
        this.titleEl.innerText = testConfig.title;
        this.instructionEl.innerText = testConfig.instruction;
        
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
        if(type === 'visual') app.state.score_v += score;
        if(type === 'auditory') app.state.score_a += score;
        if(type === 'kinesthetic') app.state.score_k += score;
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
        // Save to global state & Recalculate dominant style
        app.saveState();
        app.recalculateStyle();
        
        // Navigate
        app.navigate('result.html');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.assessmentSys = new AssessmentSystem();
});
