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

const int dither_matrix_4x4[16] = int[](
   0,  8,  2,  10,
   12, 4,  14, 6,
   3,  11, 1,  9,
   15, 7,  13, 5
);

float dither_amount = 4.0;

float dither(vec2 uv, float luma) {
  int x = int(mod(uv.x, dither_amount));
  int y = int(mod(uv.y, dither_amount));
  int index = x + y * int(dither_amount);
  float limit = (float(dither_matrix_4x4[index]) + 1.0) / (1.0 + 16.0);
  return luma < limit ? 0.0 : 1.0;
}

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  vec4 texel = texture(u_image, uv);
  // outColor = texel;
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

