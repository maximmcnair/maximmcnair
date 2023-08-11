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

const int kernel_matrix[9] = int[](
  -1, 0, 1,
  -2, 0, 2,
  -1, 0, 1
);
// total of elements in convolution matrix if above 1, otherwise 1
const int kernel_weight = 1;

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;

  vec2 onePixel = vec2(1) / vec2(textureSize(u_image, 0));

  vec4 colorSum =
    texture(u_image, uv + onePixel * vec2(-1, -1)) * vec4(kernel_matrix[0]) +
    texture(u_image, uv + onePixel * vec2( 0, -1)) * vec4(kernel_matrix[1]) +
    texture(u_image, uv + onePixel * vec2( 1, -1)) * vec4(kernel_matrix[2]) +
    texture(u_image, uv + onePixel * vec2(-1,  0)) * vec4(kernel_matrix[3]) +
    texture(u_image, uv + onePixel * vec2( 0,  0)) * vec4(kernel_matrix[4]) +
    texture(u_image, uv + onePixel * vec2( 1,  0)) * vec4(kernel_matrix[5]) +
    texture(u_image, uv + onePixel * vec2(-1,  1)) * vec4(kernel_matrix[6]) +
    texture(u_image, uv + onePixel * vec2( 0,  1)) * vec4(kernel_matrix[7]) +
    texture(u_image, uv + onePixel * vec2( 1,  1)) * vec4(kernel_matrix[8]) ;

  outColor = vec4((colorSum / vec4(kernel_weight)).rgb, 1);
}
