// #version 300 es
precision mediump float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 matrix;

varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = matrix * vec4(position, 1);
  // gl_Position = projection * view * model * position; 
}
