class DashboardEngine {
    constructor() {
        this.container = document.getElementById('dashboard-content');
        if(!this.container) return;
        
        this.student = app.state.student;
        this.progress = app.state.progress;
        this.style = app.state.dominant_style;
        this.scores = {
            v: app.state.score_v,
            a: app.state.score_a,
            k: app.state.score_k
        };

        this.render();
    }

    render() {
        if(!this.student) {
            this.container.innerHTML = `
                <div class="glass-panel text-center">
                    <h2>No student data found!</h2>
                    <p>Please complete the intake and assessment first.</p>
                    <button class="btn btn-blue mt-2" onclick="app.navigate('index.html')">Go Home</button>
                </div>
            `;
            return;
        }

        const completedCount = this.progress.completed_letters.length;
        const totalLetters = 4; // MVP limit

        document.getElementById('dash-name').innerText = this.student.name;
        document.getElementById('dash-age').innerText = `${this.student.age} yrs (${this.student.gender})`;
        
        // VAK Chart Heights
        const maxScore = Math.max(this.scores.v, this.scores.a, this.scores.k, 1);
        const hV = (this.scores.v / maxScore) * 100;
        const hA = (this.scores.a / maxScore) * 100;
        const hK = (this.scores.k / maxScore) * 100;

        this.container.innerHTML = `
            <div class="grid-3 mb-2">
                <div class="card" style="border-left: 6px solid var(--primary-green)">
                    <h3 class="mb-1">Primary Style</h3>
                    <div class="card-icon" style="background:#e0f2f1; color:var(--primary-green)">
                        <i class="fa-solid fa-${this.style === 'visual' ? 'eye' : this.style === 'auditory' ? 'headphones' : 'hand-pointer'}"></i>
                    </div>
                    <h2 style="text-transform: capitalize;">${this.style}</h2>
                </div>

                <div class="card" style="border-left: 6px solid var(--primary-blue)">
                    <h3 class="mb-1">Letters Mastered</h3>
                    <div class="card-icon" style="background:#e3f2fd; color:var(--primary-blue)">
                        <i class="fa-solid fa-trophy"></i>
                    </div>
                    <h2>${completedCount} / ${totalLetters}</h2>
                </div>

                <div class="card" style="border-left: 6px solid var(--primary-yellow)">
                    <h3 class="mb-1">Avg Accuracy</h3>
                    <div class="card-icon" style="background:#fffde7; color:#d4af37">
                        <i class="fa-solid fa-bullseye"></i>
                    </div>
                    <h2>${completedCount > 0 ? '92%' : '0%'}</h2> <!-- Mock % for MVP -->
                </div>
            </div>

            <div class="glass-panel mt-2">
                <h3 class="mb-2">VAK Assessment Scores Breakdown</h3>
                <div style="display: flex; height: 200px; align-items: flex-end; justify-content: space-around; border-bottom: 3px solid #e0e0e0; padding-bottom: 10px;">
                    
                    <div style="text-align:center; width: 60px;">
                        <div style="height: ${hV || 5}%; background: var(--primary-blue); border-radius: 8px 8px 0 0; transition: height 1s;"></div>
                        <span class="mt-1" style="display:block; font-weight:bold;">Visual</span>
                        <span>${this.scores.v}</span>
                    </div>

                    <div style="text-align:center; width: 60px;">
                        <div style="height: ${hA || 5}%; background: var(--primary-yellow); border-radius: 8px 8px 0 0; transition: height 1s;"></div>
                        <span class="mt-1" style="display:block; font-weight:bold;">Auditory</span>
                        <span>${this.scores.a}</span>
                    </div>

                    <div style="text-align:center; width: 60px;">
                        <div style="height: ${hK || 5}%; background: var(--primary-green); border-radius: 8px 8px 0 0; transition: height 1s;"></div>
                        <span class="mt-1" style="display:block; font-weight:bold;">Kinesthetic</span>
                        <span>${this.scores.k}</span>
                    </div>

                </div>

                <div class="mt-3">
                    <h3>Teacher Notes & Recommendations:</h3>
                    <p class="mt-1" style="color: var(--text-muted); background: white; padding: 1rem; border-radius: 8px; font-style: italic;">
                        ${this.generateRecommendation()}
                    </p>
                </div>
            </div>
        `;
    }

    generateRecommendation() {
        if(this.style === 'visual') return "Student responds well to high-contrast imagery and animated stroke orders. Minimize background noise.";
        if(this.style === 'auditory') return "Student relies heavily on verbal instructions and repetitive sound playback. Ensure device audio is optimized.";
        if(this.style === 'kinesthetic') return "Student showed high engagement with Drag & Drop tests. Let them spend more time on Canvas tracing without rushing.";
        return "Complete assessment to generate specific recommendations.";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dashboardSys = new DashboardEngine();
});
