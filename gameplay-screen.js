// gameplay-screen.js - Entry point of gameplay
import {
  stars, clouds, drawBackgroundGradient, Star, Cloud
} from './animated-scene.js';

import {
  startAmbientPad, startBassline, startMelodicArp, startBackgroundBeat,
  playNoteForGlyph, playMissClickSound
} from './game-song.js';

// import {
//   score, comboMultiplier, gameTimer,
//   updateCombo, formatTimer,
//   triggerGameOver, updateMuteButtonPosition
// } from './game-util-ui.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Placeholder for setup and loop
function animate() { requestAnimationFrame(animate); }

resizeCanvas();
startAmbientPad(audioCtx);
startBassline(audioCtx);
startMelodicArp(audioCtx);
startBackgroundBeat(audioCtx);
updateMuteButtonPosition();
animate();

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
