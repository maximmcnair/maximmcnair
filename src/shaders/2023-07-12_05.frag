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

  for (int n = 1; n < 2; n++) {
    float i = float(n);
    uv += vec2(
        sin(uv.x + sin(u_time + uv.y * 10.0) * 0.2),
        sin(uv.y + sin(u_time + uv.x * 10.0) * 0.2)
    );
  }

  float d = length(uv);
  // vec3 color = palette(uv.x * sin(1.0) + uv.y) * 0.8;
  vec3 color = palette(uv.x + uv.y);

  outColor = vec4(0.0, color.yx, 1.0);
  // outColor = vec4(color, 1.0);
}

