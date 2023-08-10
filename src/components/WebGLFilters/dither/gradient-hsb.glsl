#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_image;

// Generic floats
uniform float u_fx;
uniform float u_fy;
uniform float u_fz;
uniform float u_fw;

out vec4 outColor;

vec3 hsb2rgb(vec3 c){
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  // map x coordinate to hue
  outColor = vec4(hsb2rgb(vec3(uv.x, 1.0, 1.0)), 1.0);
}
