// js/night‐sky‐bg.js

/**
 * The same NightSkyBackground class you already had.
 * It exports exactly one class: NightSkyBackground(canvasId).
 * When you call .start(), it does:
 *  - Listen for resize (calls _onResize internally)
 *  - Populate stars & clouds arrays
 *  - Kick off the requestAnimationFrame loop
 */

export class NightSkyBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas with id "${canvasId}" not found.`);
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.clouds = [];
    this._resizeHandler = this._onResize.bind(this);
    this._animateFrame = this._animate.bind(this);
  }

  start() {
    window.addEventListener('resize', this._resizeHandler);
    this._onResize();
    this._initStarsAndClouds();
    this._animate();
  }

  stop() {
    window.removeEventListener('resize', this._resizeHandler);
    cancelAnimationFrame(this._rafId);
  }

  _randomStarColor() {
    const [r1, g1, b1] = [255, 230, 105];
    const [r2, g2, b2] = [255, 255, 255];
    const t = Math.random();
    return {
      r: Math.floor(r1 + (r2 - r1) * t),
      g: Math.floor(g1 + (g2 - g1) * t),
      b: Math.floor(b1 + (b2 - b1) * t),
    };
  }
  _randomCloudColor() { 
    const [r1, g1, b1] = [68, 43, 112];
    const [r2, g2, b2] = [73, 119, 215];
    const t = Math.random();
    return {
      r: Math.floor(r1 + (r2 - r1) * t),
      g: Math.floor(g1 + (g2 - g1) * t),
      b: Math.floor(b1 + (b2 - b1) * t),
    };
  }

  _initStarsAndClouds() {
    this.stars.length = 0;
    this.clouds.length = 0;

    class Star {
      constructor(ctx, width, height, getColor) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.color = getColor();
        this.reset();
      }
      reset() {
        this.x = Math.random() * this.width;
        this.y = Math.random() * this.height;
        this.size = Math.random() * (2.5 - 0.5) + 0.5;
        this.baseOpacity = Math.random() * (1 - 0.6) + 0.6;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = Math.random() * (0.03 - 0.01) + 0.01;
        this.amp = 0.9;
      }
      update() {
        this.phase += this.speed;
      }
      draw() {
        const o = Math.max(0, Math.min(1, this.baseOpacity + Math.sin(this.phase) * this.amp));
        this.ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${o})`;
        this.ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
      }
    }

    class Cloud {
      constructor(ctx, width, height, getColor) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.scale = 0.1 + Math.random() * 0.3;
        this.opacity = Math.random() * 0.7 + 0.1;
        this.speed = (Math.random() * 0.05 + 0.01) * (Math.random() < 0.5 ? -1 : 1);
        this.color = getColor();
        const baseDx = [-190, -150, -110, -70, -30, 10, 60, 100, 140, 70, 30, -10, -50];
        const baseDy = [10, -15, 0, -20, -20, -5, 10, 5, 5, 25, 30, 35, 35];
        const baseSz = [70, 85, 100, 120, 120, 90, 70, 60, 60, 60, 50, 50, 50];
        this.sq = baseDx.map((dx, i) => ({
          dx: dx + (Math.random() * 40 - 20),
          dy: baseDy[i] + (Math.random() * 20 - 10),
          size: baseSz[i] + (Math.random() * 20 - 10),
        }));
      }
      update() {
        this.x += this.speed;
        if (this.x > this.width + 200) this.x = -200;
        if (this.x < -200) this.x = this.width + 200;
      }
      draw() {
        this.ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
        this.sq.forEach((s) => {
          this.ctx.fillRect(
            this.x + s.dx * this.scale - (s.size * this.scale) / 2,
            this.y + s.dy * this.scale - (s.size * this.scale) / 2,
            s.size * this.scale,
            s.size * this.scale
          );
        });
      }
    }

    // create instances
    for (let i = 0; i < 200; i++) this.stars.push(new Star(this.ctx, this.canvas.width, this.canvas.height, () => this._randomStarColor()));
    const cloudCount = Math.floor(Math.random() * 4) + 3;
    for (let i = 0; i < cloudCount; i++) this.clouds.push(new Cloud(this.ctx, this.canvas.width, this.canvas.height, () => this._randomCloudColor()));
  }

  _drawBackgroundGradient() {
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    grad.addColorStop(0, 'rgb(7, 7, 7)');
    grad.addColorStop(0.5, 'rgb(4, 22, 37)');
    grad.addColorStop(0.7, 'rgb(13, 63, 81)');
    grad.addColorStop(1, 'rgb(196, 116, 98)');
    // grad.addColorStop(0, 'rgb(7,7,7)');
    // grad.addColorStop(1, 'rgb(4,22,37)');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  _updateAndDraw() {
    this._drawBackgroundGradient();
    this.clouds.forEach((c) => {
      c.draw();
      c.update();
    });
    this.stars.forEach((s) => {
      s.draw();
      s.update();
    });
  }

  _animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._updateAndDraw();
    this._rafId = requestAnimationFrame(this._animateFrame);
  }

  _onResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this._initStarsAndClouds();
  }
}

//Reminder: night‐sky‐bg.js must be in js/ (the same folder as game‐screen.js)
// so that import { NightSkyBackground } from './night‐sky‐bg.js' works correctly.