#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_image;
// Generic floats
uniform float u_fx;
uniform float u_fy;
uniform float u_fz;
uniform float u_fw;

out vec4 outColor;

vec4 brightness(vec4 color, float value) {
  // Update only rgb values
  vec3 rgb = color.rgb + value;
  return vec4(rgb, color.a);
}

vec4 exposure(vec4 color, float value) {
  // Update only rgb values
  vec3 rgb = (1.0 + color.rgb) * value;
  return vec4(rgb, color.a);
}

// Based on TyLindber's glsl-vignette
// https://github.com/TyLindberg/glsl-vignette

// Based on distance functions found at:
// http://iquilezles.org/www/articles/distfunctions/distfunctions.htm
float sdSquare(vec2 point, float width) {
	vec2 d = abs(point) - width;
	return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

/*
 * Vignette
 * @param {vec2} uv - uv coordinates
 * @param {vec2} size - width/height (0 - 0.5) 
 * @param {float} roundness - roundness factor (0 - 1)
 * @param {float} smoothness - smoothness factor (0 - 1)
 */
vec4 vignette(
  vec2 uv,
  float width, // (0 - 0.5)
  float height, // (0 - 0.5)
  float roundness, // (0 - 1)
  float smoothness // (0 - 1)
){
	// Center UVs
	uv -= 0.5;

	// Shift UVs based on the larger of width or height
	float minWidth = min(width, height);
	uv.x = sign(uv.x) * clamp(abs(uv.x) - abs(minWidth - width), 0.0, 1.0);
	uv.y = sign(uv.y) * clamp(abs(uv.y) - abs(minWidth - height), 0.0, 1.0);

	// Signed distance calculation
	float boxSize = minWidth * (1.0 - roundness);
	float dist = sdSquare(uv, boxSize) - (minWidth * roundness);

	return vec4(1.0 - smoothstep(0.0, smoothness, dist));
}

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  vec4 texel = texture(u_image, uv);
  outColor = texel;

  // vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
  // outColor = white;

  outColor = brightness(texel, 0.4);
  // outColor = exposure(texel, 0.6);

  outColor = vignette(uv, 1.0, 1.0, 1.0, 1.0);
  // vec4 v = vignette(uv, 1.0, 1.0, 1.0, 1.0);
  // outColor = mix(outColor, v, v.a);
}

