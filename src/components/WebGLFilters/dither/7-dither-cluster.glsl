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

float dither_amount = 8.0;

float dither(vec2 uv, float luma) {
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
  vec4 texel = texture(u_image, uv);
  // gradient sidebar
  vec4 grad = vec4(uv.y, uv.y, uv.y, 1.0);
  outColor = mix(grad, texel, step(uv.x, 0.90));

  // make image grayscale
  vec4 luma = vec4(0.299, 0.587, 0.114, 0);
  float grayscale = dot(outColor, luma);

  outColor = vec4(
    vec3(dither(gl_FragCoord.xy, grayscale)),
    1.0
  );

  // vec4 lowcolor = vec4(0.141, 0.031, 0.318, 1.0);
  // vec4 highcolor = vec4(0.957, 0.239, 0.122, 1.0);
  // outColor = mix(lowcolor, highcolor, outColor);
}

