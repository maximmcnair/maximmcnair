#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_image;

// uniform float u_kernel[9];
// uniform float u_kernelWeight;

out vec4 outColor;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 grain(vec4 fragColor, vec2 uv){
  vec4 color = fragColor;
  float diff = (rand(uv) - 0.0) * 0.1;
  color.r += diff;
  color.g += diff;
  color.b += diff;
  return color;
}

vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.411764705882353) * direction;
  vec2 off2 = vec2(3.2941176470588234) * direction;
  vec2 off3 = vec2(5.176470588235294) * direction;
  color += texture(image, uv) * 0.1964825501511404;
  color += texture(image, uv + (off1 / resolution)) * 0.2969069646728344;
  color += texture(image, uv - (off1 / resolution)) * 0.2969069646728344;
  color += texture(image, uv + (off2 / resolution)) * 0.09447039785044732;
  color += texture(image, uv - (off2 / resolution)) * 0.09447039785044732;
  color += texture(image, uv + (off3 / resolution)) * 0.010381362401148057;
  color += texture(image, uv - (off3 / resolution)) * 0.010381362401148057;
  return color;
}

vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3846153846) * direction;
  vec2 off2 = vec2(3.2307692308) * direction;
  color += texture(image, uv) * 0.2270270270;
  color += texture(image, uv + (off1 / resolution)) * 0.3162162162;
  color += texture(image, uv - (off1 / resolution)) * 0.3162162162;
  color += texture(image, uv + (off2 / resolution)) * 0.0702702703;
  color += texture(image, uv - (off2 / resolution)) * 0.0702702703;
  return color;
}

vec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3333333333333333) * direction;
  color += texture(image, uv) * 0.29411764705882354;
  color += texture(image, uv + (off1 / resolution)) * 0.35294117647058826;
  color += texture(image, uv - (off1 / resolution)) * 0.35294117647058826;
  return color; 
}

void main() {
	// vec2 uv = gl_FragCoord.xy;
	vec2 uv = gl_FragCoord.xy/u_resolution;
 //  gl_FragColor = vec4(uv.y, uv.x, 1.0, 1.0);
  vec2 onePixel = vec2(1) / vec2(textureSize(u_image, 0));

  // vec4 texel = texture(u_image, uv);
  // outColor = texel; 

  // vec4 colorSum =
  //     texture(u_image, uv + onePixel * vec2(-1, -1)) * u_kernel[0] +
  //     texture(u_image, uv + onePixel * vec2( 0, -1)) * u_kernel[1] +
  //     texture(u_image, uv + onePixel * vec2( 1, -1)) * u_kernel[2] +
  //     texture(u_image, uv + onePixel * vec2(-1,  0)) * u_kernel[3] +
  //     texture(u_image, uv + onePixel * vec2( 0,  0)) * u_kernel[4] +
  //     texture(u_image, uv + onePixel * vec2( 1,  0)) * u_kernel[5] +
  //     texture(u_image, uv + onePixel * vec2(-1,  1)) * u_kernel[6] +
  //     texture(u_image, uv + onePixel * vec2( 0,  1)) * u_kernel[7] +
  //     texture(u_image, uv + onePixel * vec2( 1,  1)) * u_kernel[8] ;
  //
  // outColor = vec4((colorSum / u_kernelWeight).rgb, 1);

  outColor = blur13(u_image, uv, u_resolution, vec2(4.0));
  // outColor = blur9(u_image, uv, u_resolution, vec2(1.0));
  // outColor = blur5(u_image, uv, u_resolution, vec2(1.0, 1.0));
  // outColor = vec4(0.1, 1.0, 1.0, 1.0);

  // vec4 g = grain(outColor, uv);
  // outColor = mix(outColor, g, g.a);
}
