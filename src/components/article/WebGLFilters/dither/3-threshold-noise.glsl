#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_image;
// Generic floats
uniform float u_fx;
uniform float u_fy;
uniform float u_fz; // noise

out vec4 outColor;

float threshold(float color) {
  if (color > u_fx) {
    return 1.0;
  }
  if (color > u_fy) {
    return 0.5;
  }
  return 0.0;
}

float rand(vec2 uv) {
  return fract(sin(dot(uv.xy, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  vec4 texel = texture(u_image, uv);
  // gradient sidebar
  vec4 grad = vec4(uv.y, uv.y, uv.y, 1.0);
  outColor = mix(grad, texel, step(uv.x, 0.90));
  // outColor = texel;

  // make image grayscale
  vec4 lum = vec4(0.299, 0.587, 0.114, 0);
  float grayscale = dot(outColor, lum);
  vec3 rgb = texel.rgb;
  
  float levels = 3.0;

  outColor = vec4(vec3(
    threshold(grayscale + ((rand(uv) / 9.0) * u_fz))
    // (floor(grayscale * levels) / levels) + (rand(uv) / 9.0)
  ), 1.0);
}

