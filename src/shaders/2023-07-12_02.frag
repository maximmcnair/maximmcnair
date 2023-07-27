#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 outColor;

float random2d(vec2 coord){
  return fract(sin(dot(coord.xy, vec2(129898, 78233))) * 43758.5453);
  // return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
	// vec2 uv = gl_FragCoord.xy/u_resolution;
  vec2 coord = gl_FragCoord.xy * 0.01;
  coord -= u_time + vec2(sin(coord.y), cos(coord.x));

  float rand01 = fract(random2d(coord) + u_time);
  float rand02 = fract(random2d(coord) + u_time);

  rand01 *= 0.4 - length(fract(coord * 2.3));

  outColor = vec4(rand01 * 4.0, rand02 * rand01 * 4.0, 0.0, 1.0);
}

