// js/countdown-screen.js
import { NightSkyBackground } from './night-sky-bg.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1) Fade the page in
  document.body.classList.add('fade-in');

  // 2) Start the Night Sky background on our <canvas>
  const bg = new NightSkyBackground('gameCanvas');
  bg.start();

  // 3) Countdown sequence
  const countdownText = document.getElementById('countdownText');
  const values = ['3', '2', '1'];
  let idx = 0;

  function tick() {
    countdownText.textContent = values[idx];
    // reset & trigger the CSS transition
    countdownText.classList.remove('show-count');
    void countdownText.offsetWidth;
    countdownText.classList.add('show-count');

    idx++;
    if (idx < values.length) {
      setTimeout(tick, 1000);
    } else {
      // after “GO!”, fade-out then proceed
      setTimeout(() => {
        document.body.classList.replace('fade-in', 'fade-out');
        setTimeout(() => {
          window.location.href = '../html/game-screen.html';
        }, 500);
      }, 1000);
    }
  }

  // small initial delay before starting
  setTimeout(tick, 100);
});
