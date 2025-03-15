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

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  vec4 texel = texture(u_image, uv);
  // gradient sidebar
  vec4 grad = vec4(uv.y, uv.y, uv.y, 1.0);
  outColor = mix(grad, texel, step(uv.x, 0.90));

  // make image grayscale
  vec4 lum = vec4(0.2126, 0.7152, 0.0722, 0);
  float grayscale = dot(outColor, lum);
  vec3 rgb = texel.rgb;

  outColor = vec4(vec3(threshold(grayscale)), 1.0);
}

