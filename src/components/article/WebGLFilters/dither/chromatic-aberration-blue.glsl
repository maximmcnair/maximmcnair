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

vec4 chromaticAberration(vec2 uv, vec4 fragColor) {
  return vec4(
    texture(
      u_image, 
      uv
    ).x,
    texture(
      u_image, 
      vec2(uv.x + (0.1 * u_fx), uv.y + (0.1 * u_fy))
    ).y,
    texture(
      u_image, 
      uv
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

