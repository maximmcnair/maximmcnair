#version 300 es
precision highp float;

// uniform vec2 u_resolution;
uniform sampler2D u_image;

in vec2 vUV;

out vec4 outColor;

// rand
float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float u_grain_amount = 0.03;

vec4 grain(vec4 fragColor, vec2 uv){
  vec4 color = fragColor;
  float diff = (rand(uv) - 0.0) * u_grain_amount;
  color.r += diff;
  color.g += diff;
  color.b += diff;
  return color;
}

void main() {
	// vec2 uv = gl_FragCoord.xy/u_resolution;
	vec2 uv = vUV.xy;
  // outColor = vec4(vUV.x, uv.y, 1.0, 1.0);

  vec4 texel = texture(u_image, uv);
  outColor = texel; 

  vec4 g = grain(outColor, uv);
  outColor = mix(outColor, g, g.a);
}
