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

vec4 pixelate(float size, vec2 uv) {
  float dx = size / u_resolution.x;
  float dy = size / u_resolution.y;
  float x = dx * (floor(uv.x / dx) + 0.5);
  float y = dy * (floor(uv.y / dy) + 0.5);
  return texture(
    u_image,
    vec2(x, y)
  );
}

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  vec4 texel = texture(u_image, uv);
  outColor = texel;

  vec4 p = pixelate(60.0, uv);
  outColor = mix(outColor, p, p.a);
}

