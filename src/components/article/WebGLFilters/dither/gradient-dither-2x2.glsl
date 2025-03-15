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
float dither2x2(vec2 uv, float luma) {
  float dither_amount = 2.0;
  int x = int(mod(uv.x, dither_amount));
  int y = int(mod(uv.y, dither_amount));
  int index = x + y * int(dither_amount);
  float limit = (float(dither_matrix_2x2[index]) + 1.0) / (1.0 + 4.0);
  return luma < limit ? 0.0 : 1.0;
}

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;

  // default to white
  outColor = vec4(1.0, 1.0, 1.0, 1.0);

  if (uv.x > 0.01 && uv.x < 0.99 && uv.y > 0.1 && uv.y < 0.9){
    // gradient sidebar
    outColor = vec4(uv.x, uv.x, uv.x, 1.0);

    // make image grayscale
    vec4 luma = vec4(0.299, 0.587, 0.114, 0);
    float grayscale = dot(outColor, luma);

    outColor = vec4(
      vec3(dither2x2(gl_FragCoord.xy, grayscale)),
      1.0
    );
  }
}

