/**
 * THIRANMOZHI - Final Audio System
 * Location: assets/audio/
 */
class AudioSystem {
    constructor() {
        this.basePath = 'assets/audio/';
        this.synth = window.speechSynthesis;
        this.currentAudio = null;
    }

    play(text) {
        this.stopAll();

        // Target: assets/audio/அ.mp3
        const audioPath = `${this.basePath}${text}.mp3`;
        const audio = new Audio(audioPath);

        audio.play()
            .then(() => {
                this.currentAudio = audio;
                console.log(`Playing high-quality file: ${text}.mp3`);
            })
            .catch(() => {
                console.warn(`File ${text}.mp3 not found. Falling back to TTS.`);
                this.playFallback(text);
            });
    }

    playFallback(text) {
        if (!this.synth) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ta-IN';
        utterance.rate = 0.8;
        this.synth.speak(utterance);
    }

    stopAll() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
        if (this.synth) this.synth.cancel();
    }
}

window.audioSys = new AudioSystem();
