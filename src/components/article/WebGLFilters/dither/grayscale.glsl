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

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  vec4 texel = texture(u_image, uv);
  outColor = texel;

  vec4 luma = vec4(0.299, 0.587, 0.114, 0);
  float grayscale = dot(outColor, luma);

  outColor = vec4(vec3(grayscale), 1.0);
}

