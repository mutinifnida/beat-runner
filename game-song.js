// game-song.js
// =================================================================
//   All your “beat soundtrack” logic lives here.
// =================================================================

const AudioContext = window.AudioContext || window.webkitAudioContext;
export const audioCtx = new AudioContext();

// — Ambient pad — 
function startAmbientPad() {
  const padFreqs = [196, 146.83]; //G3, D3
  padFreqs.forEach(freq => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 2);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 4);
  });
}

// — Bassline —
function startBassline() {
  const bassNotes = [98, 116.54, 130.81, 146.83]; // G2, A#2, C3, D3
  let bassIndex = 0;

  function playBassNote(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangule';
    osc.frequency.setValueAtTime(bassNotes[bassIndex % bassNotes.length], time);
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 1.2);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 4);
    bassIndex++;
  }

  let startTime = audioCtx.currentTime + 0.1;
  const interval = 1.4;
  setInterval(() => {
    playBassNote(startTime);
    startTime += interval;
  }, interval * 650);
}

// — Arpeggio —
function startMelodicArp() {
  const arpNotes = [392, 349.22, 329.62, 293.66, 349.22, 329.62, 392, 349.22, 329.62, 293.66, 349.22]; // G4, F4, E4, D4
  let idx = 0;
  setInterval(() => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'highpass';
    osc.frequency.setValueAtTime(arpNotes[idx % arpNotes.length], audioCtx.currentTime);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
    idx++;
  }, 700);
}

// — Drum beat —
function startBackgroundBeat() {
  const swing = 0.06; // 6% swing
  let startTime = audioCtx.currentTime + 0.1;
  const interval = 1.4;

  function playKick(time) { 
    // Low sine wave body
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.001, time + 0.25);
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.25);

    // Mid-tone thump transient
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(300, time);
    gain2.gain.setValueAtTime(0.3, time);
    gain2.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    osc2.connect(gain2).connect(audioCtx.destination);
    osc2.start(time);
    osc2.stop(time + 0.05);

    // Noise transient - softened
    const noise = audioCtx.createBufferSource();
    const bufferSize = audioCtx.sampleRate * 0.02;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;

    const bandpass = audioCtx.createBiquadFilter();
    bandpass.type = 'highpass';
    bandpass.frequency.setValueAtTime(300, time); // Softer tone

    const gain3 = audioCtx.createGain();
    gain3.gain.setValueAtTime(0.15, time); // Softer click
    gain3.gain.exponentialRampToValueAtTime(0.001, time + 0.05); // Longer fade

    noise.connect(bandpass).connect(gain3).connect(audioCtx.destination);
    noise.start(time);
    noise.stop(time + 0.05);
   }

  function playSnare(time) {
    const noise = audioCtx.createBufferSource();
    const bufferSize = audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1800, time);
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    noise.connect(noiseFilter).connect(gain).connect(audioCtx.destination);
    noise.start(time);
    noise.stop(time + 0.1);
  }
  function playHiHat(time) {
    const noise = audioCtx.createBufferSource();
    const bufferSize = audioCtx.sampleRate * 0.02;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;
    const bandpass = audioCtx.createBiquadFilter();
    bandpass.type = 'highpass';
    bandpass.frequency.setValueAtTime(9000, time);
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.02);
    noise.connect(bandpass).connect(gain).connect(audioCtx.destination);
    noise.start(time);
    noise.stop(time + 0.02);
  }

  setInterval(() => {
    playKick(startTime);
    playHiHat(startTime + interval/8);
    playSnare(startTime + interval/2);
    playHiHat(startTime + (3*interval)/8 + swing);
    playKick(startTime + (5*interval)/8);

    playHiHat(startTime + (6*interval)/8);
    playSnare(startTime + (7*interval)/8);
    playHiHat(startTime + (9*interval)/8 + swing);
    // playSnare(startTime + (interval/4) + swing/2);

    startTime += interval;
  }, interval * 1000);
}

// — Initialization entry point — 
export function initGameSong() {
  startAmbientPad();
  setInterval(startAmbientPad, 3000);
  startBassline();
  startMelodicArp();
  startBackgroundBeat();
}

// expose to window as soon as module loads
if (typeof window !== 'undefined') {
  window.initGameSong = initGameSong;
  window.audioCtx     = audioCtx;
}
