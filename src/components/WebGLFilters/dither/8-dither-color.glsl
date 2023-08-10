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

const int dither_matrix_2x2[4] = int[](
   0,  3,  
   2,  1
);
const int dither_matrix_4x4[16] = int[](
   0,  8,  2,  10,
   12, 4,  14, 6,
   3,  11, 1,  9,
   15, 7,  13, 5
);
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
const int dither_newspaper_matrix[64] = int[](
  24, 10, 12, 26, 35, 47, 49, 37,
  8, 0, 2, 14, 45, 59, 61, 51,
  22, 6, 4, 16, 43, 57, 63, 53,
  30, 20, 18, 28, 33, 41, 55, 39,
  34, 46, 48, 36, 25, 11, 13, 27,
  44, 58, 60, 50, 9, 1, 3, 15,
  42, 56, 62, 52, 23, 7, 5, 17,
  32, 40, 54, 38, 31, 21, 19, 29
);
const int dither_matrix_5x3[15] = int[](
  9, 3, 0, 6, 12,
  10, 4, 1, 7, 13,
  11, 5, 2, 8, 14
  // 9, 10, 11,
  // 3, 4, 5, 
  // 0, 1, 2,
  // 6, 7, 8,
  // 12, 13, 14
);
const int dither_halftone[36] = int[](
  35, 30, 18, 22, 31, 36,  
  29, 15, 10, 17, 21, 32,
  14, 9, 5, 6, 16, 20,
  13, 4, 1, 2, 11, 19,
  28, 8, 3, 7, 24, 25,
  34, 27, 12, 23, 26, 33
);

// float dither_amount = 2.0;
// float dither_amount = 4.0;
// float dither_amount = 6.0;
float dither_amount = 8.0;

float dither(vec2 uv, float luma) {
  int x = int(mod(uv.x, dither_amount));
  int y = int(mod(uv.y, dither_amount));
  int index = x + y * int(dither_amount);
  float limit = 0.0;

  // if (dither_amount == 2.0) {
  //   limit = (float(dither_matrix_2x2[index]) + 1.0) / 4.0;
  // }
  // if (dither_amount == 4.0) {
  //   limit = (float(dither_matrix_4x4[index]) + 1.0) / 16.0;
  // }
  if (dither_amount == 8.0) {
    limit = (float(dither_matrix_8x8[index]) + 1.0) / (1.0 + 64.0);
  }
  // if (dither_amount == 8.0) {
  //   limit = (float(dither_newspaper_matrix[index]) + 1.0) / 64.0;
  // }
  // limit = (float(dither_matrix_5x3[index]) + 1.0) / 15.0;
  // limit = (float(dither_halftone[index]) + 1.0) / 36.0;

  return luma < limit ? 0.0 : 1.0;
}

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  vec4 texel = texture(u_image, uv);
  outColor = texel;
  // gradient sidebar
  // vec4 grad = vec4(uv.y, uv.y, uv.y, 1.0);
  // outColor = mix(grad, texel, step(uv.x, 0.90));

  // make image grayscale
  vec4 luma = vec4(0.299, 0.587, 0.114, 0);
  float grayscale = dot(outColor, luma);

  outColor = vec4(
    // vec3(dither(gl_FragCoord.xy, grayscale)),
    outColor.r * dither(gl_FragCoord.xy, grayscale),
    outColor.g * dither(gl_FragCoord.xy, grayscale),
    outColor.b * dither(gl_FragCoord.xy, grayscale),
    1.0
  );

  // vec4 lowcolor = vec4(0.141, 0.031, 0.318, 1.0);
  // vec4 highcolor = vec4(0.957, 0.239, 0.122, 1.0);
  // outColor = mix(lowcolor, highcolor, outColor);
}

