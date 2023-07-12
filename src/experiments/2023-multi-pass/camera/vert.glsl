#version 300 es
precision highp float;

uniform mat4 matrix;

in vec3 position;
in vec2 uv;

out vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = matrix * vec4(position, 1);
  // gl_Position = vec4(position, 1);
  // gl_Position = projection * view * model * position; 
}

