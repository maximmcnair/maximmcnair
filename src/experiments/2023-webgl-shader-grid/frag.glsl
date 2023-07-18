#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 outColor;

void main() {
	vec2 uv = gl_FragCoord.xy / u_resolution;
  vec3 color = vec3(1.0);

  float size = 16.0;

  float alpha = 10.0 * sin(floor(uv.y * size) + u_time * 4.0);

	outColor = vec4(uv.x, 1.0, 1.0, alpha);
}

