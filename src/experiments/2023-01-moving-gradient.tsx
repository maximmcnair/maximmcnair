import { useEffect } from 'react';

const PI2 = Math.PI * 2;

interface Rgb {
  r: number;
  g: number;
  b: number;
}

class GlowParticle {
  x: number;
  y: number;
  vy: number;
  vx: number;
  radius: number;
  rgb: Rgb;
  sinValue: number;

  constructor(x: number, y: number, radius: number, rgb: Rgb) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.rgb = rgb;

    this.vy = Math.random() * 4;
    this.vx = Math.random() * 4;

    this.sinValue = Math.random();
  }

  animate(
    ctx: CanvasRenderingContext2D,
    stageWidth: number,
    stageHeight: number
  ) {
    this.sinValue += 0.01;
    this.radius += Math.sin(this.sinValue);

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) {
      this.vx *= -1;
      this.x += 10;
    } else if (this.x > stageWidth) {
      this.vx *= -1;
      this.x -= 10;
    }

    if (this.y < 0) {
      this.vy *= -1;
      this.y += 10;
    } else if (this.y > stageHeight) {
      this.vy *= -1;
      this.y -= 10;
    }

    ctx.beginPath();
    const g = ctx.createRadialGradient(
      this.x,
      this.y,
      this.radius * 0.01,
      this.x,
      this.y,
      this.radius
    );
    g.addColorStop(0, `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, 1)`);
    g.addColorStop(1, `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, 0)`);
    ctx.fillStyle = g;
    // ctx.fillStyle = `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, 1)`;
    ctx.arc(this.x, this.y, this.radius, 0, PI2, false);
    ctx.fill();
  }
}

const colors = [
  { r: 255, g: 190, b: 11 },
  { r: 251, g: 86, b: 7 },
  { r: 255, g: 0, b: 110 },
  { r: 131, g: 56, b: 236 },
  { r: 58, g: 134, b: 255 }

  // pastels
  // {r: 255, g: 214, b: 255},
  // {r: 231, g: 198, b: 255},
  // {r: 200, g: 182, b: 255},
  // {r: 184, g: 192, b: 255},
  // {r: 187, g: 208, b: 255},
];

function canvasAnimation(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  // set height&width of canvas
  let width = window.innerWidth;
  let height = window.innerHeight;

  window.addEventListener('resize', onResize);
  // TODO handle removal?

  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // if (window.devicePixelRatio > 1) {
    //   canvas.width = canvas.clientWidth * 2;
    //   canvas.height = canvas.clientHeight * 2;
    //   ctx.scale(2, 2);
    // } else {
    //   canvas.width = canvas.offsetWidth;
    //   canvas.height = canvas.offsetHeight;
    // }

    ctx.globalCompositeOperation = 'saturation';
  }

  onResize();

  let totalParticles = 30;
  let particles: GlowParticle[] = [];
  let maxRadius = 400;
  let minRadius = 300;

  function createParticles() {
    let curColor = 0;
    particles = [];

    for (let i = 0; i < totalParticles; i++) {
      const item = new GlowParticle(
        Math.random() * width,
        Math.random() * height,
        Math.random() * (maxRadius - minRadius) + minRadius,
        colors[curColor]
      );

      if (++curColor >= colors.length) {
        curColor = 0;
      }

      particles.push(item);
    }
  }

  createParticles();

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (let particle of particles) {
      particle.animate(ctx, width, height);
    }

    // Request the browser the call render once its ready for a new frame
    window.requestAnimationFrame(render);
  }

  render();
}

export default function MovingGradient() {
  useEffect(() => {
    const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvasAnimation(canvas, ctx);
  });

  return <canvas id="canvas" className="canvas" />;
}
