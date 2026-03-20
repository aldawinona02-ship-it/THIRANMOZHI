class AudioSystem {
    constructor() {
        this.synth = window.speechSynthesis;
    }

    play(text, lang = 'ta-IN') {
        if (!this.synth) {
            console.warn("Speech Synthesis API not supported.");
            return;
        }

        // Cancel any currently playing speech to prevent queuing lag
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.8; // Speak slightly slower for kids
        utterance.pitch = 1.2; // Slightly higher pitch for friendliness

        this.synth.speak(utterance);
    }

    playFeedback(type) {
        // Types: 'success', 'try-again', 'excellent'
        // Using AudioContext for bleeps and bloops
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if(type === 'success' || type === 'excellent') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        } else if (type === 'try-again') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        }
    }
}

window.audioSys = new AudioSystem();
