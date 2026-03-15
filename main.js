/**
 * THIRANMOZHI Global Router & State Engine
 */
const app = {
    state: {
        student: null,
        score_v: 0,
        score_a: 0,
        score_k: 0,
        dominant_style: 'unassessed',
        progress: {
            completed_letters: [],
            total_time_mins: 0,
            avg_accuracy: 0,
            mistakes: {}, // Store as { asked: { answered: count } }
            skills: { uyir: 0, mei: 0, writing: 0, phonics: 0 },
            metrics: {
                recognition_speed: [], // reaction times
                pronunciation_scores: [],
                tracing_accuracy: []
            },
            achievements: []
        }
    },

    initStore() {
        try {
            const studentStr = localStorage.getItem('thiranmozhi_student') || localStorage.getItem('tm_student');
            if(studentStr && studentStr !== 'undefined') {
                this.state.student = JSON.parse(studentStr);
            }
            this.state.score_v = parseInt(localStorage.getItem('tm_score_v')) || 0;
            this.state.score_a = parseInt(localStorage.getItem('tm_score_a')) || 0;
            this.state.score_k = parseInt(localStorage.getItem('tm_score_k')) || 0;
            this.state.dominant_style = localStorage.getItem('tm_style') || 'unassessed';
            
            const progressStr = localStorage.getItem('tm_progress');
            if(progressStr && progressStr !== 'undefined') {
                this.state.progress = JSON.parse(progressStr);
            }

            // Auto-login logic
            if(this.state.student && window.location.pathname.endsWith('student-info.html')) {
                this.navigate('dashboard.html');
            }
            if(this.state.student && window.location.pathname.endsWith('index.html')) {
                // If they are on home but already logged in, we could redirect to dashboard 
                // but usually home is first. Let's make "Let's Learn" skip to dashboard.
            }
        } catch(e) {
            console.warn("LocalStorage access restricted by browser settings. State will reset on reload.");
        }
    },

    saveState() {
        try {
            localStorage.setItem('thiranmozhi_student', JSON.stringify(this.state.student));
            localStorage.setItem('tm_score_v', this.state.score_v);
            localStorage.setItem('tm_score_a', this.state.score_a);
            localStorage.setItem('tm_score_k', this.state.score_k);
            localStorage.setItem('tm_style', this.state.dominant_style);
            localStorage.setItem('tm_progress', JSON.stringify(this.state.progress));
        } catch(e) {
            // Silently fail if localStorage is not accessible
        }
    },

    navigate(url) {
        window.location.href = url;
    },

    recalculateStyle() {
        let { score_v, score_a, score_k, progress } = this.state;
        
        // AI Integration: Factor in recent metrics
        const avg = (arr) => arr.length ? arr.reduce((a,b) => a+b, 0) / arr.length : 0;
        
        const visual_bonus = avg(progress.metrics.recognition_speed) > 0 ? 5 : 0; // Speed bonus
        const auditory_bonus = avg(progress.metrics.pronunciation_scores);
        const kinesthetic_bonus = avg(progress.metrics.tracing_accuracy) > 80 ? 10 : 0;

        let v_total = score_v + visual_bonus;
        let a_total = score_a + auditory_bonus;
        let k_total = score_k + kinesthetic_bonus;

        let max = v_total;
        let style = 'visual';

        if (a_total > max) { max = a_total; style = 'auditory'; }
        if (k_total > max) { max = k_total; style = 'kinesthetic'; }

        this.state.dominant_style = style;
        this.saveState();
        return style;
    },

    recordMistake(asked, answered) {
        if(!this.state.progress.mistakes) this.state.progress.mistakes = {};
        if(!this.state.progress.mistakes[asked]) this.state.progress.mistakes[asked] = {};
        
        this.state.progress.mistakes[asked][answered || 'unknown'] = (this.state.progress.mistakes[asked][answered || 'unknown'] || 0) + 1;
        this.saveState();
    },

    recordMetric(type, value) {
        if(!this.state.progress.metrics[type]) return;
        this.state.progress.metrics[type].push(value);
        if(this.state.progress.metrics[type].length > 20) this.state.progress.metrics[type].shift(); // Keep last 20
        this.recalculateStyle();
    },

    updateSkillScore(skill, value) {
        if(!this.state.progress.skills) {
            this.state.progress.skills = { uyir: 0, mei: 0, writing: 0, phonics: 0 };
        }
        this.state.progress.skills[skill] = value;
        this.saveState();
    },

    getConfusionPair(letter) {
        const confusionMap = {
            'ழ': 'ள',
            'ள': 'ழ',
            'ற': 'ர',
            'ர': 'ற',
            'ன': 'ன',
            'ண': 'ந',
            'ந': 'ண'
        };
        return confusionMap[letter];
    },

    showComparison(l1, l2) {
        // Create modal on the fly
        const modal = document.createElement('div');
        modal.id = 'comparison-modal';
        modal.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
            background: rgba(0,0,0,0.4); backdrop-filter: blur(10px);
            display: flex; align-items: center; justify-content: center; z-index: 9999;
            padding: 2rem;
        `;

        const explanations = {
            'ழ': 'Roll your tongue back (Retrofleks). Like "Tamil" (Thamizh).',
            'ள': 'Curl your tongue (Alveolar). Like "Apple" (Aappul).',
            'ற': 'Hard "R" sound. Vibrate your tongue.',
            'ர': 'Soft "R" sound. Like "Rabbit".'
        };

        modal.innerHTML = `
            <div class="glass-panel" style="max-width: 600px; width: 100%; text-align: center; border: 4px solid var(--info); animation: slideUp 0.5s ease;">
                <h2 style="color: var(--info); margin-bottom: 2rem;"><i class="fa-solid fa-graduation-cap"></i> AI Quick Comparison</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 2.5rem;">
                    <div class="card p-2" style="background: white;">
                        <span style="font-size: 5rem; font-family: var(--font-tamil); line-height: 1;">${l1}</span>
                        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.4; margin-top: 1rem;">${explanations[l1] || 'Primary Sound'}</p>
                    </div>
                    <div class="card p-2" style="background: white;">
                        <span style="font-size: 5rem; font-family: var(--font-tamil); line-height: 1;">${l2}</span>
                        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.4; margin-top: 1rem;">${explanations[l2] || 'Similar Sound'}</p>
                    </div>
                </div>
                <div style="background: rgba(189, 224, 254, 0.2); padding: 1.5rem; border-radius: 15px; margin-bottom: 2rem;">
                    <p style="font-weight: 700; color: var(--text-main);">Notice the difference in tongue placement?</p>
                </div>
                <button class="btn btn-primary" style="width: 100%; padding: 1.2rem;" onclick="document.getElementById('comparison-modal').remove()">I Understand the Difference!</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
};

// Initialize State Safely
app.initStore();

// Expose to window for inline scripts
window.app = app;


