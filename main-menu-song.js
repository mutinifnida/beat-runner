let startAudioCtx;
let startSynth;
let startIntervalId;
let startGain;

// =================================================================
//   A four-layer procedural soundtrack for the Main Menu
// =================================================================

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
let padIntervalId;
let bassIntervalId;
let arpIntervalId;
let beatIntervalId;
let startTime; 
const swingAmount = 0.06; // 6% swing

// — Ambient pad — 
function startAmbientPad() {
  const padFreqs = [130.81, 164.81, 196];
  padFreqs.forEach(freq => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'highpass';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.005, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 5);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 140);
  });
}

// — Bassline — 
function startBassline() {
  const bassNotes = [87.31, 73.42, 82.41, 65.41, 73.42, 82.41, 73.42 ];
  let idx = 0;
  function playBassNote(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(bassNotes[idx % bassNotes.length], time);
    gain.gain.setValueAtTime(0.03, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 1.2);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 1.2);
    idx++;
  }
  padIntervalId = setInterval(() => {
    playBassNote(audioCtx.currentTime);
  }, 1400);
}

// — Arpeggio — 
function startMelodicArp() {
  const arpNotes = [261.63, 329.63, 392.00, 523.25, 329.63, 392.00, 329.63];
  let idx = 0;
  arpIntervalId = setInterval(() => {
    const time = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'highpass';
    osc.frequency.setValueAtTime(arpNotes[idx % arpNotes.length], time);
    gain.gain.setValueAtTime(0.03, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(time + 5);
    idx++;
  }, 1400);
}

// — Drum beat — 
function startBackgroundBeat() {
  startTime = audioCtx.currentTime + 0.01;
  const interval = 1.4;
  function playKick(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, time);
    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.25);
  }
  function playSnare(time) {
    const noise = audioCtx.createBufferSource();
    const bufferSize = audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1800, time);
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    noise.connect(filter).connect(gain).connect(audioCtx.destination);
    noise.start(time);
    noise.stop(time + 0.1);
  }
  function playHiHat(time) {
    const noise = audioCtx.createBufferSource();
    const bufferSize = audioCtx.sampleRate * 0.02;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(9000, time);
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.02);
    noise.connect(filter).connect(gain).connect(audioCtx.destination);
    noise.start(time);
    noise.stop(time + 0.02);
  }
  beatIntervalId = setInterval(() => {
    playKick(startTime);
          //  playKick(startTime + interval/2);
       playKick(startTime + interval/4);
      //  playKick(startTime + interval/6);
    playHiHat(startTime + interval/8 + swingAmount);
    playSnare(startTime + interval/2);
    playKick(startTime);
    playHiHat(startTime + interval/8);
    playSnare(startTime + interval/2);
    playHiHat(startTime + (3*interval)/8 + swingAmount);
    playKick(startTime + (5*interval)/8);
    playHiHat(startTime + (6*interval)/8);
    playSnare(startTime + (7*interval)/8);
    playHiHat(startTime + (9*interval)/8 + swingAmount);
    startTime += interval;
  }, interval * 210);
}

// — Public API — 
export function startMainMenuSong() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  // avoid restarting if already running
  if (padIntervalId) return;

  startAmbientPad();
  padIntervalId = setInterval(startAmbientPad, 30000);
  
  startBassline();
  startMelodicArp();
  startBackgroundBeat();
}

export function stopMainMenuSong() {
  if (padIntervalId)   clearInterval(padIntervalId);
    padIntervalId = null; 
  if (bassIntervalId)  clearInterval(bassIntervalId);
    bassIntervalId = null;
  if (arpIntervalId)   clearInterval(arpIntervalId);

  if (beatIntervalId)  clearInterval(beatIntervalId);
    arpIntervalId = null;
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
}
export { audioCtx };