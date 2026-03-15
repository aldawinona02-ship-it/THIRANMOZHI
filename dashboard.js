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

        const skills = this.progress.skills || { reading: 85, listening: 72, writing: 60 };
        const mistakes = this.progress.mistakes || {};
        const weakLetters = Object.keys(mistakes).filter(l => mistakes[l] >= 2);

        document.getElementById('dash-name').innerText = this.student.name;
        document.getElementById('dash-age').innerText = `${this.student.age} yrs (${this.student.gender})`;
        
        this.container.innerHTML = `
            <div class="grid-3 mb-3">
                <div class="card" style="border-top: 5px solid #3498db">
                    <h3>Reading</h3>
                    <div class="progress-bar-container mt-1" style="height:10px; background:#eee; border-radius:5px; overflow:hidden;">
                        <div style="width: ${skills.reading}%; height:100%; background:#3498db; border-radius:5px;"></div>
                    </div>
                    <h2 class="mt-1">${skills.reading}%</h2>
                </div>
                <div class="card" style="border-top: 5px solid #f1c40f">
                    <h3>Listening</h3>
                    <div class="progress-bar-container mt-1" style="height:10px; background:#eee; border-radius:5px; overflow:hidden;">
                        <div style="width: ${skills.listening}%; height:100%; background:#f1c40f; border-radius:5px;"></div>
                    </div>
                    <h2 class="mt-1">${skills.listening}%</h2>
                </div>
                <div class="card" style="border-top: 5px solid #2ecc71">
                    <h3>Writing</h3>
                    <div class="progress-bar-container mt-1" style="height:10px; background:#eee; border-radius:5px; overflow:hidden;">
                        <div style="width: ${skills.writing}%; height:100%; background:#2ecc71; border-radius:5px;"></div>
                    </div>
                    <h2 class="mt-1">${skills.writing}%</h2>
                </div>
            </div>

            <div class="dashboard-details" style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                <div class="glass-panel">
                    <h3 class="mb-2"><i class="fa-solid fa-triangle-exclamation" style="color:#e74c3c"></i> Letters to Practice</h3>
                    <div class="weak-letters-grid" style="display:flex; gap:10px; flex-wrap:wrap;">
                        ${weakLetters.length > 0 ? 
                            weakLetters.map(l => `<div class="card text-center" style="padding:10px; min-width:60px; border:2px solid #e74c3c; font-family:var(--font-tamil); font-size:1.5rem;">${l}</div>`).join('') :
                            '<p style="font-style:italic; color:var(--text-muted);">No weak letters detected yet. Keep learning!</p>'
                        }
                    </div>
                    ${weakLetters.length > 0 ? `<button class="btn btn-primary mt-2" onclick="alert('Starting revision for weak letters...')">Start Revision</button>` : ''}
                </div>

                <div class="glass-panel">
                    <h3 class="mb-2">Learning Style: <span style="text-transform:capitalize; color:var(--primary-blue)">${this.style}</span></h3>
                    <p style="font-style:italic; border-left:4px solid var(--primary-blue); padding-left:10px; background:rgba(52, 152, 219, 0.05); padding:10px; border-radius:0 10px 10px 0;">
                        ${this.generateRecommendation()}
                    </p>
                    <div class="mt-2 text-center">
                         <div style="font-size: 3rem; color: var(--primary-blue);">
                            <i class="fa-solid fa-${this.style === 'visual' ? 'eye' : this.style === 'auditory' ? 'headphones' : 'hand-pointer'}"></i>
                         </div>
                    </div>
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
