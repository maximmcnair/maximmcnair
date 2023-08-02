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

float chromaticMultiplier = 0.3;

vec4 chromaticAberration(vec2 uv, vec4 fragColor) {
  float d = length(uv - 0.5);

  return vec4(
    texture(
      u_image, 
      uv - d * 0.1 * chromaticMultiplier
    ).x,
    texture(
      u_image, 
      uv
    ).y,
    texture(
      u_image, 
      uv + d * 0.1 * chromaticMultiplier
    ).z,
    1.0
  );
}

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  vec4 texel = texture(u_image, uv);
  outColor = texel;

  outColor = chromaticAberration(uv, texel);
}

