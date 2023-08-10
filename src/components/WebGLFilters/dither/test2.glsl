#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_image;

out vec4 outColor;

// 8x8 dither
// const int[64] dithertable_8x8 = int[](
//    0, 32, 8, 40, 2, 34, 10, 42,
//   48, 16, 56, 24, 50, 18, 58, 26,
//   12, 44, 4, 36, 14, 46, 6, 38,
//   60, 28, 52, 20, 62, 30, 54, 22, 
//    3, 35, 11, 43, 1, 33, 9, 41,
//   51, 19, 59, 27, 49, 17, 57, 25,
//   15, 47, 7, 39, 13, 45, 5, 37,
//   63, 31, 55, 23, 61, 29, 53, 21
// );

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

float luma(vec4 color) {
  return dot(color.rgb, vec3(0.299, 0.587, 0.114));
}

float dither4x4(vec2 position, float brightness) {
  int x = int(mod(position.x, 4.0));
  int y = int(mod(position.y, 4.0));
  int index = x + y * 4;
  float limit = 0.0;

  if (x < 8) {
    if (index == 0) limit = 0.0625;
    if (index == 1) limit = 0.5625;
    if (index == 2) limit = 0.1875;
    if (index == 3) limit = 0.6875;
    if (index == 4) limit = 0.8125;
    if (index == 5) limit = 0.3125;
    if (index == 6) limit = 0.9375;
    if (index == 7) limit = 0.4375;
    if (index == 8) limit = 0.25;
    if (index == 9) limit = 0.75;
    if (index == 10) limit = 0.125;
    if (index == 11) limit = 0.625;
    if (index == 12) limit = 1.0;
    if (index == 13) limit = 0.5;
    if (index == 14) limit = 0.875;
    if (index == 15) limit = 0.375;
  }

  return brightness < limit ? 0.0 : 1.0;
}

// vec3 dither4x4(vec2 position, vec3 color) {
//   return color * dither4x4(position, luma(color));
// }

vec4 dither4x4(vec2 position, vec4 color) {
  return vec4(color.rgb * dither4x4(position, luma(color)), 1.0);
}

void main() {
	vec2 uv = gl_FragCoord.xy/u_resolution;
	// vec2 uv = gl_FragCoord.xy;
  vec4 texel = texture(u_image, uv);

  outColor = dither4x4(uv, texel);
  // outColor = texel; 
}
