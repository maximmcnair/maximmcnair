// #version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform sampler2D textureID;
varying vec2 vUV;

uniform float u_grain_amount;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 grain(vec4 fragColor, vec2 uv){
  vec4 color = fragColor;
  float diff = (rand(uv) - 0.0) * u_grain_amount;
  color.r += diff;
  color.g += diff;
  color.b += diff;
  return color;
}

void main() {
	vec2 uv = vUV.xy;

  vec4 g = grain(gl_FragColor, uv);
  gl_FragColor = mix(gl_FragColor, g, g.a);
}

