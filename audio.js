// AUDIO SYNTHESIZER MODULE (WEB AUDIO API)
class SoundEngine {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
    }

    play(type) {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        try {
            if (type === 'alarm') {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(950, now);
                osc.frequency.linearRampToValueAtTime(350, now + 0.22);
                gain.gain.setValueAtTime(0.2, now);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.22);
            } 
            else if (type === 'laugh') {
                // Risa Macabra sintetizada estilo Omega Flowey
                for (let i = 0; i < 7; i++) {
                    let osc = this.ctx.createOscillator();
                    let gain = this.ctx.createGain();
                    osc.type = 'sawtooth';
                    let t = now + i * 0.11;
                    osc.frequency.setValueAtTime(200 - i * 18, t);
                    osc.frequency.linearRampToValueAtTime(60, t + 0.09);
                    gain.gain.setValueAtTime(0.25, t);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(t);
                    osc.stop(t + 0.09);
                }
            } 
            else if (type === 'laser') {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(1400, now);
                osc.frequency.exponentialRampToValueAtTime(90, now + 0.38);
                gain.gain.setValueAtTime(0.25, now);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.38);
            } 
            else if (type === 'shoot') {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(650, now);
                osc.frequency.exponentialRampToValueAtTime(180, now + 0.07);
                gain.gain.setValueAtTime(0.12, now);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.07);
            } 
            else if (type === 'hit') {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(140, now);
                osc.frequency.linearRampToValueAtTime(30, now + 0.1);
                gain.gain.setValueAtTime(0.22, now);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.1);
            } 
            else if (type === 'pop') {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(850, now);
                osc.frequency.setValueAtTime(1350, now + 0.04);
                gain.gain.setValueAtTime(0.1, now);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.08);
            }
            else if (type === 'dodge') {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
                gain.gain.setValueAtTime(0.15, now);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.1);
            }
        } catch(e){}
    }
}

const sounds = new SoundEngine();
