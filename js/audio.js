/**
 * BỘ QUẢN LÝ ÂM THANH & TỔNG HỢP NHẠC NỀN LÃNG MẠN (Web Audio API)
 * Tự động tạo nhạc hộp quà (Music Box), giai điệu Happy Birthday & hiệu ứng âm thanh sống động.
 */

class RomanticAudioManager {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.musicTimeout = null;
        this.currentNoteIndex = 0;
        this.externalAudio = null;
        this.useExternal = false;
        this.musicPlayerEl = null;
        this.discEl = null;
        this.toggleBtn = null;
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        // Kiểm tra xem có file mp3 tùy chỉnh không
        this.checkExternalAudio();
        this.bindUI();
    }

    bindUI() {
        this.musicPlayerEl = document.getElementById("music-player");
        this.discEl = document.getElementById("music-disc");
        this.toggleBtn = document.getElementById("music-toggle-btn");

        if (this.toggleBtn) {
            this.toggleBtn.addEventListener("click", () => {
                this.toggleMusic();
            });
        }
    }

    checkExternalAudio() {
        const audio = new Audio();
        audio.src = "assets/audio/romantic-bgm.mp3";
        audio.loop = true;
        audio.addEventListener("canplaythrough", () => {
            this.externalAudio = audio;
            this.useExternal = true;
        });
        audio.addEventListener("error", () => {
            // Không có file hoặc load lỗi -> dùng bộ tổng hợp synthesizer tự động cực kỳ êm dịu
            this.useExternal = false;
        });
    }

    async ensureContext() {
        if (!this.ctx) {
            this.init();
        }
        if (this.ctx && this.ctx.state === "suspended") {
            await this.ctx.resume();
        }
    }

    startMusic() {
        this.ensureContext();
        if (this.isPlaying) return;
        this.isPlaying = true;

        if (this.discEl) {
            this.discEl.classList.add("spinning");
        }
        if (this.toggleBtn) {
            this.toggleBtn.setAttribute("aria-label", "Tạm dừng nhạc");
            this.toggleBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
            `;
        }

        if (this.useExternal && this.externalAudio) {
            this.externalAudio.play().catch(() => {
                this.playMusicBoxLoop();
            });
        } else {
            this.playMusicBoxLoop();
        }
    }

    pauseMusic() {
        this.isPlaying = false;
        if (this.discEl) {
            this.discEl.classList.remove("spinning");
        }
        if (this.toggleBtn) {
            this.toggleBtn.setAttribute("aria-label", "Phát nhạc");
            this.toggleBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
        }

        if (this.externalAudio) {
            this.externalAudio.pause();
        }
        if (this.musicTimeout) {
            clearTimeout(this.musicTimeout);
            this.musicTimeout = null;
        }
    }

    toggleMusic() {
        if (this.isPlaying) {
            this.pauseMusic();
        } else {
            this.startMusic();
        }
    }

    // Âm thanh Music Box / Chuông gió tinh tế
    playTone(freq, duration = 0.8, type = "sine", time = 0) {
        if (!this.ctx || this.isMuted) return;
        const startTime = this.ctx.currentTime + time;

        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        // Họa âm nhẹ tạo cảm giác ấm áp như hộp nhạc gỗ
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(freq * 2, startTime);

        // Envelope mềm mại
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.musicGain);

        osc.start(startTime);
        osc2.start(startTime);
        osc.stop(startTime + duration);
        osc2.stop(startTime + duration);
    }

    // Vòng lặp giai điệu Happy Birthday và Lofi Chord ngọt ngào
    playMusicBoxLoop() {
        if (!this.isPlaying) return;

        // Tần số các nốt: C4, D4, E4, F4, G4, A4, B4, C5, D5, E5, F5...
        const N = {
            C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
            C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00,
            G3: 196.00, A3: 220.00, F3: 174.61, C3: 130.81
        };

        // Giai điệu Happy Birthday nhẹ nhàng kết hợp hợp âm rải như hộp nhạc tình yêu
        const melody = [
            // Cụm 1: Happy birthday to you
            { note: N.G4, dur: 0.35, beat: 0.4 },
            { note: N.G4, dur: 0.25, beat: 0.3 },
            { note: N.A4, dur: 0.6,  beat: 0.65, bass: N.C4 },
            { note: N.G4, dur: 0.6,  beat: 0.65 },
            { note: N.C5, dur: 0.6,  beat: 0.65, bass: N.E4 },
            { note: N.B4, dur: 1.0,  beat: 1.1,  bass: N.G3 },

            // Cụm 2: Happy birthday to you
            { note: N.G4, dur: 0.35, beat: 0.4 },
            { note: N.G4, dur: 0.25, beat: 0.3 },
            { note: N.A4, dur: 0.6,  beat: 0.65, bass: N.D4 },
            { note: N.G4, dur: 0.6,  beat: 0.65 },
            { note: N.D5, dur: 0.6,  beat: 0.65, bass: N.F4 },
            { note: N.C5, dur: 1.0,  beat: 1.1,  bass: N.C4 },

            // Cụm 3: Happy birthday dear my love
            { note: N.G4, dur: 0.35, beat: 0.4 },
            { note: N.G4, dur: 0.25, beat: 0.3 },
            { note: N.G5, dur: 0.6,  beat: 0.65, bass: N.C4 },
            { note: N.E5, dur: 0.6,  beat: 0.65, bass: N.G4 },
            { note: N.C5, dur: 0.6,  beat: 0.65, bass: N.A4 },
            { note: N.B4, dur: 0.6,  beat: 0.65, bass: N.F4 },
            { note: N.A4, dur: 0.9,  beat: 1.0,  bass: N.D4 },

            // Cụm 4: Happy birthday to you
            { note: N.F5, dur: 0.35, beat: 0.4 },
            { note: N.F5, dur: 0.25, beat: 0.3 },
            { note: N.E5, dur: 0.6,  beat: 0.65, bass: N.C4 },
            { note: N.C5, dur: 0.6,  beat: 0.65, bass: N.G4 },
            { note: N.D5, dur: 0.6,  beat: 0.65, bass: N.G3 },
            { note: N.C5, dur: 1.4,  beat: 1.6,  bass: N.C3 },

            // Quãng nghỉ êm dịu rải lofi arpeggio
            { note: N.E4, dur: 0.8, beat: 0.5, bass: N.C4 },
            { note: N.G4, dur: 0.8, beat: 0.5 },
            { note: N.C5, dur: 0.8, beat: 0.5 },
            { note: N.E5, dur: 1.2, beat: 1.5 }
        ];

        let accumulatedTime = 0;
        melody.forEach(item => {
            setTimeout(() => {
                if (this.isPlaying) {
                    this.playTone(item.note, item.dur);
                    if (item.bass) {
                        this.playTone(item.bass, item.dur * 1.5, "sine");
                    }
                }
            }, accumulatedTime * 1000);
            accumulatedTime += item.beat;
        });

        // Lặp lại chu kỳ
        this.musicTimeout = setTimeout(() => {
            if (this.isPlaying) {
                this.playMusicBoxLoop();
            }
        }, (accumulatedTime + 0.8) * 1000);
    }

    // Hiệu ứng mở hộp quà: âm thanh pop nảy vui tai + chimes
    playGiftPop() {
        this.ensureContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Âm pop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.18);

        // Chuỗi chuông ngân
        const chimes = [523.25, 659.25, 783.99, 1046.5];
        chimes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 0.6, "triangle");
            }, (idx + 1) * 70);
        });
    }

    // Hiệu ứng thổi nến: tiếng gió nhẹ 'phùùù'
    playBlowSound() {
        this.ensureContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const dur = 1.2;

        // Tạo tiếng ồn trắng (white noise) mô phỏng tiếng gió thổi
        const bufferSize = this.ctx.sampleRate * dur;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(350, now);
        filter.frequency.exponentialRampToValueAtTime(150, now + dur);
        filter.Q.setValueAtTime(2, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.exponentialRampToValueAtTime(0.4, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start(now);
        noise.stop(now + dur);
    }

    // Hiệu ứng pháo hoa / chúc mừng vui vẻ
    playCelebrationChime() {
        this.ensureContext();
        const chords = [523.25, 659.25, 783.99, 1046.5, 1318.5];
        chords.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 1.2, "sine");
            }, idx * 100);
        });
    }

    // Tiếng gõ bàn phím nhẹ nhàng cho typewriter
    playTypewriterKey() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        // random frequency xê dịch nhẹ cho tự nhiên
        const randFreq = 900 + Math.random() * 400;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(randFreq, now);

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.04);
    }

    // Hiệu ứng lật ảnh Polaroid
    playFlipSound() {
        this.ensureContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.15);
    }
}

window.romanticAudio = new RomanticAudioManager();
