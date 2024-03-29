#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_image;
// Generic floats
uniform float u_fx;
uniform float u_fy;
uniform float u_fz;

out vec4 outColor;

float threshold(float color) {
  if (color > u_fx) {
    return 1.0;
  }
  return 0.0;
}

vec3 hsb2rgb(vec3 c){
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  vec4 texel = texture(u_image, uv);
  // gradient sidebar
  // vec4 grad = vec4(uv.y, uv.y, uv.y, 1.0);
  vec4 grad = vec4(hsb2rgb(vec3(uv.y, 1.0, 1.0)), 1.0);
  outColor = mix(grad, texel, step(uv.x, 0.90));
}

