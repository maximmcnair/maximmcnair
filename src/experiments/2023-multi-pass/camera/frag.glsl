#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_image;

// in vec2 vUV;

out vec4 outColor;

void main() {
	vec2 uv = gl_FragCoord.xy/u_resolution;
  // outColor = vec4(uv.x, uv.y, 1.0, 1.0);
	// vec2 uv = vUV.xy;

  vec4 texel = texture(u_image, uv);
  outColor = texel; 
}
