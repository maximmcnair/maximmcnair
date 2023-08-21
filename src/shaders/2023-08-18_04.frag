#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

out vec4 outColor;

// Generic floats
uniform float u_fx;
uniform float u_fy;
uniform float u_fz;
uniform float u_fw;

const int dither_matrix_8x8[64] = int[](
   0, 32, 8, 40, 2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44, 4, 36, 14, 46, 6, 38,
  60, 28, 52, 20, 62, 30, 54, 22, 
   3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37,
  63, 31, 55, 23, 61, 29, 53, 21
);

float dither_amount = 8.0;

float dither(vec2 uv, float luma) {
  int x = int(mod(uv.x, dither_amount));
  int y = int(mod(uv.y, dither_amount));
  int index = x + y * int(dither_amount);
  float limit = (float(dither_matrix_8x8[index]) + 1.0) / (1.0 + 64.0);
  return luma < limit ? 0.0 : 1.0;
}

void main() {
	vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;

  float radius = 0.001;
  vec2 position = vec2(
    (sin(u_time) / 2.0) + 0.2,
    (cos(u_time) / 2.0) + 0.1
  );
  vec4 circle_1 = vec4(radius - length(position - uv), 0, 1, 1);
  vec4 circle_2 = vec4(radius - length(position.yx - uv), 0, 1, 1);

	outColor = circle_1 * circle_2;

  // // make image grayscale
  // vec4 luma = vec4(0.299, 0.587, 0.114, 0);
  // float grayscale = dot(outColor, luma);
  //
  // outColor = vec4(
  //   vec3(dither(gl_FragCoord.xy, grayscale)),
  //   1.0
  // );
  //
  // vec4 lowcolor = vec4(0.141, 0.031, 0.318, 1.0);
  // vec4 highcolor = vec4(0.957, 0.239, 0.122, 1.0);
  // outColor = mix(lowcolor, highcolor, outColor);
}

