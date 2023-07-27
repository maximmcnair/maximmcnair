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

float rand(vec2 n) { 
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {
	vec2 coord = gl_FragCoord.xy / u_resolution;
	vec3 color = vec3(0.0);

  color += sin(coord.x * cos(u_time / 60.0) * 60.0) + sin(coord.y * cos(u_time / 15.0) * 10.0);
  color += cos(coord.y * sin(u_time / 60.0) * 80.0) + sin(coord.x * cos(u_time / 15.0) * 10.0);

  color *= sin(u_time / 10.0);
  color = palette(u_time) * color;

	outColor = vec4(color, 1.0);
}

