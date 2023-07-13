#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 outColor;

float random2d(vec2 coord){
  // return fract(sin(dot(coord.xy, vec2(17.9898, 78233))) * 43758.5453);
  return fract(sin(dot(coord.xy, vec2(17.9898, 78.233))) * 43758.5453);
}

void main() {
	// vec2 uv = gl_FragCoord.xy/u_resolution;
  vec2 coord = gl_FragCoord.xy * sin(0.06);
  vec3 color = vec3(0.0);

  float rand01 = fract(random2d(floor(coord)));

  outColor = vec4(rand01, 0.0, 0.0, 1.0);
}
