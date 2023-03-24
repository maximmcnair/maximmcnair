import { useEffect, useRef } from 'react';

// p5 style map function
function map(val: number, start1: number, stop1: number, start2: number, stop2: number, withinBounds?: number) {
  const newval = (val - start1) / (stop1 - start1) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return constrain(newval, start2, stop2);
  } else {
    return constrain(newval, stop2, start2);
  }
}

function constrain(val: number, low: number, high: number){
  return Math.max(Math.min(val, high), low);
}

function getRandomInt(min: number, max: number): number {
  const minInt = Math.ceil(min);
  const maxInt = Math.floor(max);
  return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}

class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number){
    this.x = x || 0;
    this.y = y || 0;
  }

  add(vec: Vector) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  sub(vec: Vector) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }

  mult(n: number) {
    this.x *= n;
    this.y *= n;
    return this;
  }

  div(n: number) {
    this.x /= n;
    this.y /= n;
    return this;
  }

  getMag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  setMag(m: number) {
    const angle = this.getAngle();
    this.x = Math.cos(angle) * m;
    this.y = Math.cos(angle) * m;
  }

  getMagSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  getAngle(): number {
    return Math.atan2(this.y, this.x);
  }

  heading(){
    return Math.atan2(this.y, this.x);
  }

  normalize() {
    let m = this.getMag();
    if (m > 0) {
      this.div(m);
    }
  }

  limit(limit: number) {
    if (this.getMag() > limit) {
      const mSq = this.getMagSq();
      if (mSq > limit * limit) {
        this.div(Math.sqrt(mSq));
        this.mult(limit);
      }
    }
  }

  dup(): Vector {
    return new Vector(this.x, this.y);
  }

  dist(vec: Vector): number{
    const dx = vec.x - this.x;
    const dy = vec.y - this.y;
    return Math.hypot(dx, dy)
  }
}

class Boid {
  position: Vector;
  velocity: Vector;
  acceleration: Vector;
  maxspeed: number;
  maxforce: number;
  r: number;

  constructor(x: number, y: number, maxspeed: number, maxforce: number){
    this.position = new Vector(x, y);
    this.velocity = new Vector(
      getRandomInt(-1, 1), getRandomInt(-1, 1)
    );
    this.acceleration = new Vector(0, 0);
    this.r = 3;
    this.maxspeed = maxspeed;
    this.maxforce = maxforce;
  }

  update(){
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0)
  }

  applyForce(force: Vector){
    this.acceleration.add(force);
  }

  flock(boids: Boid[]) {
    const seperate = this.seperate(boids);
    const alignment = this.alignment(boids);
    const cohesion = this.cohesion(boids);

    // weight behaviour
    seperate.mult(1.5);
    alignment.mult(1);
    cohesion.mult(1);

    this.applyForce(seperate);
    this.applyForce(alignment);
    this.applyForce(cohesion);
  }

  cohesion(boids: Boid[]) {
    let neighborDist = 80;
    let sum = new Vector(0, 0);
    let count = 0;

    for (let other of boids) {
      const d = this.position.dup().dist(other.position);
      if (this !== other && d > 0 && d < neighborDist) {
        sum.add(other.position);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    }
    return sum;
  }

  alignment(boids: Boid[]) {
    let neighborDist = 80;
    let steer = new Vector(0, 0);
    let count = 0;

    for (let other of boids) {
      let d = this.position.dup().dist(other.position);
      if (this !== other && d > 0 && d < neighborDist) {
        steer.add(other.velocity);
        count++;
      }
    }

    if (count <= 0) return steer;

    steer.div(count);
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }

  seek(target: Vector) {
    const steer = target.dup().sub(this.position);
    steer.normalize();
    steer.mult(this.maxspeed)
    steer.sub(this.velocity)
    steer.limit(this.maxforce)
    return steer;
  }

  seperate(boids: Boid[]): Vector {
    // desired velocity = average of all fleeing desired velocites
    const desiredSeparation = 45;
    let steer = new Vector(0, 0);
    let count = 0;

    for (let other of boids) {
      let d = this.position.dup().dist(other.position);
      if (this != other && d < desiredSeparation) {
        let diff = this.position.dup().sub(other.position);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }

    if (count > 0) {
      steer.div(count);
    }

    if (steer.getMag() > 0) {
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }

    return steer;
  }

  boundaries() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  }
}

export default function FlockingBoids() {
  const refCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // set height&width of canvas
    let width = window.innerWidth;
    let height = window.innerHeight;

    // TODO handle removal?
    window.addEventListener('resize', onResize);

    function onResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (!canvas) return;
      canvas.width = width;
      canvas.height = height;
    }

    onResize();

    // scene constants
    const BOID_AMOUNT = 200;
    // const BOID_RADIUS = 5;

    // setup scene
    const boids: Boid[] = []
    for (let i = 0; i < BOID_AMOUNT; i++) {
      boids.push(new Boid(
        getRandomInt(0, width),
        getRandomInt(0, height),
        3,
        0.05,
      ))
    }


    function render(ctx: CanvasRenderingContext2D){
      ctx.save();
      ctx.clearRect(0, 0, width, height);

      for (let boid of boids){
        boid.flock(boids);
        boid.boundaries();
        boid.update();

        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.stroke()

        const {x, y} = boid.position;

        // ctx.arc(x, y, 6, 0, 2 * Math.PI)

        let angle = boid.velocity.getAngle();
        var headlen = 15;

        ctx.moveTo(x, y);
        ctx.lineTo(x-headlen*Math.cos(angle-Math.PI/7),
                   y-headlen*Math.sin(angle-Math.PI/7));
        ctx.lineTo(x-headlen*Math.cos(angle+Math.PI/7),
                   y-headlen*Math.sin(angle+Math.PI/7));
        ctx.lineTo(x, y);
        ctx.lineTo(x-headlen*Math.cos(angle-Math.PI/7),
                   y-headlen*Math.sin(angle-Math.PI/7));

        ctx.fill();
        ctx.closePath();
      }
      ctx.restore();

      animationRender = window.requestAnimationFrame(() => render(ctx));
    }

    let animationRender = window.requestAnimationFrame(() => render(ctx));
    return () => window.cancelAnimationFrame(animationRender)
  });

  return <canvas id="canvas" className="canvas" ref={refCanvas} />;
}

