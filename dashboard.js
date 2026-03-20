class DashboardEngine {
    constructor() {
        this.engine = new AdaptiveEngine();
        this.container = document.getElementById('dashboard-content');
        if(!this.container) return;
        
        this.refresh();
    }

    refresh() {
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
        const completed = this.progress.completed_letters || [];
        const totalUyir = 12;
        const totalMei = 18;
        
        const uyirCompleted = completed.filter(l => adaptiveEngineSys.getLetterData(l)?.type === 'uyir').length;
        const meiCompleted = completed.filter(l => adaptiveEngineSys.getLetterData(l)?.type === 'mei').length;

        const skills = {
            uyir: Math.round((uyirCompleted / totalUyir) * 100),
            mei: Math.round((meiCompleted / totalMei) * 100),
            writing: this.progress.skills.writing || 0,
            phonics: this.progress.skills.phonics || 0
        };

        const streak = localStorage.getItem('tm_streak') || 1;
        const xp = localStorage.getItem('tm_xp') || 0;

        // Head section
        document.getElementById('dash-name').innerHTML = `Hello, ${this.student.name}! <div class="streak-badge"><i class="fa-solid fa-fire"></i> ${streak}</div>`;
        document.getElementById('dash-age').innerText = `${this.style.toUpperCase()} Learner | Age ${this.student.age}`;

        this.container.innerHTML = `
            <!-- Stats Overview -->
            <div class="grid-4 mb-3">
                ${this.renderStatCard('Uyir Vowels', skills.uyir, 'var(--primary)', 'fa-moon')}
                ${this.renderStatCard('Mei Consonants', skills.mei, 'var(--info)', 'fa-sun')}
                ${this.renderStatCard('Writing Skill', skills.writing, 'var(--accent)', 'fa-pen-nib')}
                ${this.renderStatCard('Sound Mastery', skills.phonics, 'var(--warning)', 'fa-microphone')}
            </div>

            <div class="dashboard-details" style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap:25px;">
                <!-- Left Column: The Path & Focus -->
                <div class="left-col">
                    <!-- Path Section -->
                    <div class="glass-panel mb-3" style="padding: 2rem; text-align: center;">
                        <h3 class="mb-2" style="font-family: var(--font-tamil); font-size: 1.5rem;"><i class="fa-solid fa-map-location-dot"></i> Your Learning Path</h3>
                        <div class="path-container" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                            ${this.renderPathNode('அ', true)}
                            <div style="width: 4px; height: 30px; background: #eee;"></div>
                            ${this.renderPathNode('ஆ', completed.includes('ஆ'))}
                            <div style="width: 4px; height: 30px; background: #eee;"></div>
                            ${this.renderPathNode('இ', completed.includes('இ'))}
                            <div style="width: 4px; height: 30px; background: #eee;"></div>
                            ${this.renderPathNode('?', false)}
                        </div>
                    </div>

                    <!-- Focus Area -->
                    <div class="glass-panel" style="padding: 2rem;">
                        <h3 class="mb-2" style="font-family: var(--font-tamil); font-size: 1.2rem;"><i class="fa-solid fa-bullseye" style="color:var(--error)"></i> Targeted Practice</h3>
                        <div id="focus-area-content" style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom: 2rem;">
                            <!-- Weak letters will be injected here -->
                            ${this.renderWeakLetters()}
                        </div>
                        <div class="ai-box" style="background: rgba(189, 224, 254, 0.2); padding: 1.5rem; border-radius: 15px; border-left: 6px solid var(--info);">
                            <h4 style="color: var(--info); margin-bottom: 0.5rem;"><i class="fa-solid fa-robot"></i> AI Recommendation</h4>
                            <p id="ai-reco" style="font-weight: 600; color: var(--text-main); font-size: 1rem;">
                                ${this.generateRecommendation()}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Achievements & Quick Actions -->
                <div class="right-col">
                    <div class="glass-panel mb-3" style="padding: 2rem;">
                        <h3 class="mb-2" style="font-family: var(--font-tamil); font-size: 1.2rem;"><i class="fa-solid fa-medal" style="color:var(--warning)"></i> Achievements</h3>
                        <div class="achievements-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                            ${this.renderBadge('Fast Starter', 'Started first lesson', true)}
                            ${this.renderBadge('Artisan', '90% trace accuracy', skills.writing >= 90)}
                            ${this.renderBadge('Vowel King', 'All vowels done', skills.uyir >= 100)}
                            ${this.renderBadge('Scholar', 'Finished assessment', true)}
                        </div>
                    </div>

                    <div class="glass-panel" style="padding: 2rem; background: var(--primary); color: white;">
                        <h3>Weekly Goal</h3>
                        <p style="opacity: 0.9; margin: 1rem 0;">You have earned <b>${xp} XP</b> this week! Just 100 XP more to reach your goal.</p>
                        <button class="btn btn-secondary" style="width:100%; color:var(--primary); font-weight:800;" onclick="window.location.href='practice.html'">Enter Practice Room <i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                </div>
            </div>
        `;
    }

    renderStatCard(label, val, color, icon) {
        return `
            <div class="card" style="border-top: 6px solid ${color}; padding: 1.5rem; background: white; border-radius: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="color: var(--text-main); font-size: 1rem; font-weight:900;">${label}</h3>
                    <i class="fa-solid ${icon}" style="color: ${color}; opacity: 0.5;"></i>
                </div>
                <div style="height:8px; background:#f0f0f0; border-radius:10px; overflow:hidden;">
                    <div style="width: ${val}%; height:100%; background: ${color}; border-radius:10px; transition: width 1s ease;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 0.8rem;">
                    <span style="font-weight: 900; color: var(--text-main); font-size: 1.2rem;">${val}%</span>
                </div>
            </div>
        `;
    }

    renderPathNode(letter, active) {
        return `
            <div class="path-node ${active ? 'active' : ''}" style="width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-family: var(--font-tamil); cursor: pointer; border: 4px solid var(--primary); background: ${active ? 'var(--primary)' : 'white'}; color: ${active ? 'white' : '#ccc'};">
                ${letter}
            </div>
        `;
    }

    renderBadge(title, desc, unlocked) {
        return `
            <div class="badge-card" style="text-align:center; opacity:${unlocked ? 1 : 0.3}; filter:${unlocked ? 'none' : 'grayscale(1)'}">
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${unlocked ? '🏅' : '🔒'}</div>
                <div style="font-size: 0.8rem; font-weight: 800; color: var(--text-main);">${title}</div>
            </div>
        `;
    }

    renderWeakLetters() {
        const mistakes = this.progress.mistakes || {};
        const weak = Object.keys(mistakes).filter(l => {
            const counts = Object.values(mistakes[l]);
            return counts.reduce((a,b) => a+b, 0) >= 2;
        });
        
        if(weak.length === 0) return '<p style="color:var(--text-muted); font-style:italic;">No weak letters detected yet!</p>';

        return weak.map(l => `
            <div class="card text-center" style="padding:10px; min-width:60px; border:2px solid var(--error); background:white; font-family:var(--font-tamil); font-size:1.5rem;">${l}</div>
        `).join('');
    }

    generateRecommendation() {
        const style = this.style;
        if(style === 'visual') return "Try the <b>'Watch Guide'</b> button in the tracing room. It will show you exactly how to draw the letter!";
        if(style === 'auditory') return "Try <b>singing the letter sounds</b> as you trace. The rhythm will build strong memory paths!";
        return "Focus on the <b>pressure of your strokes</b>. Feeling the letter is your key to learning!";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dashboardSys = new DashboardEngine();
});
