#version 300 es
precision highp float;

// generic uniforms
uniform vec2 u_resolution;
uniform sampler2D u_image;

// filters
uniform mat4 u_brightnessMatrix;
uniform vec4 u_brightnessOffset;
uniform mat4 u_contrastMatrix;
uniform vec4 u_contrastOffset;
uniform mat4 u_exposureMatrix;
uniform mat4 u_saturationMatrix;
uniform float u_hue;

// effects
uniform float u_grain_amount;
uniform float u_pixelate;
uniform float u_duotone;
uniform float u_vignette;

// duotone
uniform vec4 u_duotone_lo;
uniform vec4 u_duotone_hi;

// out
out vec4 outColor;

// functions
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

vec4 pixelate(float size, vec2 uv) {
  float dx = size / u_resolution.x;
  float dy = size / u_resolution.y;
  float x = dx * (floor(uv.x / dx) + 0.5);
  float y = dy * (floor(uv.y / dy) + 0.5);
  return texture(
    u_image,
    vec2(x, y)
  );
}

vec4 hue(vec4 color, float amount) {
	float angle = amount * 3.14159265;
	float s = sin(angle), c = cos(angle);
	vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;
	float len = length(color.rgb);
	color.rgb = vec3(
		dot(color.rgb, weights.xyz),
		dot(color.rgb, weights.zxy),
		dot(color.rgb, weights.yzx)
	);
  return color;
}

vec4 duotone(vec4 fragColor, vec4 lowcolor, vec4 highcolor) {
	vec4 luminance = vec4(fragColor.r + fragColor.g + fragColor.b / 3.0);
  vec4 blackAndWhite = vec4(vec3(luminance), 1.0);
  return mix(lowcolor, highcolor, blackAndWhite);
}

vec4 vignette(vec2 uv, float strength){
  float d = length(uv - 0.5) * -1.0;
	vec4 overlay = vec4(d, d, d, strength);
  return overlay;
}

// Main
void main() {
	vec2 uv = gl_FragCoord.xy/u_resolution;
  // outColor = vec4(uv.x, uv.y, 1.0, 1.0);

  // vec4 texel = texture(u_image, uv);
  // outColor = texel; 

  vec4 p = pixelate(u_pixelate, uv);
  outColor = mix(outColor, p, p.a);
  vec4 texel = outColor;

  mat4 matrix = u_brightnessMatrix * u_contrastMatrix * u_exposureMatrix * u_saturationMatrix;
  vec4 offset = u_brightnessOffset + u_contrastOffset;
  vec4 filtered = vec4(matrix * texel + offset);
  outColor = filtered;

  // outColor = mix(outColor, filtered, filtered.a);

  // vec4 h = hue(outColor, u_hue);
  // outColor = mix(outColor, h, h.a);

  vec4 hi = vec4(0.9, 0.1, 0.3, 1.0);
  vec4 lo = vec4(0.9, 0.8, 0.2, 1.0);
  vec4 d = duotone(
    outColor, 
    u_duotone_lo, 
    u_duotone_hi
  );
  // outColor = mix(outColor, d, d.a);
  outColor = mix(outColor, d, u_duotone);
  // outColor = vec4(outColor.x, outColor.y, outColor.z, 1.0);

  vec4 v = vignette(uv, u_vignette);
  outColor = mix(outColor, v, v.a);

  vec4 g = grain(outColor, uv);
  outColor = mix(outColor, g, g.a);
}
