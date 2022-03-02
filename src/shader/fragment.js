import glsl from 'glslify'

export default glsl`
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                      -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}



vec3 rgb(float r, float g, float b) {
    return vec3(r / 255., g / 255., b / 255.);
}

vec3 rgb(float c) {
    return vec3(c / 255., c / 255., c / 255.);
}

// uniform vec3 u_bg;
// uniform vec3 u_bgMain;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_time;
uniform float u_velocity_g;
uniform float u_velocity_b;
uniform float u_wavelength_g;
uniform float u_wavelength_b;
uniform float u_color_depth_g;
uniform float u_color_depth_b;
uniform float u_color_depth_o;
uniform float u_light_offset;

varying vec2 vUv;
varying float vDistortion;

void main() {
  vec3 c_w = rgb(230., 230., 230.);   // 灰白
  vec3 c_d = rgb(200., 200., 200.);   // 灰
  vec3 c_b = rgb(55. ,141. ,218.);    // 藍
  vec3 c_g = rgb(132. ,187. ,65.);    // 綠
  vec3 c_yg = rgb(219. ,234. ,55.);   // 黃綠
  vec3 c_oy = rgb(238. ,201. ,99.);   // 橘黃
  // vec3 bgMain = rgb(u_bgMain.r, u_bgMain.g, u_bgMain.b);

  float noise_b = snoise(vUv * 10. / u_wavelength_b + u_velocity_b * u_time) + u_light_offset;
  float noise_g = snoise(vUv * 10. / u_wavelength_g + u_velocity_g * u_time) + u_light_offset;

  float noise_yg = snoise(vUv * 2. - u_velocity_g / 2. * u_time );
  float noise_oy = snoise(vUv * 3. - u_velocity_g / 5. * u_time );
  float noise_w = snoise(vUv * 4. + u_velocity_g / 2. * u_time );

  vec3 color = c_w;
  color = mix(color, c_b, noise_b * (u_color_depth_b - u_light_offset * .6));
  color = mix(color, c_yg, noise_yg * 1.);
  color = mix(color, c_g, noise_g * (u_color_depth_g - u_light_offset * .6));
  color = mix(color, c_oy, noise_oy * u_color_depth_o);

  color = mix(color, c_w, noise_w * 1.);
  
  color = mix(color, mix(c_b, c_g, vUv.x), vDistortion);

  float border = smoothstep(0.1, 0.6, vUv.x);

  color = mix(color, c_d, 1. -border);

  gl_FragColor = vec4(color, 1.0);
}
`