// main-menu-ui.js

import { NightSkyBackground } from './night-sky-bg.js';
import { startMainMenuSong, stopMainMenuSong, audioCtx } from './main-menu-song.js';

document.addEventListener('DOMContentLoaded', () => {
  // fade in
  document.body.classList.add('fade-in');

  // start Night Sky background
  const bg = new NightSkyBackground('night-sky-canvas');
  bg.start();

  // **IMPORTANT CHANGE**: Do NOT call startMainMenuSong() here.
  // The music will only start once the user clicks the mute icon.

  // setup mute/unmute icon (which now controls starting/stopping the audio)
  setupMuteIcon();

  // initialize screens (Show/hide different panels)
  initScreenNavigation();
});

function setupMuteIcon() {
  const canvas = document.getElementById('muteIcon');
  const ctx    = canvas.getContext('2d');

  // We start in “muted” state. Only when the user clicks do we start audio.
  let isMuted = true;

  // Draw the speaker icon (with an X overlay if isMuted)
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = isMuted ? 'rgba(255,255,255,0.2)' : 'white';
    // draw the note shape
    ctx.fillRect(7, 4, 21, 7);
    ctx.fillRect(7, 8, 3, 16);
    ctx.fillRect(25, 8, 3, 16);
    ctx.fillRect(0, 20, 8, 8);
    ctx.fillRect(18, 20, 8, 8);
    // draw the “X” if still muted
    if (isMuted) {
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      for (let o = 0; o <= 28; o += 4) {
        ctx.fillRect(o, o, 4, 4);
      }
    }
  }

  canvas.addEventListener('click', () => {
    if (isMuted) {
      // User clicked to unmute → Start or resume audio and then start the menu song
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().then(startMainMenuSong);
      } else {
        // If audioCtx was never created, startMainMenuSong() will create it
        startMainMenuSong();
      }
    } else {
      // User clicked to mute → stop the menu song
      stopMainMenuSong();
    }
    isMuted = !isMuted;
    draw();
  });

  // Initial draw shows the “X” (muted) icon
  draw();
}

function initScreenNavigation() {
  const screens = document.querySelectorAll('.screen');
  const show    = id => {
    screens.forEach(s => {
      s.classList.toggle('active', s.id === id);
    });
  };

  // Expose globals so your inline onclicks (in HTML) still work
  window.showScreen         = show;
  window.returnToMenu       = () => show('mainMenuScreen');
  window.startGameSequence  = () => {
    stopMainMenuSong();
    document.body.classList.replace('fade-in', 'fade-out');
    setTimeout(() => {
      window.location.href = './countdown-screen.html';
    }, 500);
  };

  // Start on main menu
  show('mainMenuScreen');
}
