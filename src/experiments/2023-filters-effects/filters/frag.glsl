#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_image;

out vec4 outColor;

void main() {
	vec2 uv = gl_FragCoord.xy/u_resolution;
  // outColor = vec4(uv.x, uv.y, 1.0, 1.0);

  vec4 texel = texture(u_image, uv);
  outColor = texel; 
}
