import { useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

class Particle {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    hue?: number
  ) {
    this.ctx = ctx;
    this.x = x || 0;
    this.y = y || 0;
    this.size = Math.random() * 10 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    // this.color = `hsl(${hue}, 100%, 50%)`;
    this.color = 'rgba(350,350,350,1)';
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // reduce size of particles each animation frame
    if (this.size > 0.2) this.size -= 0.1;
    // if (this.size > 0.2) this.size -= 0.1;
  }

  draw() {
    const ctx = this.ctx;
    // ctx.fillStyle = 'blue';
    ctx.fillStyle = this.color;
    // ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    // ctx.stroke();
  }
}

function canvasAnimation(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  const particles: Particle[] = [];
  let hue = 0;

  // set height&width of canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  let mousePos: Position | undefined = undefined;

  canvas.addEventListener('mousemove', (evt) => {
    mousePos = { x: evt.x, y: evt.y };

    const particleAmount = 3;
    for (let i = 0; i < particleAmount; i++) {
      particles.push(new Particle(ctx, mousePos.x, mousePos.y, hue));
    }
  });

  // canvas.addEventListener('click', (evt) => {
  //   mousePos = {x: evt.x, y: evt.y}
  //
  //   const particleAmount = 10;
  //   for (let i = 0; i < particleAmount; i++){
  //     particles.push(new Particle(ctx, mousePos.x, mousePos.y))
  //   }
  // });

  function handleParticles() {
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // constellation effect
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.beginPath();
          ctx.strokeStyle = particles[i].color;
          // ctx.lineWidth = particles[i].size / 10;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.closePath();
        }
      }

      if (particles[i].size <= 0.3) {
        particles.splice(i, 1);
        i--;
      }
    }
  }

  function init() {
    const particleAmount = 300;
    for (let i = 0; i < particleAmount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push(new Particle(ctx, x, y));
    }
  }
  init();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    handleParticles();

    const hueSpeed = 3;
    hue += hueSpeed;

    // trigger next animate frame
    requestAnimationFrame(animate);
  }

  animate();
}

export default function Particles() {
  useEffect(() => {
    const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvasAnimation(canvas, ctx);
  });

  return <canvas id="canvas" className="canvas" />;
}
