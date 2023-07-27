#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 outColor;

void main() {
	vec2 uv = gl_FragCoord.xy/u_resolution;
  outColor = vec4(sin(u_time), uv.y, 1.0, 1.0);
}
