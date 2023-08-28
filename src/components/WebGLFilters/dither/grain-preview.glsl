#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform int u_mouse_over;
uniform float u_time;
uniform sampler2D u_image;
// Generic floats
uniform float u_fx;
uniform float u_fy;
uniform float u_fz;
uniform float u_fw;

out vec4 outColor;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 grain(vec4 fragColor, vec2 uv){
  vec4 color = fragColor;
  float diff = (rand(uv) - 0.0) * 0.3;
  color.r += diff;
  color.g += diff;
  color.b += diff;
  return color;
}

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  vec4 texel = texture(u_image, uv);
  outColor = texel;

  vec4 grain = grain(outColor, uv);
  if (u_mouse_over == 1) {
    outColor = mix(outColor, grain, min(u_mouse.x, 0.6));
  } else {
    outColor = mix(outColor, grain, 0.5);
  }
}

