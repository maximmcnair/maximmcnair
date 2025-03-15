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

// Based on distance functions found at:
// http://iquilezles.org/www/articles/distfunctions/distfunctions.htm
float sdSquare(vec2 point, float width) {
	vec2 d = abs(point) - width;
	return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float vignette(
  vec2 uv, 
  vec2 size, // (0 - 0.5)
  float roundness, // (0 - 1)
  float smoothness // (0 - 1)
) {
	// Center UVs
	uv -= 0.5;

	// Shift UVs based on the larger of width or height
	float minWidth = min(size.x, size.y);
	uv.x = sign(uv.x) * clamp(abs(uv.x) - abs(minWidth - size.x), 0.0, 1.0);
	uv.y = sign(uv.y) * clamp(abs(uv.y) - abs(minWidth - size.y), 0.0, 1.0);

	// Signed distance calculation
	float boxSize = minWidth * (1.0 - roundness);
	float dist = sdSquare(uv, boxSize) - (minWidth * roundness);

	return 1.0 - smoothstep(0.0, smoothness, dist);
}

vec4 brightness(vec4 color, float value) {
  // Update only rgb values
  vec3 rgb = color.rgb + value;
  return vec4(rgb, color.a);
}

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  // vec4 texel = texture(u_image, uv);
  // outColor = texel;
  // outColor = brightness(texel, 0.10);
  outColor = vec4(1.0);

  float vignetteValue = vignette(uv, vec2(u_fx, u_fy), u_fz, u_fw);
  outColor = outColor * vignetteValue;
}

