"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import {
  projectFragmentShader,
  projectVertexShader,
} from "@/lib/projectImageShaders";

export function useProjectImage(ref: RefObject<HTMLSpanElement | null>) {
  useEffect(() => {
    const media = ref.current;
    if (
      !media ||
      !matchMedia("(hover: hover) and (pointer: fine)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let disposed = false;
    let destroy: (() => void) | undefined;
    const initialize = async () => {
      const images = Array.from(
        media.querySelectorAll<HTMLImageElement>("img"),
      );
      const canvas = media.querySelector<HTMLCanvasElement>("canvas")!;
      const THREE = await import("three");
      await Promise.all(images.map((image) => image.decode().catch(() => {})));
      if (disposed || images.some((image) => !image.naturalWidth)) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: false,
        });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      const textures = images.map((image) => {
        // Snapshot the decoded image so Next's responsive source updates cannot
        // invalidate a texture that is already on the GPU.
        const source = document.createElement("canvas");
        source.width = image.naturalWidth;
        source.height = image.naturalHeight;
        source.getContext("2d")!.drawImage(image, 0, 0);
        const texture = new THREE.CanvasTexture(source);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;
        return texture;
      });
      const uniforms = {
        imageA: { value: textures[0] },
        imageB: { value: textures[1] },
        resolution: { value: new THREE.Vector2(1, 1) },
        sizeA: {
          value: new THREE.Vector2(
            images[0].naturalWidth,
            images[0].naturalHeight,
          ),
        },
        sizeB: {
          value: new THREE.Vector2(
            images[1].naturalWidth,
            images[1].naturalHeight,
          ),
        },
        mouse: { value: new THREE.Vector2(0.5, 0.5) },
        progress: { value: 0 },
        zoom: { value: 1 },
        time: { value: 0 },
      };
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 10);
      camera.position.z = 1;
      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: projectVertexShader,
        fragmentShader: projectFragmentShader,
      });
      scene.add(new THREE.Mesh(geometry, material));
      const resize = () => {
        const { width, height } = media.getBoundingClientRect();
        if (width && height) {
          renderer.setSize(width, height, false);
          uniforms.resolution.value.set(width, height);
        }
      };
      resize();
      const target = new THREE.Vector2(0.5, 0.5);
      let hovered = false;
      let frame = 0;
      let lastTime = 0;
      const render = (now: number) => {
        const delta = lastTime
          ? Math.min((now - lastTime) / 1000, 0.05)
          : 0.016;
        lastTime = now;
        uniforms.time.value += delta;
        uniforms.mouse.value.lerp(target, Math.min(9 * delta, 1));
        renderer.render(scene, camera);
        if (
          !hovered &&
          uniforms.progress.value <= 0.001 &&
          uniforms.zoom.value <= 1.001
        ) {
          frame = 0;
          lastTime = 0;
        } else frame = requestAnimationFrame(render);
      };
      const wake = () => {
        if (!frame) frame = requestAnimationFrame(render);
      };
      const move = (event: PointerEvent) => {
        const bounds = media.getBoundingClientRect();
        target.set(
          (event.clientX - bounds.left) / bounds.width,
          1 - (event.clientY - bounds.top) / bounds.height,
        );
        wake();
      };
      const enter = (event: PointerEvent) => {
        move(event);
        uniforms.mouse.value.copy(target);
        hovered = true;
        gsap.to(uniforms.progress, {
          value: 1,
          duration: 1.05,
          ease: "power2.out",
          overwrite: true,
        });
        gsap.to(uniforms.zoom, {
          value: 1.06,
          duration: 1.2,
          ease: "power3.out",
          overwrite: true,
        });
        wake();
      };
      const leave = () => {
        hovered = false;
        gsap.to(uniforms.progress, {
          value: 0,
          duration: 0.85,
          ease: "power2.inOut",
          overwrite: true,
        });
        gsap.to(uniforms.zoom, {
          value: 1,
          duration: 0.9,
          ease: "power3.out",
          overwrite: true,
        });
        wake();
      };
      const lost = () => {
        delete media.dataset.gl;
        cancelAnimationFrame(frame);
        frame = 0;
      };
      renderer.render(scene, camera);
      media.dataset.gl = "on";
      media.addEventListener("pointerenter", enter);
      media.addEventListener("pointermove", move);
      media.addEventListener("pointerleave", leave);
      canvas.addEventListener("webglcontextlost", lost);
      const observer = new ResizeObserver(() => {
        resize();
        wake();
      });
      observer.observe(media);
      destroy = () => {
        cancelAnimationFrame(frame);
        gsap.killTweensOf([uniforms.progress, uniforms.zoom]);
        observer.disconnect();
        media.removeEventListener("pointerenter", enter);
        media.removeEventListener("pointermove", move);
        media.removeEventListener("pointerleave", leave);
        canvas.removeEventListener("webglcontextlost", lost);
        delete media.dataset.gl;
        geometry.dispose();
        material.dispose();
        textures.forEach((texture) => texture.dispose());
        renderer.dispose();
      };
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        void initialize().catch(() => {
          delete media.dataset.gl;
        });
      },
      { rootMargin: "300px" },
    );
    observer.observe(media);
    return () => {
      disposed = true;
      observer.disconnect();
      destroy?.();
    };
  }, [ref]);
}
