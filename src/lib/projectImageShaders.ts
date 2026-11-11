export const projectVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const projectFragmentShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D imageA;
uniform sampler2D imageB;
uniform vec2 resolution;
uniform vec2 sizeA;
uniform vec2 sizeB;
uniform vec2 mouse;
uniform float progress;
uniform float zoom;
uniform float time;

vec2 cover(vec2 uv, vec2 size) {
  vec2 fit = size * max(resolution.x / size.x, resolution.y / size.y);
  return (uv * resolution - (resolution - fit) * 0.5) / fit;
}
vec2 zoomed(vec2 uv) { return (uv - 0.5) / zoom + 0.5; }
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fractalNoise(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.02;
    amplitude *= 0.5;
  }
  return value;
}
void main() {
  float aspect = resolution.x / resolution.y;
  vec2 p = vec2(vUv.x * aspect, vUv.y);
  vec2 m = vec2(mouse.x * aspect, mouse.y);
  float distanceFromMouse = distance(p, m) / length(vec2(aspect, 1.0));
  float liquid = sin(clamp(progress, 0.0, 1.0) * 3.14159265359);
  float n = fractalNoise(p * 3.4 + vec2(time * 0.18, time * -0.12));
  float edge = progress * 1.35 - 0.09 - distanceFromMouse + (n - 0.5) * 0.42 * liquid;
  float mask = smoothstep(-0.055, 0.055, edge);
  float band = exp(-pow(edge / 0.17, 2.0));
  vec2 direction = normalize(p - m + vec2(0.0001)) / vec2(aspect, 1.0);
  vec2 push = direction * band * 0.075 * liquid;
  vec4 a = texture2D(imageA, cover(zoomed(vUv + push * 0.6), sizeA));
  vec4 b = texture2D(imageB, cover(zoomed(vUv - push), sizeB));
  gl_FragColor = mix(a, b, mask);
  #include <colorspace_fragment>
}
`;
