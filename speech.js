const words = ['அம்மா', 'அப்பா', 'படம்', 'மரம்', 'பல்', 'கண்'];
let currentIndex = 0;

const targetEl = document.getElementById('target');
const micBtn = document.getElementById('mic-btn');
const resultEl = document.getElementById('result');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');

let recognition;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'ta-IN'; // Tamil (India)

    recognition.onstart = function() {
        micBtn.classList.add('listening');
        resultEl.innerText = "Listening...";
        feedbackEl.innerText = "";
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.trim();
        resultEl.innerText = `You said: "${transcript}"`;
        
        if (transcript === words[currentIndex]) {
            feedbackEl.innerText = "Excellent! ✨";
            feedbackEl.className = "feedback correct";
            nextBtn.style.display = 'inline-flex';
            
            // Add XP
            let xp = parseInt(localStorage.getItem('tm_xp') || '0');
            localStorage.setItem('tm_xp', xp + 20);
        } else {
            feedbackEl.innerText = "Try again!";
            feedbackEl.className = "feedback wrong";
        }
    };

    recognition.onerror = function(event) {
        console.error("Speech error", event);
        resultEl.innerText = "Error accessing microphone.";
        micBtn.classList.remove('listening');
    };

    recognition.onend = function() {
        micBtn.classList.remove('listening');
    };
} else {
    resultEl.innerText = "Speech Recognition API not supported in this browser. Please use Chrome.";
    micBtn.disabled = true;
    micBtn.style.opacity = 0.5;
}

micBtn.addEventListener('click', () => {
    if (recognition) {
        recognition.start();
    }
});

nextBtn.addEventListener('click', () => {
    currentIndex++;
    if(currentIndex >= words.length) currentIndex = 0;
    targetEl.innerText = words[currentIndex];
    resultEl.innerText = "Waiting for voice...";
    feedbackEl.innerText = "";
    nextBtn.style.display = 'none';
});
