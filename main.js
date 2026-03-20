/**
 * THIRANMOZHI Global Router & State Engine
 */
const app = {
    state: {
        student: { name: '', age: '', gender: '' },
        is_assessed: false,
        score_v: 0,
        score_a: 0,
        score_k: 0,
        assessment_scores: { visual: 0, auditory: 0, kinesthetic: 0 },
        dominant_style: 'unassessed',
        progress: {
            completed_letters: [],
            total_time_mins: 0,
            avg_accuracy: 0,
            mistakes: {},
            skills: { uyir: 0, mei: 0, writing: 0, phonics: 0 },
            metrics: {
                recognition_speed: [],
                pronunciation_scores: [],
                tracing_accuracy: []
            },
            achievements: []
        }
    },

    initStore() {
        try {
            const studentStr = localStorage.getItem('thiranmozhi_student');
            if (studentStr && studentStr !== 'undefined') {
                this.state.student = JSON.parse(studentStr);
            }
            this.state.score_v = parseInt(localStorage.getItem('tm_score_v')) || 0;
            this.state.score_a = parseInt(localStorage.getItem('tm_score_a')) || 0;
            this.state.score_k = parseInt(localStorage.getItem('tm_score_k')) || 0;
            this.state.dominant_style = localStorage.getItem('tm_style') || 'unassessed';
            this.state.is_assessed = this.state.dominant_style !== 'unassessed';

            const scoresStr = localStorage.getItem('tm_assessment_scores');
            if (scoresStr) this.state.assessment_scores = JSON.parse(scoresStr);

            const progressStr = localStorage.getItem('tm_progress');
            if (progressStr && progressStr !== 'undefined') {
                this.state.progress = JSON.parse(progressStr);
            }

            this.autoLogin();
            this.updateStreak();
        } catch (e) {
            console.warn("State initialization error:", e);
        }
    },

    autoLogin() {
        const path = window.location.pathname;
        const isLanding = path.endsWith('index.html') || path === '/' || path.endsWith('THIRANMOZHI-1/');
        const isInfo = path.includes('student-info.html');
        const isTest = path.includes('test.html') || path.includes('pre-test.html') || path.includes('test-intro.html');
        const isMap = path.includes('map.html');
        const isDash = path.includes('dashboard.html');
        const isActivity = path.includes('activity.html') || path.includes('review.html') || path.includes('practice.html') || path.includes('tracing.html');
        const isResult = path.includes('result.html');

        const hasProfile = !!this.state.student.name;
        const hasAssessed = this.state.is_assessed;

        // Guard: no profile → go to info
        if (!hasProfile && !isInfo && !isLanding) {
            this.navigate('student-info.html');
            return;
        }
        // Guard: profile but not assessed → go to assessment
        if (hasProfile && !hasAssessed && (isDash || isMap)) {
            this.navigate('test-intro.html');
            return;
        }
        // Guard: assessed, on dashboard → redirect to map
        if (hasProfile && hasAssessed && isDash) {
            this.navigate('map.html');
        }
    },

    saveState() {
        localStorage.setItem('thiranmozhi_student', JSON.stringify(this.state.student));
        localStorage.setItem('tm_score_v', this.state.score_v);
        localStorage.setItem('tm_score_a', this.state.score_a);
        localStorage.setItem('tm_score_k', this.state.score_k);
        localStorage.setItem('tm_assessment_scores', JSON.stringify(this.state.assessment_scores));
        localStorage.setItem('tm_style', this.state.dominant_style);
        localStorage.setItem('tm_progress', JSON.stringify(this.state.progress));
    },

    recalculateStyle() {
        const s = this.state.assessment_scores;
        let style = 'visual';
        let max = s.visual;

        if (s.auditory > max) { max = s.auditory; style = 'auditory'; }
        if (s.kinesthetic > max) { max = s.kinesthetic; style = 'kinesthetic'; }

        this.state.dominant_style = style;
        this.state.is_assessed = true;
        this.saveState();
        return style;
    },

    resetAssessment() {
        this.state.score_v = 0;
        this.state.score_a = 0;
        this.state.score_k = 0;
        this.state.assessment_scores = { visual: 0, auditory: 0, kinesthetic: 0 };
        this.state.dominant_style = 'unassessed';
        this.state.is_assessed = false;
        this.saveState();
    },

    navigate(url) {
        window.location.href = url;
    },

    updateStreak() {
        const lastLogin = localStorage.getItem('tm_last_login');
        const today = new Date().toDateString();
        if (lastLogin !== today) {
            let streak = parseInt(localStorage.getItem('tm_streak')) || 0;
            const lastDate = new Date(lastLogin);
            const diff = (new Date(today) - lastDate) / (1000 * 60 * 60 * 24);
            if (diff <= 1) streak++; else streak = 1;
            localStorage.setItem('tm_streak', streak);
            localStorage.setItem('tm_last_login', today);
        }
    },

    recordMetric(type, value) {
        if (!this.state.progress.metrics[type]) this.state.progress.metrics[type] = [];
        this.state.progress.metrics[type].push(value);
        this.saveState();
    },

    updateSkillScore(skill, newScore) {
        if (this.state.progress.skills[skill] !== undefined) {
            this.state.progress.skills[skill] = newScore;
            this.saveState();
        }
    },

    recordMistake(asked, answered) {
        if (!this.state.progress.mistakes[asked]) this.state.progress.mistakes[asked] = {};
        this.state.progress.mistakes[asked][answered] = (this.state.progress.mistakes[asked][answered] || 0) + 1;
        this.saveState();
    },

    getConfusionPair(letter) {
        const pairs = {
            'ழ': 'ள', 'ள': 'ழ',
            'ர': 'ற', 'ற': 'ர',
            'ன': 'ண', 'ண': 'ன',
            'ந': 'ன', 'ல': 'ள'
        };
        return pairs[letter] || null;
    },

    notify(title, msg, type = 'info') {
        console.log(`Notification: [${type.toUpperCase()}] ${title} - ${msg}`);
    },

    showComparison(l1, l2) {
        const explanations = {
            'ழ': 'Retrofleks (Tongue rolls back deep).',
            'ள': 'Alveolar (Tongue curls to roof).',
            'ற': 'Hard Tril (Sharp vibrations).',
            'ர': 'Soft Tap (Gentle touch).'
        };

        const modal = document.createElement('div');
        modal.id = 'comparison-modal';
        modal.innerHTML = `
            <div style="position:fixed; top:0; left:0; width:100%; height:100vh; background:rgba(0,0,0,0.7); backdrop-filter:blur(8px); z-index:10000; display:flex; align-items:center; justify-content:center; padding:20px;">
                <div class="glass-card" style="max-width:600px; width:100%; text-align:center; position:relative; animation: slideUp 0.5s ease;">
                    <button onclick="this.closest('#comparison-modal').remove()" style="position:absolute; top:20px; right:20px; background:none; border:none; font-size:1.5rem; cursor:pointer;">&times;</button>
                    <h2 style="color:var(--primary); margin-bottom:2rem;"><i class="fa-solid fa-graduation-cap"></i> AI Quick Comparison</h2>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:2rem;">
                        <div class="card p-2" style="background:white; border-radius:15px;">
                            <span style="font-size:5rem; font-family:var(--font-tamil); color:var(--text-main);">${l1}</span>
                            <p style="font-size:0.9rem; margin-top:1rem; font-weight:700;">${explanations[l1] || 'Primary Sound'}</p>
                        </div>
                        <div class="card p-2" style="background:white; border-radius:15px;">
                            <span style="font-size:5rem; font-family:var(--font-tamil); color:var(--text-main);">${l2}</span>
                            <p style="font-size:0.9rem; margin-top:1rem; font-weight:700;">${explanations[l2] || 'Similar Sound'}</p>
                        </div>
                    </div>
                    <div style="background:rgba(189, 224, 254, 0.2); padding:1rem; border-radius:12px; margin-bottom:2rem;">
                        <p style="font-weight:700; color:var(--primary);">Tip: Visual learners, notice the hook at the end of ${l1}.</p>
                    </div>
                    <button class="btn btn-primary" style="width:100%; padding:1rem;" onclick="this.closest('#comparison-modal').remove()">I Understand the Difference!</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
};

app.initStore();
window.app = app;
