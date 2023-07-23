#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 outColor;

//https://iquilezles.org/articles/palettes/
vec3 palette( float t ) {
    vec3 a = vec3(0.1);
    vec3 b = vec3(0.8);
    vec3 c = vec3(0.4);
    vec3 d = vec3(0.0, 0.1, 0.2);

    return a + b*cos( 6.28318*(c*t+d) );
}

float random2d(vec2 coord, float offset){
  // return fract(sin(dot(coord.xy, vec2(17.9898 + offset, 78233.0 + offset))) * 43758.5453);
  return fract(sin(dot(coord.xy, vec2(17.9898, 78.233))) * 43758.5453 * offset);
  // return fract(sin(dot(coord.xy, vec2(17.9898 * offset, 78.233))) * 43758.5453 * offset);
}

void main() {
  vec2 coord = gl_FragCoord.xy * sin(0.02);

  float rand01 = fract(random2d(floor(coord), sin(u_time * 0.000009)));
  float rand02 = fract(random2d(floor(coord), sin(u_time * 0.000009)));

  // outColor = vec4(rand01, 0.0, 0.0, 1.0);

  outColor = vec4(palette(rand01), 1.0 * u_time);
  outColor = vec4(outColor.x, rand02, rand01, 1.0 * u_time);
}
