function clamp(num, min, max) {
  return Math.max(min, Math.min(num, max));
}

function setup() {
  const canvas = createCanvas(800, 400, WEBGL);
  canvas.parent("canvas-art");
}

function draw() {
  background("#0d0d0d");
  // background("red");
  noFill();
  // stroke("#4d4d4d");
  stroke("#1d1f20");
  strokeWeight(3);
  push();
  translate(0, 0);
  rotateY(radians(frameCount / 4));
  // shouldn't map handle this clamp??
  var detail = clamp(int(map(mouseX, 0, width, 2, 10)), 3, 10);
  sphere(150, detail, detail);
  pop();
  fill(255);
  // ellipse(mouseX,mouseY,40,40);
}
