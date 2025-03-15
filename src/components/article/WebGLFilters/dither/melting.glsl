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

// https://iquilezles.org/articles/palettes/
vec3 palette( float t ) {
  // vec3 a = vec3(0.5);
  // vec3 b = vec3(0.5);
  // vec3 c = vec3(1.0);
  // vec3 b = vec3(0.5);
  vec3 a = vec3(0.1);
  vec3 b = vec3(0.8);
  vec3 c = vec3(0.4);
  vec3 d = vec3(0.0, 0.1, 0.2);
  return a + b*cos( 6.28318*(c*t+d) );
}

float blendColorBurn(float base, float blend){
  return (blend==0.0)?blend:max((1.0-((1.0-base)/blend)),0.0);
}

vec4 blendColorBurn(vec4 base, vec4 blend){
  return vec4(
    blendColorBurn(base.r, blend.r),
    blendColorBurn(base.g, blend.g),
    blendColorBurn(base.b, blend.b),
    1.0
  );
}

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  vec4 texel = texture(u_image, uv);

  // outColor = blendColorBurn(
  //   texel,
  //   vec4(palette(uv.x + uv.y), 1.0)
  // );
  vec4 lowcolor = 
    vec4(0.216, 0.276, 0.36, 1.0);
    // vec4(0.141, 0.031, 0.318, 1.0);
  vec4 highcolor = 
    vec4(0.84, 0.3, 0.324, 1.0);

    // vec4(0.957, 0.239, 0.122, 1.0);
  outColor = mix(lowcolor, highcolor, texel);
}
