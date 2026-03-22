const stories = [
    {
        ta: "சிறுவன் பந்து விளையாடுகிறான்.",
        en_q: "What is the boy doing?",
        choices: [
            { text: "Reading a book", correct: false },
            { text: "Playing with a ball", correct: true },
            { text: "Sleeping", correct: false }
        ]
    },
    {
        ta: "அம்மா உணவு சமைக்கிறார்.",
        en_q: "Who is cooking food?",
        choices: [
            { text: "Father (அப்பா)", correct: false },
            { text: "Brother (அண்ணன்)", correct: false },
            { text: "Mother (அம்மா)", correct: true }
        ]
    }
];

let currentStory = 0;

const listenBtn = document.getElementById('listen-btn');
const storyEl = document.getElementById('story-text');
const questionEl = document.getElementById('question-text');
const choicesEl = document.getElementById('choices');

function loadStory() {
    const s = stories[currentStory];
    storyEl.innerText = s.ta;
    questionEl.innerText = s.en_q;
    
    choicesEl.innerHTML = '';
    s.choices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerText = c.text;
        btn.onclick = () => {
            if(c.correct) {
                btn.classList.add('correct');
                setTimeout(() => {
                    alert('Correct! +15 XP');
                    let xp = parseInt(localStorage.getItem('tm_xp') || '0');
                    localStorage.setItem('tm_xp', xp + 15);
                    
                    currentStory++;
                    if(currentStory >= stories.length) currentStory = 0;
                    loadStory();
                }, 500);
            } else {
                btn.classList.add('wrong');
            }
        };
        choicesEl.appendChild(btn);
    });
}

listenBtn.addEventListener('click', () => {
    // Basic fallback to Web Speech API if responsivevoice fails or vice versa
    if(window.responsiveVoice) {
        responsiveVoice.speak(stories[currentStory].ta, "Tamil Male");
    } else {
        const u = new SpeechSynthesisUtterance(stories[currentStory].ta);
        u.lang = 'ta-IN';
        window.speechSynthesis.speak(u);
    }
});

loadStory();
