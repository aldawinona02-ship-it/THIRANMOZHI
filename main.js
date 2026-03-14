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
            avg_accuracy: 0
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
        const { score_v, score_a, score_k } = this.state;
        let max = score_v;
        let style = 'visual';

        if (score_a > max) { max = score_a; style = 'auditory'; }
        if (score_k > max) { max = score_k; style = 'kinesthetic'; }

        this.state.dominant_style = style;
        this.saveState();
        return style;
    },

    resetAssessment() {
        this.state.score_v = 0;
        this.state.score_a = 0;
        this.state.score_k = 0;
        this.state.dominant_style = 'unassessed';
        this.saveState();
    }
};

// Initialize State Safely
app.initStore();

// Expose to window for inline scripts
window.app = app;


