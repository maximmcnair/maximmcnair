#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

out vec4 outColor;

//https://iquilezles.org/articles/palettes/
vec3 palette( float t ) {
    // vec3 a = vec3(0.5);
    // vec3 b = vec3(0.5);
    // vec3 c = vec3(1.0);
    // vec3 b = vec3(0.5);
    vec3 a = vec3(0.1);
    vec3 b = vec3(0.8);
    vec3 c = vec3(0.4);
    vec3 d = vec3(0.0, 0.1, 0.2);

    return a + b*cos( 6.28318*(c*t+d) );
}

float circleshape(vec2 position, float radius){
  return step(radius, length(position));
}

float plot(vec2 uv) {    
  return smoothstep(0.02, 0.0, abs(uv.y - uv.x));
}

void main() {
	// vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;
	vec2 uv = gl_FragCoord.xy/u_resolution;
  // uv *= 0.4; 
  // uv += 30.0;
  
  vec2 layer_1 = uv;
  for (int n = 1; n < 2; n++) {
    float i = float(n);
    layer_1 += vec2(
        sin(uv.x + sin(u_time + uv.y * 10.0) * 0.2),
        sin(uv.y + sin(u_time + uv.x * 10.0) * 0.2)
    );
  }

  vec2 layer_2 = uv;
  for (int n = 1; n < 2; n++) {
    float i = float(n);
    layer_1 += vec2(
        sin(uv.y + sin(u_time)),
        sin(uv.x + sin(u_time + uv.y * 10.0) * 0.1 * floor(u_time))
    );
  }

  // float d = length(uv);
  vec3 color = palette(layer_1.x + layer_1.y);
  vec4 green = vec4(0.0, color.yx, 1.0);

  vec3 layer_2_color = palette(layer_2.x + layer_2.y);
  vec3 color2 = palette(layer_2_color.x * layer_2_color.y);
  vec4 orange = vec4(0.0, color.yx, 1.0);
  // vec4 orange = vec4(color2, 1.0);

  outColor = mix(green, orange, 0.5);
}

