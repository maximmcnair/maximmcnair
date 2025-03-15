#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform int u_mouse_over;
uniform float u_time;
uniform sampler2D u_image;
// Generic floats
uniform float u_fx;
uniform float u_fy;
uniform float u_fz;
uniform float u_fw;

out vec4 outColor;

vec4 chromaticAberration(vec2 uv, vec4 fragColor, float x, float y) {
  float d = length(uv - 0.5);

  return vec4(
    texture(
      u_image, 
      uv - d * 0.1 * ((x * 2.0) - 1.0)
    ).x,
    texture(
      u_image, 
      uv + d * 0.1 * ((y * 2.0) - 1.0)
    ).y,
    texture(
      u_image, 
      uv - d * 0.1 * ((y * 2.0) - 1.0)
    ).z,
    1.0
  );
}

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  vec4 texel = texture(u_image, uv);
  outColor = texel;

  if (u_mouse_over == 1) {
    outColor = chromaticAberration(uv, texel, u_mouse.x, u_mouse.y);
  } else {
    outColor = chromaticAberration(uv, texel, 0.3, 0.3);
  }
}

