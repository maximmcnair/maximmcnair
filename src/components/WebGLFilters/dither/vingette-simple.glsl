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

float vignette(
  vec2 uv, 
  float radius, // (0 - 1)
  float smoothness // (0 - 1)
) {
	float diff = radius - distance(uv, vec2(0.5));
	return smoothstep(-smoothness, smoothness, diff);
}

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  vec4 texel = texture(u_image, uv);
  outColor = texel * vignette(uv, u_fx, u_fy);
}

