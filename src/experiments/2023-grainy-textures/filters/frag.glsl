#version 300 es
precision highp float;

// generic uniforms
uniform vec2 u_resolution;
uniform sampler2D u_image;
uniform float u_time;

// out
out vec4 outColor;

// fn
vec3 color_black = vec3(0.0, 0.0, 0.0);
vec3 color_red = vec3(0.87, 0.21, 0.14);

vec4 rgb(float r, float g, float b) {
	return vec4(r / 255.0, g / 255.0, b / 255.0, 1.0);
}

vec4 circle(vec2 uv, vec2 pos, float rad, vec4 color) {
	float d = length(pos - uv) - rad;
	float t = clamp(d, 0.0, 1.0);
	return vec4(color.rgb, 1.0 - t);
}

// Main
void main() {
	vec2 uv = gl_FragCoord.xy;
	vec2 center = u_resolution.xy * 0.5;
  center.y += sin(u_time) * 100.0;
  center.x += cos(u_time) * 100.0;
	float radius = 0.28 * u_resolution.y;

  // Background layer
	// vec4 bg = vec4(0.0, 0.0, 0.0, 1.0);
  vec4 bg = rgb(242.0, 233.0, 228.0);
  outColor = bg;

	// Circle
	// vec3 red = rgb(225.0, 95.0, 60.0);
  vec4 circleOne = rgb(74.0, 78.0, 105.0);
	vec4 layer2 = circle(uv, center, radius, circleOne);

  vec4 circleTwo = rgb(154.0, 140.0, 152.0);
  vec2 circle_two_pos = center;
  circle_two_pos.x *= 1.3;
	vec4 layer3 = circle(uv * 0.7, circle_two_pos, radius * 0.5, circleTwo);
    
	// Blend the two
	outColor = mix(outColor, layer2, layer2.a);
	outColor = mix(outColor, layer3, layer3.a);
}
