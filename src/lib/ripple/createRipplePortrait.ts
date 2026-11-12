import {
  Camera,
  GLSL3,
  HalfFloatType,
  LinearFilter,
  Mesh,
  NoColorSpace,
  PlaneGeometry,
  RawShaderMaterial,
  RGBAFormat,
  Scene,
  TextureLoader,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { siteConfig } from "@/data/siteConfig";
import { portraitShader, trailShader, vertexShader } from "./shaders";

export function createRipplePortrait(
  host: HTMLDivElement,
  eventSurface: HTMLElement,
  onReady: (ready: boolean) => void,
  initialEvent?: { type: "move" | "down"; clientX: number; clientY: number },
): (() => void) | undefined {
  const context = document
    .createElement("canvas")
    .getContext("webgl2", { alpha: false, antialias: false });
  if (!context || !context.getExtension("EXT_color_buffer_float")) return;
  const renderer = new WebGLRenderer({
    canvas: context.canvas as HTMLCanvasElement,
    context,
    alpha: false,
    antialias: false,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  const settings = siteConfig.ripple;
  const backgroundSize = new Vector2(1, 1);
  const portraitRect = new Vector4(0, 0, 1, 1);
  const resolution = new Vector2(1400, 900);
  const mouse = new Vector4(-10, -10, 0, 0);
  const pointer = new Vector2(-10, -10);
  const previous = new Vector2(-10, -10);
  const clicks = Array.from({ length: 8 }, () => new Vector3(0, 0, -1));
  const camera = new Camera();
  const geometry = new PlaneGeometry(2, 2);
  const scene = new Scene();
  const createTarget = () =>
    new WebGLRenderTarget(1, 1, {
      type: HalfFloatType,
      format: RGBAFormat,
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });
  let read = createTarget();
  let write = createTarget();
  const shared = {
    u_resolution: { value: resolution },
    u_radius: { value: settings.radius },
    u_strength: { value: settings.strength },
    u_decay: { value: settings.decay },
  };
  const trail = new RawShaderMaterial({
    glslVersion: GLSL3,
    vertexShader,
    fragmentShader: trailShader,
    uniforms: {
      ...shared,
      u_previous: { value: read.texture },
      u_mouse: { value: mouse },
      u_delta: { value: 1 / 60 },
      u_hover: { value: 0 },
      u_down: { value: 0 },
      u_softness: { value: settings.softness },
      u_centerFade: { value: settings.centerFade },
    },
  });
  const loader = new TextureLoader();
  loader.setCrossOrigin("anonymous");
  const image = loader.load(
    siteConfig.portrait,
    () => {
      if (disposed) {
        image.dispose();
        return;
      }
      image.colorSpace = NoColorSpace;
      image.flipY = false;
      portraitLoaded = true;
      loaded = portraitLoaded && backgroundLoaded;
      if (loaded) {
        resize();
        if (initialEvent) {
          if (initialEvent.type === "down") down(initialEvent as PointerEvent);
          else move(initialEvent as PointerEvent);
        } else {
          wake(false);
        }
      }
    },
    undefined,
    () => onReady(false),
  );
  const background = loader.load(
    siteConfig.heroBackground,
    () => {
      if (disposed) {
        background.dispose();
        return;
      }
      background.colorSpace = NoColorSpace;
      background.flipY = false;
      backgroundSize.set(background.image.width, background.image.height);
      backgroundLoaded = true;
      loaded = portraitLoaded && backgroundLoaded;
      if (loaded) {
        resize();
        if (initialEvent) {
          if (initialEvent.type === "down") down(initialEvent as PointerEvent);
          else move(initialEvent as PointerEvent);
        } else {
          wake(false);
        }
      }
    },
    undefined,
    () => onReady(false),
  );
  const portrait = new RawShaderMaterial({
    glslVersion: GLSL3,
    vertexShader,
    fragmentShader: portraitShader,
    uniforms: {
      ...shared,
      u_portrait: { value: image },
      u_background: { value: background },
      u_trail: { value: read.texture },
      u_backgroundSize: { value: backgroundSize },
      u_portraitRect: { value: portraitRect },
      u_clicks: { value: clicks },
      u_displacement: { value: settings.displacement },
      u_dispersion: { value: settings.dispersion },
      u_clickSpeed: { value: settings.clickSpeed },
    },
  });
  const quad = new Mesh(geometry, portrait);
  quad.frustumCulled = false;
  scene.add(quad);
  let disposed = false;
  let loaded = false;
  let portraitLoaded = false;
  let backgroundLoaded = false;
  let visible = true;
  let frame = 0;
  let lastTime = 0;
  let lastInteraction = -Infinity;
  let pressed = 0;
  let hovering = 0;
  let ready = false;
  let shaderFailed = false;
  renderer.debug.onShaderError = () => {
    shaderFailed = true;
    onReady(false);
  };

  function render(now: number) {
    frame = 0;
    if (disposed || !loaded || !visible || document.hidden) return;
    const delta = lastTime ? Math.min((now - lastTime) / 1000, 1 / 30) : 1 / 60;
    lastTime = now;
    const speedX = (pointer.x - previous.x) / Math.max(delta, 0.001);
    const speedY = (pointer.y - previous.y) / Math.max(delta, 0.001);
    mouse.set(pointer.x, pointer.y, speedX, speedY);
    previous.copy(pointer);
    trail.uniforms.u_delta.value = delta;
    trail.uniforms.u_hover.value +=
      (hovering - trail.uniforms.u_hover.value) * 0.3;
    trail.uniforms.u_down.value +=
      (pressed - trail.uniforms.u_down.value) * 0.3;
    for (const click of clicks) if (click.z >= 0) click.z += delta;

    // Ping-pong the wave field before sampling it in the portrait pass.
    quad.material = trail;
    trail.uniforms.u_previous.value = read.texture;
    renderer.setRenderTarget(write);
    renderer.render(scene, camera);
    [read, write] = [write, read];
    quad.material = portrait;
    portrait.uniforms.u_trail.value = read.texture;
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
    if (shaderFailed) return;
    if (!ready) {
      ready = true;
      onReady(true);
    }
    if (now - lastInteraction < 4500) frame = requestAnimationFrame(render);
  }

  function wake(animate = true) {
    if (animate) lastInteraction = performance.now();
    if (!frame && !disposed && loaded && visible && !document.hidden) {
      lastTime = 0;
      frame = requestAnimationFrame(render);
    }
  }

  function resize() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (width < 1 || height < 1) return;
    // Use the CSS layer's exact geometry so WebGL and the static fallback agree.
    const layer = eventSurface.querySelector<HTMLElement>(".hero-portrait-layer");
    if (layer) {
      const bounds = layer.getBoundingClientRect();
      const surface = host.getBoundingClientRect();
      portraitRect.set(
        bounds.left - surface.left,
        bounds.top - surface.top,
        bounds.width,
        bounds.height,
      );
    }
    resolution.set(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    const ratio = renderer.getPixelRatio();
    read.setSize(Math.round(width * ratio), Math.round(height * ratio));
    write.setSize(Math.round(width * ratio), Math.round(height * ratio));
    for (const target of [read, write]) {
      renderer.setRenderTarget(target);
      renderer.clear();
    }
    renderer.setRenderTarget(null);
    wake(false);
  }
  function move(event: PointerEvent) {
    const rect = host.getBoundingClientRect();
    pointer.set(
      (event.clientX - rect.left) / rect.width,
      1 - (event.clientY - rect.top) / rect.height,
    );
    if (!hovering) previous.copy(pointer);
    hovering = 1;
    wake();
  }
  function leave() {
    hovering = 0;
    pressed = 0;
    wake();
  }
  function down(event: PointerEvent) {
    move(event);
    pressed = 1;
    const slot =
      clicks.find((click) => click.z < 0 || click.z > 2.5) ??
      clicks.reduce((oldest, click) => (click.z > oldest.z ? click : oldest));
    slot.set(pointer.x, pointer.y, 0);
    wake();
  }
  function up() {
    pressed = 0;
    wake();
  }
  function visibility() {
    if (document.hidden && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else wake(false);
  }
  function scroll() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    hovering = 0;
    pressed = 0;
    if (ready) {
      ready = false;
      onReady(false);
    }
  }
  function lost(event: Event) {
    event.preventDefault();
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    onReady(false);
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const portraitLayer = eventSurface.querySelector(".hero-portrait-layer");
  if (portraitLayer) resizeObserver.observe(portraitLayer);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else wake(false);
  });
  intersection.observe(eventSurface);
  eventSurface.addEventListener("pointermove", move, { passive: true });
  eventSurface.addEventListener("pointerleave", leave);
  eventSurface.addEventListener("pointerdown", down, { passive: true });
  window.addEventListener("pointerup", up);
  window.addEventListener("scroll", scroll, { passive: true });
  document.addEventListener("visibilitychange", visibility);
  canvas.addEventListener("webglcontextlost", lost);
  resize();

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    intersection.disconnect();
    eventSurface.removeEventListener("pointermove", move);
    eventSurface.removeEventListener("pointerleave", leave);
    eventSurface.removeEventListener("pointerdown", down);
    window.removeEventListener("pointerup", up);
    window.removeEventListener("scroll", scroll);
    document.removeEventListener("visibilitychange", visibility);
    canvas.removeEventListener("webglcontextlost", lost);
    image.dispose();
    background.dispose();
    trail.dispose();
    portrait.dispose();
    read.dispose();
    write.dispose();
    geometry.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };
}
