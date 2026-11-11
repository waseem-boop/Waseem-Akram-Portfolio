export const vertexShader = /* glsl */ `
  precision highp float;
  in vec3 position;
  in vec2 uv;
  out vec2 v_uv;

  void main() {
    v_uv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const trailShader = /* glsl */ `
  precision highp float;
  uniform sampler2D u_previous;
  uniform vec2 u_resolution;
  uniform vec4 u_mouse;
  uniform float u_delta;
  uniform float u_hover;
  uniform float u_down;
  uniform float u_radius;
  uniform float u_softness;
  uniform float u_strength;
  uniform float u_decay;
  uniform float u_centerFade;
  in vec2 v_uv;
  out vec4 fragColor;

  void main() {
    float reference = sqrt(u_resolution.x * u_resolution.y);
    vec2 simulationSize = u_resolution / reference * 800.0;
    vec2 pixel = 1.0 / simulationSize;
    vec4 previous = texture(u_previous, v_uv);
    float left = texture(u_previous, v_uv - vec2(pixel.x, 0.0)).r;
    float right = texture(u_previous, v_uv + vec2(pixel.x, 0.0)).r;
    float down = texture(u_previous, v_uv - vec2(0.0, pixel.y)).r;
    float up = texture(u_previous, v_uv + vec2(0.0, pixel.y)).r;
    float average = (left + right + down + up) * 0.25;
    float rate = u_delta * 60.0;
    float decay = pow(mix(0.95, 0.99, u_decay), rate);
    float next = (average * 2.0 - previous.g) * decay;

    vec2 point = v_uv * u_resolution / reference;
    vec2 mouse = u_mouse.xy * u_resolution / reference;
    float distanceToMouse = distance(point, mouse);
    float stamp = 1.0 - smoothstep(u_radius * (1.0 - u_softness), u_radius, distanceToMouse);
    float centerFade = smoothstep(0.0, u_centerFade * 0.2, distanceToMouse);
    float speed = clamp(length(u_mouse.zw) * u_strength, 0.0, 1.0);
    float pressure = 1.0 + u_down * 1.5;
    next += stamp * centerFade * u_hover * speed * pressure * min(rate, 3.0);

    fragColor = vec4(next, previous.r, 0.0, 1.0);
  }
`;

export const portraitShader = /* glsl */ `
  precision highp float;
  uniform sampler2D u_portrait;
  uniform sampler2D u_background;
  uniform sampler2D u_trail;
  uniform vec2 u_resolution;
  uniform vec2 u_backgroundSize;
  uniform vec4 u_portraitRect;
  uniform vec3 u_clicks[8];
  uniform float u_radius;
  uniform float u_strength;
  uniform float u_decay;
  uniform float u_displacement;
  uniform float u_dispersion;
  uniform float u_clickSpeed;
  in vec2 v_uv;
  out vec4 fragColor;

  vec4 layeredPortrait(vec2 uv) {
    vec2 flipped = vec2(uv.x, 1.0 - uv.y);
    vec2 ratio = u_resolution / u_backgroundSize;
    vec2 visibleArea = ratio / max(ratio.x, ratio.y);
    vec2 backgroundUV = flipped * visibleArea + (1.0 - visibleArea) * 0.5;
    vec4 background = texture(u_background, backgroundUV);
    vec2 portraitUV = (flipped * u_resolution - u_portraitRect.xy) / u_portraitRect.zw;
    float inside = step(0.0, portraitUV.x) * step(portraitUV.x, 1.0)
      * step(0.0, portraitUV.y) * step(portraitUV.y, 1.0);
    vec4 person = texture(u_portrait, clamp(portraitUV, 0.0, 1.0));
    return vec4(mix(background.rgb, person.rgb, person.a * inside), 1.0);
  }

  float clickLifetime() {
    float factor = mix(0.9, 0.95, u_decay);
    return -3.0 / (log(factor) / log(10.0)) / 60.0;
  }

  vec2 clickOffset(vec2 uv, float reference, vec3 click) {
    vec2 delta = (uv - click.xy) * u_resolution / reference;
    float distanceFromClick = length(delta);
    if (distanceFromClick < 0.00001) return vec2(0.0);
    float life = clickLifetime();
    float progress = clamp(u_clickSpeed * click.z / life, 0.0, 1.0);
    float reach = u_radius * 3.0;
    float front = reach * progress;
    float frequency = 6.2831853 / max(0.25 * reach, 0.0001);
    float band = max(0.25 * reach, 0.001);
    float x = distanceFromClick - front;
    float envelope = exp(-(x * x) / (band * band));
    float fade = 1.0 - smoothstep(life * 0.6, life, click.z);
    float wave = cos(frequency * x) * envelope * fade;
    vec2 direction = normalize(delta / distanceFromClick * reference / u_resolution);
    return direction * wave * u_strength * 0.02;
  }

  void main() {
    float reference = sqrt(u_resolution.x * u_resolution.y);
    vec2 pixel = 1.0 / (u_resolution / reference * 800.0);
    float left = texture(u_trail, v_uv - vec2(pixel.x, 0.0)).r;
    float right = texture(u_trail, v_uv + vec2(pixel.x, 0.0)).r;
    float down = texture(u_trail, v_uv - vec2(0.0, pixel.y)).r;
    float up = texture(u_trail, v_uv + vec2(0.0, pixel.y)).r;
    vec2 offset = vec2(left - right, down - up) * u_displacement * reference / u_resolution;
    float life = clickLifetime();
    for (int i = 0; i < 8; i++) {
      if (u_clicks[i].z >= 0.0 && u_clicks[i].z <= life) {
        offset += clickOffset(v_uv, reference, u_clicks[i]);
      }
    }
    vec4 red = layeredPortrait(v_uv + offset * (1.0 - u_dispersion * 0.5));
    vec4 green = layeredPortrait(v_uv + offset);
    vec4 blue = layeredPortrait(v_uv + offset * (1.0 + u_dispersion * 0.5));
    fragColor = vec4(red.r, green.g, blue.b, green.a);
  }
`;
