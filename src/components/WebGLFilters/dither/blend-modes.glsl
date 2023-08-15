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

vec3 hsb2rgb(vec3 c){
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec4 blendNormal(vec4 base, vec4 blend){
  return blend;
}

vec4 blendDarken(vec4 base, vec4 blend){
  return vec4(
    min(base.r, blend.r),
    min(base.g, blend.g),
    min(base.b, blend.b),
    1.0
  );
}

vec4 blendLighten(vec4 base, vec4 blend){
  return vec4(
    max(base.r, blend.r),
    max(base.g, blend.g),
    max(base.b, blend.b),
    1.0
  );
}

vec4 blendMultiply(vec4 base, vec4 blend){
  return vec4(
    base.r * blend.r,
    base.g * blend.g,
    base.b * blend.b,
    1.0
  );
}

vec4 blendScreen(vec4 base, vec4 blend){
  return vec4(
    1.0 - ((1.0 - base.r) * (1.0 - blend.r)),
    1.0 - ((1.0 - base.g) * (1.0 - blend.g)),
    1.0 - ((1.0 - base.b) * (1.0 - blend.b)),
    1.0
  );
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

float blendColorDodge(float base, float blend){
  return (blend == 1.0) ? blend : min(base / (1.0 - blend), 1.0);
}

vec4 blendColorDodge(vec4 base, vec4 blend){
  return vec4(
    blendColorDodge(base.r, blend.r),
    blendColorDodge(base.g, blend.g),
    blendColorDodge(base.b, blend.b),
    1.0
  );
}

// Contrast Blend Modes
float blendOverlay(float base, float blend){
  return base < 0.5 ? (2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec4 blendOverlay(vec4 base, vec4 blend){
  return vec4(
    blendOverlay(base.r, blend.r),
    blendOverlay(base.g, blend.g),
    blendOverlay(base.b, blend.b),
    1.0
  );
}

float blendSoftLight(float base, float blend){
  return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
}

vec4 blendSoftLight(vec4 base, vec4 blend){
  return vec4(
    blendSoftLight(base.r, blend.r),
    blendSoftLight(base.g, blend.g),
    blendSoftLight(base.b, blend.b),
    1.0
  );
}

float blendHardLight(float base, float blend){
  return base < 0.5 ? (2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec4 blendHardLight(vec4 base, vec4 blend){
  return vec4(
    blendHardLight(base.r, blend.r),
    blendHardLight(base.g, blend.g),
    blendHardLight(base.b, blend.b),
    1.0
  );
}

void main() {
  // map uv between 0 -> 1
	vec2 uv = gl_FragCoord.xy/u_resolution;
  vec4 texel = texture(u_image, uv);
  vec4 blend = vec4(hsb2rgb(vec3(uv.x, 1.0, 1.0)), 1.0);

  if (uv.x < u_mouse.x) {
    if (u_fx == 1.0) {
      outColor = blendNormal(texel, blend);
    } else if (u_fx == 2.0) {
      outColor = blendDarken(texel, blend);
    } else if (u_fx == 3.0) {
      outColor = blendLighten(texel, blend);
    } else if (u_fx == 4.0) {
      outColor = blendMultiply(texel, blend);
    } else if (u_fx == 5.0) {
      outColor = blendScreen(texel, blend);
    } else if (u_fx == 6.0) {
      outColor = blendColorBurn(texel, blend);
    } else if (u_fx == 7.0) {
      outColor = blendColorDodge(texel, blend);
    } else if (u_fx == 8.0) {
      outColor = blendOverlay(texel, blend);
    } else if (u_fx == 9.0) {
      outColor = blendSoftLight(texel, blend);
    } else if (u_fx == 10.0) {
      outColor = blendHardLight(texel, blend);
    }
  } else {
    outColor = texel;
  }
}
