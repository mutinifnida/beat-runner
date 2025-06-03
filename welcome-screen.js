// welcome.js
// Handles fade in → hold → fade out → redirect to Main Menu

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('welcome-container');

  const fadeInDuration  = 1000;  // ms
  const displayDuration = 3000;  // ms (fully visible)
  const fadeOutDuration = 1000;  // ms

  // 1) Fade in
  container.classList.add('fade-in');

  // 2) After fade-in + display, start fade-out
  setTimeout(() => {
    container.classList.replace('fade-in', 'fade-out');

    // 3) Once faded out, navigate to the Main Menu
    setTimeout(() => {
      window.location.href = './disclaimer.html';
    }, fadeOutDuration);

  }, fadeInDuration + displayDuration);
});
