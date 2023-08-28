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

  // make image grayscale
  vec4 luma = vec4(0.299, 0.587, 0.114, 0);
  float grayscale = dot(outColor, luma);

  vec4 lowcolor = 
    vec4(0.216, 0.276, 0.36, 1.0);
    // vec4(0.141, 0.031, 0.318, 1.0);
  vec4 highcolor = 
    vec4(0.84, 0.3, 0.324, 1.0);

    // vec4(0.957, 0.239, 0.122, 1.0);
  outColor = mix(lowcolor, highcolor, outColor);
}

