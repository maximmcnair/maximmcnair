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

//https://iquilezles.org/articles/palettes/
vec3 palette( float t ) {
    // vec3 a = vec3(0.5);
    // vec3 b = vec3(0.5);
    // vec3 c = vec3(1.0);
    // vec3 b = vec3(0.5);
    vec3 a = vec3(0.1);
    vec3 b = vec3(0.8);
    vec3 c = vec3(0.4);
    vec3 d = vec3(0.0, 0.1, 0.2);

    return a + b*cos( 6.28318*(c*t+d) );
}

float rand(vec2 n) { 
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {
	vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;
  uv *= 0.2;
  uv += 30.0;

  float grain = rand(100.0 * uv);

  for (int n = 1; n < 2; n++) {
    float i = float(n);
    uv += vec2(
      sin(uv.x * 6.0 + sin(u_time + uv.y * 10.0) * 0.2),
      sin(uv.y * 6.0 + sin(u_time + uv.x * 10.0) * 0.2)
    );
  }

  vec3 colorGrained = palette(uv.x * sin(1.0) + uv.y + grain);
  vec3 color = palette(uv.x * sin(1.0) + uv.y);
  color = mix(colorGrained, color, 0.9);
  outColor = vec4(color, 1.0);

  // make image grayscale
  vec4 luma = vec4(0.299, 0.587, 0.114, 0);
  float grayscale = dot(outColor, luma);

  // outColor = vec4(
  //   vec3(dither(gl_FragCoord.xy, grayscale)),
  //   1.0
  // );
  outColor = vec4(
    // vec3(dither(gl_FragCoord.xy, grayscale)),
    outColor.r * dither(gl_FragCoord.xy, grayscale),
    outColor.g * dither(gl_FragCoord.xy, grayscale),
    outColor.b * dither(gl_FragCoord.xy, grayscale),
    1.0
  );
}

