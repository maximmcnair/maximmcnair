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

float dither2x2(vec2 uv, float luma) {
  float dither_amount = 2.0;
  int x = int(mod(uv.x, dither_amount));
  int y = int(mod(uv.y, dither_amount));
  int index = x + y * int(dither_amount);
  float limit = (float(dither_matrix_2x2[index]) + 1.0) / (1.0 + 4.0);
  return luma < limit ? 0.0 : 1.0;
}

float dither4x4(vec2 uv, float luma) {
  float dither_amount = 4.0;
  int x = int(mod(uv.x, dither_amount));
  int y = int(mod(uv.y, dither_amount));
  int index = x + y * int(dither_amount);
  float limit = (float(dither_matrix_4x4[index]) + 1.0) / (1.0 + 16.0);
  return luma < limit ? 0.0 : 1.0;
}

float dither8x8(vec2 uv, float luma) {
  float dither_amount = 8.0;
  int x = int(mod(uv.x, dither_amount));
  int y = int(mod(uv.y, dither_amount));
  int index = x + y * int(dither_amount);
  float limit = (float(dither_matrix_8x8[index]) + 1.0) / (1.0 + 64.0);
  return luma < limit ? 0.0 : 1.0;
}

float dither_newspaper(vec2 uv, float luma) {
  float dither_amount = 8.0;
  int x = int(mod(uv.x, dither_amount));
  int y = int(mod(uv.y, dither_amount));
  int index = x + y * int(dither_amount);
  float limit = 0.0;
  if (dither_amount == 8.0) {
    limit = (float(dither_newspaper_matrix[index]) + 1.0) / (1.0 + 64.0);
  }
  return luma < limit ? 0.0 : 1.0;
}

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  // vec4 texel = texture(u_image, uv);
  // outColor = texel;
  // map x coordinate to hue
  outColor = vec4(uv.x, uv.x, uv.x, 1.0);
  // make image grayscale
  vec4 luma = vec4(0.299, 0.587, 0.114, 0);
  float grayscale = dot(outColor, luma);
  // 
  if (uv.y < 0.2) {
    outColor = vec4(
      vec3(dither_newspaper(gl_FragCoord.xy, grayscale)),
      1.0
    );
  } else if (uv.y < 0.4) {
    outColor = vec4(
      vec3(dither8x8(gl_FragCoord.xy, grayscale)),
      1.0
    );
  } else if (uv.y < 0.6) {
    outColor = vec4(
      vec3(dither4x4(gl_FragCoord.xy, grayscale)),
      1.0
    );
  } else if (uv.y < 0.8) {
    outColor = vec4(
      vec3(dither2x2(gl_FragCoord.xy, grayscale)),
      1.0
    );
  }
}
