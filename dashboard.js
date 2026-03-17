class DashboardEngine {
    constructor() {
        this.engine = new AdaptiveEngine();
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

    renderDashboard() {
        const student = app.state.student;
        const dominant = app.state.dominant_style;
        const scores = {
            v: app.state.score_v,
            a: app.state.score_a,
            k: app.state.score_k
        };
        
        // Update Profile Area
        document.getElementById('dash-name').innerText = `Hello, ${student.name}!`;
        document.getElementById('dash-age').innerText = `${dominant.charAt(0).toUpperCase() + dominant.slice(1)} Learner | Age ${student.age}`;

        // Render Skills Grid
        const skillsGrid = document.getElementById('skills-grid');
        skillsGrid.innerHTML = '';
        const skills = [
            { name: 'Visual Recognition', score: scores.v || 0, icon: 'fa-eye', color: 'var(--primary)' },
            { name: 'Phonic Strength', score: scores.a || 0, icon: 'fa-ear-listen', color: 'var(--secondary)' },
            { name: 'Motor Coordination', score: scores.k || 0, icon: 'fa-hand-pointer', color: 'var(--accent)' },
            { name: 'Memory', score: Math.round((scores.v + scores.a) / 1.5) || 0, icon: 'fa-brain', color: 'var(--info)' }
        ];

        skills.forEach(skill => {
            skillsGrid.innerHTML += `
                <div class="skill-card" style="background: rgba(255,255,255,0.8); padding: 1.25rem; border-radius: var(--radius-md); border-bottom: 4px solid ${skill.color};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <i class="fa-solid ${skill.icon}" style="color: ${skill.color};"></i>
                        <span style="font-weight: 800; font-size: 0.9rem;">${skill.score}%</span>
                    </div>
                    <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">${skill.name}</div>
                    <div class="progress-mini" style="height: 6px; background: #e2e8f0; border-radius: 10px; margin-top: 0.5rem; overflow: hidden;">
                        <div style="width: ${skill.score}%; height: 100%; background: ${skill.color};"></div>
                    </div>
                </div>
            `;
        });

        // Render Achievements
        const achievementsGrid = document.getElementById('achievements-grid');
        achievementsGrid.innerHTML = '';
        const badges = [
            { name: 'First Step', icon: 'fa-shoe-prints', unlocked: true },
            { name: 'Tamil Scholar', icon: 'fa-book-open', unlocked: scores.v > 80 },
            { name: 'Master Tracer', icon: 'fa-feather-pointed', unlocked: scores.k > 80 },
            { name: 'Sound Seeker', icon: 'fa-music', unlocked: scores.a > 80 }
        ];

        badges.forEach(badge => {
            achievementsGrid.innerHTML += `
                <div class="achievement-badge text-center" style="opacity: ${badge.unlocked ? 1 : 0.3}; filter: ${badge.unlocked ? 'none' : 'grayscale(1)'}">
                    <div style="font-size: 2rem; color: var(--warning); margin-bottom: 0.5rem;"><i class="fa-solid ${badge.icon}"></i></div>
                    <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">${badge.name}</div>
                </div>
            `;
        });

        // Focus Area (Weak Letters) logic
        const focusArea = document.getElementById('focus-area-content');
        const weakLetters = this.engine.getWeakLetters();
        
        if (weakLetters.length > 0) {
            focusArea.innerHTML = `
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">Let's work on these specific letters today:</p>
                <div style="display: flex; gap: 0.5rem;">
                    ${weakLetters.map(l => `<span style="width: 45px; height: 45px; background: var(--error); color: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-family: var(--font-tamil); font-weight: 800; box-shadow: 0 4px 0 #b91c1c;">${l}</span>`).join('')}
                </div>
            `;
        } else {
            focusArea.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted);">Mastering everything! Keep practicing to find new challenges.</p>`;
        }

        // AI Coaching Advice
        const aiReco = document.getElementById('ai-reco');
        if (weakLetters.length > 0) {
            aiReco.innerText = `You're having a little trouble with "${weakLetters[0]}". Don't worry, even scholars take time! Try to trace it 5 times today.`;
        } else if (dominant === 'visual') {
            aiReco.innerText = "Focus on the shape of the letters. Try drawing them in the air before you trace!";
        } else if (dominant === 'auditory') {
            aiReco.innerText = "Listen closely to the letter sounds. Speak them out loud as you trace them!";
        } else {
            aiReco.innerText = "Keep your hand moving! Physical practice is your superpower.";
        }
    }

    render() {
        const completed = app.state.progress.completed_letters || [];
        const totalUyir = 12; // அ to ஔ
        const totalMei = 18; // க to ன
        
        const uyirCompleted = completed.filter(l => adaptiveEngineSys.getLetterData(l)?.type === 'uyir').length;
        const meiCompleted = completed.filter(l => adaptiveEngineSys.getLetterData(l)?.type === 'mei').length;

        const skills = {
            uyir: Math.round((uyirCompleted / totalUyir) * 100),
            mei: Math.round((meiCompleted / totalMei) * 100),
            writing: app.state.progress.skills.writing || 0,
            phonics: app.state.progress.skills.phonics || 0
        };

        // Gamification: Mei Explorer check
        if(meiCompleted >= 5 && !app.state.progress.achievements.includes('Mei Explorer')) {
            app.state.progress.achievements.push('Mei Explorer');
            app.saveState();
        }

        const mistakes = this.progress.mistakes || {};
        const weakLetters = Object.keys(mistakes).filter(l => {
            const counts = Object.values(mistakes[l]);
            return counts.reduce((a,b) => a+b, 0) >= 2;
        });

        document.getElementById('dash-name').innerText = `${this.student.name}'s Progress`;
        document.getElementById('dash-age').innerText = `${this.student.age} yrs | ${this.student.gender} | ${this.style.toUpperCase()} Learner`;
        
        this.container.innerHTML = `
            <!-- Skill Progress Section -->
            <div class="grid-4 mb-3">
                ${this.renderSkillCard('Uyir Vowels', skills.uyir, 'var(--primary)', 'fa-moon')}
                ${this.renderSkillCard('Mei Consonants', skills.mei, 'var(--info)', 'fa-sun')}
                ${this.renderSkillCard('Writing Accuracy', skills.writing, 'var(--accent)', 'fa-pen-nib')}
                ${this.renderSkillCard('Pronunciation', skills.phonics, 'var(--warning)', 'fa-comment')}
            </div>

            <div class="dashboard-details" style="display:grid; grid-template-columns: 1fr 1fr; gap:25px;">
                <!-- Weak Areas & AI Recommendation -->
                <div class="glass-panel" style="padding: 2rem;">
                    <h3 class="mb-2" style="font-family: var(--font-tamil); font-size: 1.5rem;"><i class="fa-solid fa-triangle-exclamation" style="color:var(--error)"></i> Weak Letters Detection</h3>
                    <div class="weak-letters-grid mb-2" style="display:flex; gap:12px; flex-wrap:wrap;">
                        ${weakLetters.length > 0 ? 
                            weakLetters.map(l => `
                                <div class="card text-center" style="padding:15px; min-width:80px; border:3px solid var(--error); background:white;">
                                    <div style="font-family:var(--font-tamil); font-size:2.5rem; color:var(--text-main);">${l}</div>
                                    <small style="color:var(--error); font-weight:800;">NEEDS HELP</small>
                                </div>`).join('') :
                            '<p style="font-style:italic; color:var(--text-muted); font-weight:600;">Perfect accuracy so far! No weak letters detected.</p>'
                        }
                    </div>
                    
                    <div class="ai-recommendation-box" style="background: rgba(189, 224, 254, 0.2); padding: 1.5rem; border-radius: 15px; border-left: 6px solid var(--info);">
                        <h4 style="color: var(--info); margin-bottom: 0.5rem;"><i class="fa-solid fa-robot"></i> AI Recommended Path</h4>
                        <p style="font-weight: 600; color: var(--text-main); font-size: 1.1rem;">
                            ${this.generateRecommendation(weakLetters)}
                        </p>
                        ${weakLetters.length > 0 ? `<button class="btn btn-primary mt-1" style="width:100%" onclick="app.navigate('learning.html')">Start Specialized Lesson</button>` : ''}
                    </div>
                </div>

                <!-- Achievements / Gamification -->
                <div class="glass-panel" style="padding: 2rem;">
                    <h3 class="mb-2" style="font-family: var(--font-tamil); font-size: 1.5rem;"><i class="fa-solid fa-medal" style="color:var(--warning)"></i> Achievements</h3>
                    <div class="achievements-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                        ${this.renderBadge('Uyir Master', 'All vowels correct', skills.uyir >= 100)}
                        ${this.renderBadge('Mei Explorer', '50 consonants practiced', skills.mei >= 50)}
                        ${this.renderBadge('Writing Star', '90% tracing accuracy', skills.writing >= 90)}
                        ${this.renderBadge('Tamil Beginner', 'Completed assessment', true)}
                    </div>
                </div>
            </div>
        `;
    }

    renderSkillCard(label, val, color, icon) {
        return `
            <div class="card" style="border-top: 6px solid ${color}; padding: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="color: var(--text-main); font-size: 1.1rem;">${label}</h3>
                    <i class="fa-solid ${icon}" style="color: ${color}; opacity: 0.5;"></i>
                </div>
                <div class="progress-bar-container" style="height:10px; background:rgba(0,0,0,0.05); border-radius:10px; overflow:hidden;">
                    <div style="width: ${val}%; height:100%; background: ${color}; border-radius:10px; transition: width 1s ease;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
                    <span style="font-weight: 800; color: var(--text-main);">${val}%</span>
                    <small style="color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Progress</small>
                </div>
            </div>
        `;
    }

    renderBadge(title, desc, unlocked) {
        return `
            <div class="card text-center badge-card ${unlocked ? 'unlocked' : 'locked'}" style="padding: 1rem; border: 2px solid ${unlocked ? 'var(--warning)' : '#eee'}; opacity: ${unlocked ? 1 : 0.5}; position: relative; overflow: hidden;">
                ${unlocked ? '<div style="background: var(--warning); color: white; position: absolute; top: 5px; right: -25px; transform: rotate(45deg); padding: 2px 30px; font-size: 0.6rem; font-weight: 800;">EARNED</div>' : ''}
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${unlocked ? '🏅' : '🔒'}</div>
                <h4 style="font-size: 0.9rem; color: var(--text-main);">${title}</h4>
                <p style="font-size: 0.7rem; color: var(--text-muted); line-height: 1.2;">${desc}</p>
            </div>
        `;
    }

    generateRecommendation(weakLetters) {
        if(weakLetters.includes('ழ') || weakLetters.includes('ள')) {
            return "AI detected confusion between <b>ழ (rolling)</b> and <b>ள (curling)</b>. Focus on <b>Lesson 12: Tongue Positioning</b>.";
        }
        if(this.style === 'visual') return "Using your <b>Visual</b> strength: Watch the animated stroke order videos for better recall.";
        if(this.style === 'auditory') return "Using your <b>Auditory</b> strength: Practice with the 'Echo Mode' to match sounds more accurately.";
        if(this.style === 'kinesthetic') return "Using your <b>Kinesthetic</b> strength: Spend 10 more minutes on 'Free Writing' to build muscle memory.";
        return "Keep exploring the letters to unlock more personalized AI advice!";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dashboardSys = new DashboardEngine();
});
