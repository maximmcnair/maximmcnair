#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_image;

// Generic floats
uniform float u_fx;
uniform float u_fy;
uniform float u_fz;
uniform float u_fw;

out vec4 outColor;

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  vec4 texel = texture(u_image, uv);

  if (uv.x < u_mouse.x) {
    outColor = vec4(
      pow(texel.r, (3.0/2.0)), 
      pow(texel.g, (4.0/5.0)), 
      pow(texel.b, (3.0/2.0)), 
      1.0
    );
  } else {
    outColor = texel;
  }
}
