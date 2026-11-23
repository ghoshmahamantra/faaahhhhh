import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { COUPLE_INFO, STORY_SLIDES, type StorySlide } from '../data/weddingData';
import { wrapCarouselIndex } from '../utils/weddingLogic';
import { FloralDivider } from './Ornaments';

// Pre-allocated math helpers outside the render loop (Zero GC)
const _pointerNdc = new THREE.Vector2();
const _raycaster = new THREE.Raycaster();

function createBeveledFrameGeometry(
  outerW: number,
  outerH: number,
  borderW: number,
  depth: number
): THREE.ExtrudeGeometry {
  const hw = outerW / 2;
  const hh = outerH / 2;
  const ihw = hw - borderW;
  const ihh = hh - borderW;

  const shape = new THREE.Shape();
  shape.moveTo(-hw, -hh);
  shape.lineTo(hw, -hh);
  shape.lineTo(hw, hh);
  shape.lineTo(-hw, hh);
  shape.closePath();

  const hole = new THREE.Path();
  hole.moveTo(-ihw, -ihh);
  hole.lineTo(ihw, -ihh);
  hole.lineTo(ihw, ihh);
  hole.lineTo(-ihw, ihh);
  hole.closePath();
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.065,
    bevelSize: 0.06,
    bevelSegments: 3,
    curveSegments: 2,
  });
  geo.center();
  return geo;
}

function createSoftShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 160, 42, 128, 160, 124);
    grad.addColorStop(0, 'rgba(42, 8, 16, 0.34)');
    grad.addColorStop(0.58, 'rgba(42, 8, 16, 0.14)');
    grad.addColorStop(1, 'rgba(42, 8, 16, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 320);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawSlideCanvas(
  canvas: HTMLCanvasElement,
  slide: StorySlide,
  img: HTMLImageElement | null
): void {
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Warm antique cream museum mat
  const matGrad = ctx.createLinearGradient(0, 0, W, H);
  matGrad.addColorStop(0, '#fcf4e5');
  matGrad.addColorStop(0.5, '#f6e7cf');
  matGrad.addColorStop(1, '#efe0c4');
  ctx.fillStyle = matGrad;
  ctx.fillRect(0, 0, W, H);

  // Subtle inner gold fillet
  ctx.strokeStyle = 'rgba(196, 151, 70, 0.55)';
  ctx.lineWidth = 3;
  ctx.strokeRect(26, 26, W - 52, H - 52);

  if (slide.kind === 'photo') {
    const photoX = 56;
    const photoY = 58;
    const photoW = W - 112;
    const photoH = H - 220;

    // Cream recessed photo mat border
    ctx.fillStyle = '#ead8bc';
    ctx.fillRect(photoX, photoY, photoW, photoH);

    if (img && img.complete && img.naturalWidth > 0) {
      // Cover-crop portrait cleanly inside photo frame
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const boxRatio = photoW / photoH;
      let sx = 0;
      let sy = 0;
      let sw = img.naturalWidth;
      let sh = img.naturalHeight;
      if (imgRatio > boxRatio) {
        sw = img.naturalHeight * boxRatio;
        sx = (img.naturalWidth - sw) * 0.5;
      } else {
        sh = img.naturalWidth / boxRatio;
        sy = (img.naturalHeight - sh) * 0.28; // bias slightly upward to preserve faces
      }
      ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
    } else {
      // Polished gradient fallback
      const fb = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
      fb.addColorStop(0, '#edd6b5');
      fb.addColorStop(1, '#dcc099');
      ctx.fillStyle = fb;
      ctx.fillRect(photoX, photoY, photoW, photoH);
    }

    // Crisp white inner photo border like Screenshot 6
    ctx.strokeStyle = '#fff9ef';
    ctx.lineWidth = 8;
    ctx.strokeRect(photoX, photoY, photoW, photoH);

    // Handwritten italic maroon hashtag below photo (#howitstarted, #adventures, etc.)
    ctx.fillStyle = '#5c0b22';
    ctx.font = 'italic 500 54px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(slide.hashtag || slide.chapter, W / 2, H - 86);
  } else {
    // Editorial Quote Frame matching middle frame in Screenshot 6
    ctx.strokeStyle = 'rgba(196, 151, 70, 0.32)';
    ctx.lineWidth = 2;
    ctx.strokeRect(52, 52, W - 104, H - 104);

    ctx.fillStyle = '#5c0b22';
    ctx.font = 'italic 500 48px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = wrapLines(ctx, slide.caption, W - 180);
    const lineHeight = 70;
    const totalH = lines.length * lineHeight;
    const startY = H / 2 - totalH / 2 + lineHeight / 2;
    lines.forEach((line, idx) => {
      ctx.fillText(line, W / 2, startY + idx * lineHeight);
    });

    // Small gold floral dot ornament below quote
    ctx.fillStyle = '#c49746';
    ctx.beginPath();
    ctx.arc(W / 2, startY + lines.length * lineHeight + 24, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

interface FrameRig {
  pivotGroup: THREE.Group;
  frameGroup: THREE.Group;
  shadowMesh: THREE.Mesh;
  baseTiltZ: number;
  angleZ: number;
  velZ: number;
  angleY: number;
  velY: number;
  angleX: number;
  velX: number;
  inertiaScale: number;
}

/**
 * Full-Screen 3D Three.js Hanging Gallery Frames with Real Pendulum Swipe Physics (Screenshot 6):
 * - Deep maroon cylindrical rod spanning full width across botanical cream wallpaper
 * - 3D beveled maroon lacquer picture frames suspended by brass rings & braided cords
 * - Real damped harmonic pendulum + torsional yaw/pitch physics driven by swipe/drag/wheel
 */
export const StoryCarousel: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  const total = STORY_SLIDES.length;

  // Shared mutable physics state so React re-renders never tear down the Three.js scene
  const physicsRef = useRef({
    scrollX: 0,
    targetScrollX: 0,
    velX: 0,
    prevVelX: 0,
    spacing: 3.9,
    dragging: false,
    dragStartClientX: 0,
    dragStartScrollX: 0,
    lastClientX: 0,
    lastTimeMs: 0,
    movedDist: 0,
    activeIndex: 0,
    frameRigs: [] as FrameRig[],
    requestImpulse: 0,
  });

  const goToIndex = (nextIdx: number) => {
    const wrapped = wrapCarouselIndex(nextIdx, 0, total);
    const st = physicsRef.current;
    const target = wrapped * st.spacing;
    const delta = target - st.targetScrollX;
    st.targetScrollX = target;
    // Inject directional swing impulse when navigating via buttons or dots
    st.requestImpulse = Math.sign(delta) * Math.min(1.8, Math.abs(delta) * 0.42);
    setActiveIndex(wrapped);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // Detect software WebGL per threejs skill guidelines
    const isSoftwareGl = (() => {
      try {
        const testCanvas = document.createElement('canvas');
        const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 560;
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'pan-y';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Studio environment reflection for realistic lacquer & brass highlights
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 60);
    camera.position.set(0, 0.12, 8.6);
    camera.lookAt(0, -0.05, 0);

    // Warm/cool studio lighting rig
    const hemiLight = new THREE.HemisphereLight(0xfff6ea, 0x4b1222, 1.15);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 1.65);
    keyLight.position.set(4.5, 5.5, 7.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf6d9a0, 0.75);
    rimLight.position.set(-5.0, 2.5, 3.5);
    scene.add(rimLight);

    // Track group holding the horizontal rod & all hanging frame rigs
    const galleryTrack = new THREE.Group();
    scene.add(galleryTrack);

    const rodY = 2.15;

    // 1. Horizontal Deep Maroon Lacquer Rod (stationary across viewport)
    const rodGeo = new THREE.CylinderGeometry(0.055, 0.055, 28, 24);
    rodGeo.rotateZ(Math.PI / 2);
    const rodMat = new THREE.MeshPhysicalMaterial({
      color: 0x6a0c26,
      roughness: 0.25,
      metalness: 0.12,
      clearcoat: 0.72,
      clearcoatRoughness: 0.22,
    });
    const rodMesh = new THREE.Mesh(rodGeo, rodMat);
    rodMesh.position.set(0, rodY, 0.06);
    scene.add(rodMesh);

    // Shared geometries & materials for hanging frame assemblies
    const ringGeo = new THREE.TorusGeometry(0.088, 0.022, 12, 28);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xe6c785,
      roughness: 0.26,
      metalness: 0.85,
    });

    const cordGeo = new THREE.CylinderGeometry(0.014, 0.014, 1.0, 8);
    const cordMat = new THREE.MeshStandardMaterial({
      color: 0x74102c,
      roughness: 0.65,
      metalness: 0.05,
    });

    const frameOuterW = 2.68;
    const frameOuterH = 3.24;
    const frameBorderW = 0.22;
    const frameDepth = 0.16;
    const frameGeo = createBeveledFrameGeometry(
      frameOuterW,
      frameOuterH,
      frameBorderW,
      frameDepth
    );
    const frameMat = new THREE.MeshPhysicalMaterial({
      color: 0x56061b,
      roughness: 0.3,
      metalness: 0.08,
      clearcoat: 0.65,
      clearcoatRoughness: 0.2,
    });

    const artPlaneW = frameOuterW - frameBorderW * 1.85;
    const artPlaneH = frameOuterH - frameBorderW * 1.85;
    const artGeo = new THREE.PlaneGeometry(artPlaneW, artPlaneH);

    const backingGeo = new THREE.BoxGeometry(
      frameOuterW - 0.12,
      frameOuterH - 0.12,
      0.06
    );
    const backingMat = new THREE.MeshStandardMaterial({
      color: 0x3b0412,
      roughness: 0.65,
    });

    const shadowTex = createSoftShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(frameOuterW * 1.18, frameOuterH * 1.15);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    });

    const createdTextures: THREE.Texture[] = [shadowTex, envTex];
    const createdMaterials: THREE.Material[] = [
      rodMat,
      ringMat,
      cordMat,
      frameMat,
      backingMat,
      shadowMat,
    ];
    const createdGeometries: THREE.BufferGeometry[] = [
      rodGeo,
      ringGeo,
      cordGeo,
      frameGeo,
      artGeo,
      backingGeo,
      shadowGeo,
    ];

    // Signature organic slight rest tilts matching Screenshot 6
    const restTilts = [-0.055, 0.068, -0.048, 0.052, -0.042];
    const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    const spacing = width < 640 ? 3.25 : 3.85;
    physicsRef.current.spacing = spacing;
    physicsRef.current.scrollX = physicsRef.current.activeIndex * spacing;
    physicsRef.current.targetScrollX = physicsRef.current.scrollX;

    const frameRigs: FrameRig[] = [];
    const hitTargets: THREE.Object3D[] = [];

    STORY_SLIDES.forEach((slide, idx) => {
      // Pivot positioned directly on the rod
      const pivotGroup = new THREE.Group();
      pivotGroup.position.set(idx * spacing, rodY, 0);
      galleryTrack.add(pivotGroup);

      // Soft wall drop shadow
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.position.set(0.08, -2.35, -0.22);
      pivotGroup.add(shadowMesh);

      // Gold/Cream Ring around rod
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(0, 0.05, 0.06);
      pivotGroup.add(ringMesh);

      // Braided Cords from Ring to Frame Top Corners
      const cordDropY = 0.68;
      const topCornerX = frameOuterW * 0.34;
      const cordLen = Math.hypot(topCornerX, cordDropY);
      const cordAngle = Math.atan2(topCornerX, cordDropY);

      const leftCord = new THREE.Mesh(cordGeo, cordMat);
      leftCord.scale.set(1, cordLen, 1);
      leftCord.position.set(-topCornerX * 0.5, -cordDropY * 0.5, 0.03);
      leftCord.rotation.z = -cordAngle;
      pivotGroup.add(leftCord);

      const rightCord = new THREE.Mesh(cordGeo, cordMat);
      rightCord.scale.set(1, cordLen, 1);
      rightCord.position.set(topCornerX * 0.5, -cordDropY * 0.5, 0.03);
      rightCord.rotation.z = cordAngle;
      pivotGroup.add(rightCord);

      // 3D Beveled Maroon Frame Assembly
      const frameGroup = new THREE.Group();
      frameGroup.position.set(0, -(cordDropY + frameOuterH * 0.5) + 0.03, 0.03);
      pivotGroup.add(frameGroup);

      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      frameMesh.userData.slideIndex = idx;
      frameGroup.add(frameMesh);
      hitTargets.push(frameMesh);

      const backingMesh = new THREE.Mesh(backingGeo, backingMat);
      backingMesh.position.set(0, 0, -0.05);
      frameGroup.add(backingMesh);

      // Front Artwork CanvasTexture (Photo + Hashtag or Quote)
      const artCanvas = document.createElement('canvas');
      artCanvas.width = 768;
      artCanvas.height = 928;
      drawSlideCanvas(artCanvas, slide, null);

      const artTex = new THREE.CanvasTexture(artCanvas);
      artTex.colorSpace = THREE.SRGBColorSpace;
      artTex.anisotropy = maxAnisotropy;
      createdTextures.push(artTex);

      const artMat = new THREE.MeshStandardMaterial({
        map: artTex,
        roughness: 0.72,
        metalness: 0.02,
      });
      createdMaterials.push(artMat);

      const artMesh = new THREE.Mesh(artGeo, artMat);
      artMesh.position.set(0, 0, -0.01);
      artMesh.userData.slideIndex = idx;
      frameGroup.add(artMesh);
      hitTargets.push(artMesh);

      if (slide.kind === 'photo' && slide.image) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          drawSlideCanvas(artCanvas, slide, img);
          artTex.needsUpdate = true;
        };
        img.src = slide.image;
      }

      const baseTiltZ = restTilts[idx % restTilts.length];
      pivotGroup.rotation.z = baseTiltZ;

      frameRigs.push({
        pivotGroup,
        frameGroup,
        shadowMesh,
        baseTiltZ,
        angleZ: baseTiltZ,
        velZ: 0,
        angleY: 0,
        velY: 0,
        angleX: 0,
        velX: 0,
        inertiaScale: 0.92 + (idx % 3) * 0.07,
      });
    });

    physicsRef.current.frameRigs = frameRigs;

    // Pre-warm shaders on GPU devices
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.position.z = w < 640 ? 9.6 : 8.4;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // WebGL context loss safety
    const onContextLost = (e: Event) => {
      e.preventDefault();
    };
    const onContextRestored = () => {
      renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || 560);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    // Pointer Swipe / Drag + Click-to-Center + Wheel Interaction
    const canvasEl = renderer.domElement;

    const onPointerDown = (e: PointerEvent) => {
      const st = physicsRef.current;
      st.dragging = true;
      st.dragStartClientX = e.clientX;
      st.dragStartScrollX = st.targetScrollX;
      st.lastClientX = e.clientX;
      st.lastTimeMs = performance.now();
      st.movedDist = 0;
      st.velX = 0;
      canvasEl.setPointerCapture(e.pointerId);
      canvasEl.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      const st = physicsRef.current;
      if (!st.dragging) return;
      const now = performance.now();
      const dxPx = e.clientX - st.lastClientX;
      const dtMs = Math.max(8, now - st.lastTimeMs);
      st.movedDist += Math.abs(dxPx);

      const worldPerPx = st.spacing / Math.max(260, (container.clientWidth || 800) * 0.36);
      const maxScroll = (total - 1) * st.spacing;
      const rawTarget = st.dragStartScrollX - (e.clientX - st.dragStartClientX) * worldPerPx;

      // Soft rubber-band past edges
      if (rawTarget < 0) {
        st.targetScrollX = rawTarget * 0.32;
      } else if (rawTarget > maxScroll) {
        st.targetScrollX = maxScroll + (rawTarget - maxScroll) * 0.32;
      } else {
        st.targetScrollX = rawTarget;
      }

      st.velX = (-dxPx * worldPerPx) / (dtMs / 1000);
      st.lastClientX = e.clientX;
      st.lastTimeMs = now;
    };

    const onPointerUp = (e: PointerEvent) => {
      const st = physicsRef.current;
      if (!st.dragging) return;
      st.dragging = false;
      canvasEl.style.cursor = 'grab';
      try {
        canvasEl.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if not captured
      }

      const maxScroll = (total - 1) * st.spacing;
      if (st.movedDist < 8) {
        // Tap / Click on a frame -> center it & give it a gentle physical swing!
        const rect = canvasEl.getBoundingClientRect();
        _pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        _pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        _raycaster.setFromCamera(_pointerNdc, camera);
        const hits = _raycaster.intersectObjects(hitTargets, false);
        if (hits.length > 0) {
          const hitIdx = hits[0].object.userData.slideIndex as number | undefined;
          if (typeof hitIdx === 'number') {
            const rig = st.frameRigs[hitIdx];
            if (rig) {
              rig.velY += (hitIdx % 2 === 0 ? 1 : -1) * 1.4;
              rig.velZ += 0.45;
            }
            st.targetScrollX = hitIdx * st.spacing;
            st.activeIndex = hitIdx;
            setActiveIndex(hitIdx);
          }
        }
        return;
      }

      // Momentum throw + snap to nearest frame
      const projected = st.targetScrollX + st.velX * 0.24;
      const clamped = Math.max(0, Math.min(maxScroll, projected));
      const nearestIdx = Math.round(clamped / st.spacing);
      st.targetScrollX = nearestIdx * st.spacing;
      st.activeIndex = nearestIdx;
      setActiveIndex(nearestIdx);
    };

    const onWheel = (e: WheelEvent) => {
      // Only intercept clearly horizontal gestures so vertical page scrolling remains fluid
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.1 && Math.abs(e.deltaX) > 4) {
        e.preventDefault();
        const st = physicsRef.current;
        const maxScroll = (total - 1) * st.spacing;
        st.targetScrollX = Math.max(
          0,
          Math.min(maxScroll, st.targetScrollX + e.deltaX * 0.008)
        );
        const nearestIdx = Math.round(st.targetScrollX / st.spacing);
        if (nearestIdx !== st.activeIndex) {
          st.activeIndex = nearestIdx;
          setActiveIndex(nearestIdx);
        }
      }
    };

    canvasEl.style.cursor = 'grab';
    canvasEl.addEventListener('pointerdown', onPointerDown);
    canvasEl.addEventListener('pointermove', onPointerMove);
    canvasEl.addEventListener('pointerup', onPointerUp);
    canvasEl.addEventListener('pointercancel', onPointerUp);
    canvasEl.addEventListener('wheel', onWheel, { passive: false });

    // Real-time Coupled Pendulum Physics Animation Loop
    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync?.(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const poll = () => {
        if (disposed) return;
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();
      const st = physicsRef.current;

      // Track horizontal spring glide
      const prevScrollX = st.scrollX;
      const followRate = st.dragging ? 18 : 7.5;
      st.scrollX = THREE.MathUtils.damp(st.scrollX, st.targetScrollX, followRate, dt);
      const currentTrackVel = dt > 0.0001 ? (st.scrollX - prevScrollX) / dt : 0;
      const trackAccel = dt > 0.0001 ? (currentTrackVel - st.prevVelX) / dt : 0;
      st.prevVelX = currentTrackVel;

      galleryTrack.position.x = -st.scrollX;

      const impulseBurst = st.requestImpulse;
      st.requestImpulse = 0;

      // Update each hanging frame's coupled 3D pendulum physics
      for (let i = 0; i < st.frameRigs.length; i++) {
        const rig = st.frameRigs[i];

        if (prefersReduced) {
          rig.pivotGroup.rotation.set(0, 0, rig.baseTiltZ);
          continue;
        }

        // Subtle air breeze at rest + real swipe acceleration torque
        const microBreeze = Math.sin(elapsed * 1.15 + i * 1.7) * 0.008;
        const restZ = rig.baseTiltZ + microBreeze;

        // Pendulum restoring spring + damping (g/L ~ 24, damping ~ 2.15 for realistic slow settle)
        const stiffnessZ = 24 * rig.inertiaScale;
        const dampingZ = 2.15;
        const accZ =
          -stiffnessZ * (rig.angleZ - restZ) -
          dampingZ * rig.velZ +
          THREE.MathUtils.clamp(trackAccel * 0.026, -9.5, 9.5) * rig.inertiaScale +
          impulseBurst * 2.2;

        rig.velZ += accZ * dt;
        rig.angleZ = THREE.MathUtils.clamp(rig.angleZ + rig.velZ * dt, -0.52, 0.52);

        // 3D torsional yaw twist (rotateY) from swipe velocity so the beveled edges gleam in 3D
        const targetY = THREE.MathUtils.clamp(-currentTrackVel * 0.042, -0.45, 0.45);
        const accY = 26 * (targetY - rig.angleY) - 4.2 * rig.velY;
        rig.velY += accY * dt;
        rig.angleY = THREE.MathUtils.clamp(rig.angleY + rig.velY * dt, -0.55, 0.55);

        // Subtle forward/back pendulum pitch (rotateX) proportional to swipe energy
        const targetX = Math.min(0.14, Math.abs(currentTrackVel) * 0.012);
        const accX = 22 * (targetX - rig.angleX) - 3.8 * rig.velX;
        rig.velX += accX * dt;
        rig.angleX = THREE.MathUtils.clamp(rig.angleX + rig.velX * dt, -0.22, 0.22);

        rig.pivotGroup.rotation.z = rig.angleZ;
        rig.pivotGroup.rotation.x = rig.angleX;
        rig.frameGroup.rotation.y = rig.angleY;

        // Wall shadow drifts slightly opposite the swing for extra 3D depth
        rig.shadowMesh.position.x = 0.08 - rig.angleZ * 0.35;
        rig.shadowMesh.position.y = -2.35 - rig.angleX * 0.15;
      }

      renderer.render(scene, camera);
      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      canvasEl.removeEventListener('pointerdown', onPointerDown);
      canvasEl.removeEventListener('pointermove', onPointerMove);
      canvasEl.removeEventListener('pointerup', onPointerUp);
      canvasEl.removeEventListener('pointercancel', onPointerUp);
      canvasEl.removeEventListener('wheel', onWheel);
      canvasEl.removeEventListener('webglcontextlost', onContextLost);
      canvasEl.removeEventListener('webglcontextrestored', onContextRestored);

      createdGeometries.forEach((g) => g.dispose());
      createdMaterials.forEach((m) => m.dispose());
      createdTextures.forEach((t) => t.dispose());
      renderer.dispose();
      if (canvasEl.parentNode === container) {
        container.removeChild(canvasEl);
      }
    };
  }, [total]);

  const activeSlide = STORY_SLIDES[activeIndex];

  return (
    <section
      id="our-story"
      aria-labelledby="our-story-heading"
      className="shahi-floral-wall relative w-full pt-14 sm:pt-20 pb-16 overflow-hidden"
    >
      <div className="px-5 sm:px-8 text-center max-w-3xl mx-auto">
        <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#8c6323]">
          Our Journey
        </p>
        <h2
          id="our-story-heading"
          className="mt-1.5 text-3xl sm:text-5xl font-semibold text-[#55081d] text-balance"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Our Story
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#6b483d]">
          Swipe or drag the hanging frames to watch them swing &amp; settle
        </p>
      </div>

      {/* Full-Width Three.js 3D Hanging Frames Stage */}
      {!webglUnavailable ? (
        <div
          ref={mountRef}
          aria-roledescription="carousel"
          aria-label="Interactive 3D hanging couple photo frames"
          className="relative mt-4 w-full h-[460px] sm:h-[540px] lg:h-[580px] select-none"
        />
      ) : (
        /* Graceful fallback if WebGL is disabled */
        <div className="mt-8 max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STORY_SLIDES.filter((s) => s.kind === 'photo').map((slide) => (
            <figure
              key={slide.id}
              className="bg-[#56061b] p-3.5 shadow-xl rounded-xs border border-[#8e223d]"
            >
              <div className="bg-[#fbf4e7] p-3 text-center">
                {slide.image && (
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    referrerPolicy="no-referrer"
                    className="w-full aspect-[4/5] object-cover"
                  />
                )}
                <figcaption
                  className="mt-3 text-lg italic text-[#55081d]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {slide.hashtag}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      )}

      {/* Active Frame Caption + Navigation Controls */}
      <div className="mt-2 px-5 max-w-xl mx-auto text-center">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8c6323]">
          {activeSlide.subcaption}
        </p>
        <p
          className="mt-1.5 text-lg sm:text-xl italic text-[#55081d]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {activeSlide.caption}
        </p>

        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goToIndex(activeIndex - 1)}
            aria-label="Previous hanging frame"
            className="min-w-[44px] min-h-[44px] rounded-full border border-[#c49746]/80 bg-[#fcf4e6] text-[#55081d] flex items-center justify-center shadow-xs hover:bg-[#55081d] hover:text-[#f8e6c2] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#55081d]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2" role="tablist" aria-label="Story frames">
            {STORY_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`View frame ${idx + 1}: ${slide.chapter}`}
                onClick={() => goToIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex
                    ? 'w-7 bg-[#55081d]'
                    : 'w-2.5 bg-[#c49746]/55 hover:bg-[#c49746]'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goToIndex(activeIndex + 1)}
            aria-label="Next hanging frame"
            className="min-w-[44px] min-h-[44px] rounded-full border border-[#c49746]/80 bg-[#fcf4e6] text-[#55081d] flex items-center justify-center shadow-xs hover:bg-[#55081d] hover:text-[#f8e6c2] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#55081d]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Couple's Handwritten-Tone Note */}
      <div className="mt-10 px-6 max-w-2xl mx-auto text-center">
        <FloralDivider className="mb-5" />
        <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#8c6323]">
          A Note From Us
        </p>
        <p
          className="mt-2.5 text-lg sm:text-xl italic text-[#521825] leading-relaxed"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          “{COUPLE_INFO.coupleNote}”
        </p>
      </div>
    </section>
  );
};
