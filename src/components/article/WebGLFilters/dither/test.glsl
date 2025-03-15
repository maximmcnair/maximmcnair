#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_image;

out vec4 outColor;

const int indexMatrix4x4[16] = int[](
   0,  8,  2,  10,
   12, 4,  14, 6,
   3,  11, 1,  9,
   15, 7,  13, 5
);

// float rand(vec2 n) { 
//   return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
// }

// float quantize(float shade) {
//   float fac = 3.0 - 1.0;
//   return round(shade * fac) / 3.0;
// }

float rand(float n)
{
    return fract(sin(n) * 43758.5453);
}

float rand(vec2 uv)
{
  return fract(sin(dot(uv.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 rand2(vec2 p)
{
    return fract(sin(vec2(dot(p,vec2(127.1, 311.7)), dot(p,vec2(269.5, 183.3)))) * 43758.5453);
}

float threshold(float color) {
  if (color > 0.75) {
    return 1.0;
  }
  if (color > 0.25) {
    return 5.0;
  }
  return 0.0;
}

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  vec4 texel = texture(u_image, uv);
  // vec4 texel = vec4(uv.y, uv.y, uv.y, 1.0);

  // outColor = vec4(vec3(floor(uv.y * 4.0) / 4.0), 1.0);

  vec4 lum = vec4(0.299, 0.587, 0.114, 0);
  float grayscale = dot(texel, lum);
  vec3 rgb = texel.rgb;

  float levels = 4.0;
  // float grain = rand(uv * 0.01 + sin(u_time));

  grayscale = grayscale + (rand(uv) / 10.0);

  outColor = vec4(vec3(
    (floor(grayscale * levels) / levels)
    // (floor(grayscale * levels) / levels) + (rand(uv) / 9.0)
  ), 1.0);

  // outColor = vec4(
  //   vec3(
  //     threshold(grayscale)
  //     + rand(uv)
  //     // + (rand(uv) / 1.0)
  //   ),
  // 1.0);

  // float bands = 5.0;
  // outColor = quantize(uv);

  // outColor = step(
  //   0.2, c2(0.1),1.0-st);
    // pct *= tr.x * tr.
  //   texel
  // );

  // float bright = 0.3333 * (texel.r + texel.g + texel.b);
  // float threshold = 1.0;
  // float b = mix(1.0, 0.0, step(threshold, bright));
  // outColor = vec4(vec3(b), 1.0);
  // outColor = texel; 
  
  // Normalized pixel coordinates (from 0 to 1)
  // vec2 uv = fragCoord/iResolution.xy;

  // outColor = vec4(vec3(result), 1.0);
}
