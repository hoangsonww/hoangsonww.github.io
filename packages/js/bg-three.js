/**
 * Scroll-reactive Three.js background — "geodesic network".
 *
 * The centerpiece is a real geodesic icosphere: its actual triangulation edges
 * form a glowing wireframe net and its vertices are glowing nodes. The surface
 * breathes (vertices are displaced along their normals by layered noise) and the
 * whole structure rotates. A larger, sparser icosphere shell counter-rotates
 * around it for depth, with an ambient dust field behind.
 *
 * Because the edges/nodes come from genuine sphere geometry (not random points),
 * the structure reads as intentional 3D art rather than scattered lines.
 *
 * Reactivity:
 *   - Scroll  -> rotation (a full turn over the page), zoom, and palette
 *                progression (cyan -> violet). This keeps motion harmonic and
 *                tied to scroll across the whole page.
 *   - Pointer -> parallax tilt.
 *   - Idle    -> continuous slow rotation + surface breathing + node twinkle.
 *   - Theme   -> palette eases between light/dark (tracks body.dark-theme).
 *               In light mode the backdrop stays pure (no darkening overlay).
 *
 * Guards: respects prefers-reduced-motion, caps DPR, pauses while hidden, and
 * silently no-ops (CSS fallback color stays) if WebGL is unavailable.
 */

import * as THREE from 'three';

const canvas = document.getElementById('bg-canvas');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ *
 * Theme palettes. Dark mode uses additive blending for neon glow and a
 * subtle vignette; light mode uses normal blending with darker, saturated
 * colors and a PURE flat backdrop (no darkening). Each theme defines a
 * start->end color the scroll position interpolates across.
 * ------------------------------------------------------------------ */
const PALETTES = {
  dark: {
    base: new THREE.Color(0x05080f),
    nodeStart: new THREE.Color(0x4ce8ff),
    nodeEnd: new THREE.Color(0xb070ff),
    lineStart: new THREE.Color(0x2bd2ff),
    lineEnd: new THREE.Color(0x8a6cff),
    dust: new THREE.Color(0x9fe9ff),
    additive: true,
    nodeOpacity: 0.85,
    lineOpacity: 0.32,
    dustOpacity: 0.4,
    darken: 0.28, // backdrop edge vignette
    glow: 0.5, // backdrop center glow
  },
  light: {
    base: new THREE.Color(0xffffff), // pure white page background
    nodeStart: new THREE.Color(0x37b0cf), // lighter mid cyan (was dark teal)
    nodeEnd: new THREE.Color(0x7b70de), // lighter periwinkle (was dark indigo)
    lineStart: new THREE.Color(0x44aec6),
    lineEnd: new THREE.Color(0x8a80e2),
    dust: new THREE.Color(0x6cc0d6),
    additive: false,
    nodeOpacity: 0.55,
    lineOpacity: 0.22,
    dustOpacity: 0.0, // no dust haze on white
    darken: 0.0, // keep light backdrop pure
    glow: 0.0,
  },
};

const isDark = () => document.body.classList.contains('dark-theme');
const theme = () => PALETTES[isDark() ? 'dark' : 'light'];

/* ------------------------------------------------------------------ *
 * Shared GLSL: breathing displacement along the sphere normal.
 * ------------------------------------------------------------------ */
const DISPLACE_GLSL = /* glsl */ `
  float wob(vec3 d, float t) {
    float n = sin(dot(d, vec3(1.3, 1.7, 0.9)) + t);
    n += 0.5 * sin(dot(d, vec3(-1.1, 0.8, 1.9)) - t * 1.3);
    n += 0.25 * sin(dot(d, vec3(2.1, -1.4, 0.6)) + t * 0.7);
    return n * 0.5714; // normalize to ~[-1, 1]
  }
  vec3 displace(vec3 p, float t, float amp, float freq) {
    vec3 d = normalize(p + 0.0001);
    return p + d * wob(d * freq, t) * amp;
  }
`;

const POINT_VERT = /* glsl */ `
  uniform float uTime, uSize, uPixelRatio, uAmp, uFreq, uSpeed;
  attribute float aScale, aPhase;
  varying float vFade, vTw;
  ${DISPLACE_GLSL}
  void main() {
    vec3 p = displace(position, uTime * uSpeed, uAmp, uFreq);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;
    vFade = smoothstep(64.0, 2.0, dist);
    vTw = 0.6 + 0.4 * sin(uTime * 1.8 + aPhase);
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / max(dist, 0.1));
    gl_Position = projectionMatrix * mv;
  }
`;

const POINT_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform vec2 uResolution;
  uniform float uCenterFade;
  varying float vFade, vTw;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float halo = smoothstep(0.5, 0.22, d) * 0.32; // tighter, crisper dot
    float a = (core + halo) * uOpacity * vFade * vTw;
    // Calm the network behind the central text zone (fades toward the base
    // color, so it never darkens a light background).
    vec2 sc = gl_FragCoord.xy / uResolution;
    float cd = length((sc - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0));
    a *= mix(1.0, smoothstep(0.0, 0.62, cd), uCenterFade);
    if (a < 0.003) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

const LINE_VERT = /* glsl */ `
  uniform float uTime, uAmp, uFreq, uSpeed;
  attribute float aPhase;
  varying float vFade, vTw;
  ${DISPLACE_GLSL}
  void main() {
    vec3 p = displace(position, uTime * uSpeed, uAmp, uFreq);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;
    vFade = smoothstep(64.0, 2.0, dist);
    vTw = 0.55 + 0.45 * sin(uTime * 1.2 + aPhase);
    gl_Position = projectionMatrix * mv;
  }
`;

const LINE_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform vec2 uResolution;
  uniform float uCenterFade;
  varying float vFade, vTw;
  void main() {
    float a = uOpacity * vFade * vTw;
    vec2 sc = gl_FragCoord.xy / uResolution;
    float cd = length((sc - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0));
    a *= mix(1.0, smoothstep(0.0, 0.62, cd), uCenterFade);
    gl_FragColor = vec4(uColor, a);
  }
`;

const BG_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const BG_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec3 uBase;
  uniform vec3 uGlow;
  uniform float uGlowAmt;
  uniform float uDarken;
  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p * vec2(1.35, 1.0));
    float vign = smoothstep(0.95, 0.05, r);
    // uDarken=0 (light) -> pure flat base; >0 (dark) -> subtle edge vignette.
    vec3 col = mix(uBase * (1.0 - uDarken), uBase, vign);
    col += uGlow * pow(vign, 2.2) * uGlowAmt;
    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ------------------------------------------------------------------ *
 * Builders
 * ------------------------------------------------------------------ */
// Deduplicate the (non-indexed) icosphere vertices so each node is a real,
// unique sphere vertex rather than a face-duplicated point.
function uniqueVertices(geo) {
  const a = geo.attributes.position.array;
  const seen = new Set();
  const out = [];
  for (let i = 0; i < a.length; i += 3) {
    const key = `${a[i].toFixed(3)},${a[i + 1].toFixed(3)},${a[i + 2].toFixed(3)}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(a[i], a[i + 1], a[i + 2]);
    }
  }
  return new Float32Array(out);
}

function randAttr(count) {
  const phase = new Float32Array(count);
  const scale = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    phase[i] = Math.random() * Math.PI * 2;
    scale[i] = Math.random() * 1.5 + 0.6;
  }
  return { phase, scale };
}

function pointMaterial(uniforms, additive) {
  return new THREE.ShaderMaterial({
    vertexShader: POINT_VERT,
    fragmentShader: POINT_FRAG,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
}

function lineMaterial(uniforms, additive) {
  return new THREE.ShaderMaterial({
    vertexShader: LINE_VERT,
    fragmentShader: LINE_FRAG,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
}

/* ------------------------------------------------------------------ *
 * Boot
 * ------------------------------------------------------------------ */
function init() {
  if (!canvas) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  } catch (err) {
    console.warn('[bg-three] WebGL unavailable, skipping 3D background.', err);
    return;
  }

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight, true);
  renderer.autoClear = false;

  const pal = theme();
  const detail = reducedMotion ? 1 : window.innerWidth < 768 ? 2 : 2;
  // Shared screen resolution + center-fade strength (calms the network behind
  // central text). Kept in one place so all materials and resize stay in sync.
  const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
  const CENTER_FADE = 0.78;

  /* --- Backdrop pass --- */
  const bgScene = new THREE.Scene();
  const bgCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const bgUniforms = {
    uBase: { value: pal.base.clone() },
    uGlow: { value: pal.nodeStart.clone() },
    uGlowAmt: { value: pal.glow },
    uDarken: { value: pal.darken },
  };
  bgScene.add(
    new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ vertexShader: BG_VERT, fragmentShader: BG_FRAG, uniforms: bgUniforms, depthTest: false, depthWrite: false })
    )
  );

  /* --- Network pass --- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 6.2);

  const core = new THREE.Group(); // main icosphere (nodes + edges)
  const shell = new THREE.Group(); // outer counter-rotating sphere
  const dustGroup = new THREE.Group();
  scene.add(core, shell, dustGroup);

  // Shared morph params (eased + scroll-driven each frame).
  const morph = { amp: 0.22, freq: 2.1, speed: 0.5 };

  // --- Core icosphere: edges (real triangulation) ---
  const ico = new THREE.IcosahedronGeometry(2.3, detail);
  const wire = new THREE.WireframeGeometry(ico);
  const wireCount = wire.attributes.position.count;
  const wirePhase = new Float32Array(wireCount);
  for (let i = 0; i < wireCount; i++) wirePhase[i] = Math.random() * Math.PI * 2;
  wire.setAttribute('aPhase', new THREE.BufferAttribute(wirePhase, 1));
  const lineUniforms = {
    uTime: { value: 0 },
    uAmp: { value: morph.amp },
    uFreq: { value: morph.freq },
    uSpeed: { value: morph.speed },
    uColor: { value: pal.lineStart.clone() },
    uOpacity: { value: pal.lineOpacity },
    uResolution: { value: resolution },
    uCenterFade: { value: CENTER_FADE },
  };
  core.add(new THREE.LineSegments(wire, lineMaterial(lineUniforms, pal.additive)));

  // --- Core icosphere: nodes at unique vertices ---
  const nodePos = uniqueVertices(ico);
  const nodeN = nodePos.length / 3;
  const nodeRand = randAttr(nodeN);
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
  nodeGeo.setAttribute('aScale', new THREE.BufferAttribute(nodeRand.scale, 1));
  nodeGeo.setAttribute('aPhase', new THREE.BufferAttribute(nodeRand.phase, 1));
  const nodeUniforms = {
    uTime: { value: 0 },
    uSize: { value: 52 },
    uPixelRatio: { value: pixelRatio },
    uAmp: { value: morph.amp },
    uFreq: { value: morph.freq },
    uSpeed: { value: morph.speed },
    uColor: { value: pal.nodeStart.clone() },
    uOpacity: { value: pal.nodeOpacity },
    uResolution: { value: resolution },
    uCenterFade: { value: CENTER_FADE },
  };
  core.add(new THREE.Points(nodeGeo, pointMaterial(nodeUniforms, pal.additive)));

  // --- Outer shell: sparse, gently morphing, counter-rotating ---
  const shellGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(4.3, 1));
  const shellCount = shellGeo.attributes.position.count;
  const shellPhase = new Float32Array(shellCount);
  for (let i = 0; i < shellCount; i++) shellPhase[i] = Math.random() * Math.PI * 2;
  shellGeo.setAttribute('aPhase', new THREE.BufferAttribute(shellPhase, 1));
  const shellUniforms = {
    uTime: { value: 0 },
    uAmp: { value: 0.35 },
    uFreq: { value: 1.4 },
    uSpeed: { value: 0.35 },
    uColor: { value: pal.lineStart.clone() },
    uOpacity: { value: pal.lineOpacity * 0.6 },
    uResolution: { value: resolution },
    uCenterFade: { value: CENTER_FADE * 0.6 },
  };
  shell.add(new THREE.LineSegments(shellGeo, lineMaterial(shellUniforms, pal.additive)));

  // --- Ambient dust (depth, no morph) ---
  const dustCount = reducedMotion ? 250 : window.innerWidth < 768 ? 500 : 900;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3 + 0] = (Math.random() - 0.5) * 34;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 22;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 6;
  }
  const dustRand = randAttr(dustCount);
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute('aScale', new THREE.BufferAttribute(dustRand.scale, 1));
  dustGeo.setAttribute('aPhase', new THREE.BufferAttribute(dustRand.phase, 1));
  const dustUniforms = {
    uTime: { value: 0 },
    uSize: { value: 20 },
    uPixelRatio: { value: pixelRatio },
    uAmp: { value: 0 },
    uFreq: { value: 1 },
    uSpeed: { value: 0 },
    uColor: { value: pal.dust.clone() },
    uOpacity: { value: pal.dustOpacity },
    uResolution: { value: resolution },
    uCenterFade: { value: 0.0 }, // dust stays evenly spread
  };
  dustGroup.add(new THREE.Points(dustGeo, pointMaterial(dustUniforms, pal.additive)));

  // Collect every material so theme toggles can swap blend modes at once.
  const blendTargets = [];
  core.traverse(o => o.material && blendTargets.push(o.material));
  shell.traverse(o => o.material && blendTargets.push(o.material));
  dustGroup.traverse(o => o.material && blendTargets.push(o.material));

  /* ------------------------------ State ------------------------------ */
  let scrollTarget = 0;
  let scroll = 0;
  const pointer = { x: 0, y: 0 };
  const pe = { x: 0, y: 0 };

  const cur = {
    base: pal.base.clone(),
    node: pal.nodeStart.clone(),
    line: pal.lineStart.clone(),
    dust: pal.dust.clone(),
    nodeOpacity: pal.nodeOpacity,
    lineOpacity: pal.lineOpacity,
    dustOpacity: pal.dustOpacity,
    darken: pal.darken,
    glow: pal.glow,
  };
  const tNode = new THREE.Color();
  const tLine = new THREE.Color();

  function readScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollTarget = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
  }

  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, true);
    resolution.set(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    readScroll();
  }

  function onPointer(e) {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  }

  function syncBlending() {
    const b = theme().additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    blendTargets.forEach(m => {
      if (m.blending !== b) {
        m.blending = b;
        m.needsUpdate = true;
      }
    });
  }

  window.addEventListener('scroll', readScroll, { passive: true });
  window.addEventListener('resize', onResize);
  if (!reducedMotion) window.addEventListener('pointermove', onPointer, { passive: true });
  new MutationObserver(syncBlending).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  /* ------------------------------ Render ----------------------------- */
  const clock = new THREE.Clock();

  function frame() {
    const t = clock.getElapsedTime();
    const k = 0.07;

    scroll += (scrollTarget - scroll) * 0.06;
    pe.x += (pointer.x - pe.x) * 0.05;
    pe.y += (pointer.y - pe.y) * 0.05;

    const p = theme();
    tNode.copy(p.nodeStart).lerp(p.nodeEnd, scroll);
    tLine.copy(p.lineStart).lerp(p.lineEnd, scroll);
    cur.base.lerp(p.base, k);
    cur.node.lerp(tNode, k);
    cur.line.lerp(tLine, k);
    cur.dust.lerp(p.dust, k);
    cur.nodeOpacity += (p.nodeOpacity - cur.nodeOpacity) * k;
    cur.lineOpacity += (p.lineOpacity - cur.lineOpacity) * k;
    cur.dustOpacity += (p.dustOpacity - cur.dustOpacity) * k;
    cur.darken += (p.darken - cur.darken) * k;
    cur.glow += (p.glow - cur.glow) * k;

    nodeUniforms.uTime.value = t;
    nodeUniforms.uColor.value.copy(cur.node);
    nodeUniforms.uOpacity.value = cur.nodeOpacity;
    lineUniforms.uTime.value = t;
    lineUniforms.uColor.value.copy(cur.line);
    lineUniforms.uOpacity.value = cur.lineOpacity;
    shellUniforms.uTime.value = t;
    shellUniforms.uColor.value.copy(cur.line);
    shellUniforms.uOpacity.value = cur.lineOpacity * 0.6;
    dustUniforms.uTime.value = t;
    dustUniforms.uColor.value.copy(cur.dust);
    dustUniforms.uOpacity.value = cur.dustOpacity;

    bgUniforms.uBase.value.copy(cur.base);
    bgUniforms.uGlow.value.copy(cur.node);
    bgUniforms.uGlowAmt.value = cur.glow;
    bgUniforms.uDarken.value = cur.darken;
    renderer.setClearColor(cur.base, 1);

    // Surface morph swells gently with scroll for extra life downpage.
    const amp = 0.22 + scroll * 0.18;
    nodeUniforms.uAmp.value = amp;
    lineUniforms.uAmp.value = amp;

    // Rotation: continuous + a full turn over the page (harmonic with scroll).
    core.rotation.y = t * 0.06 + scroll * Math.PI * 2;
    core.rotation.x = Math.sin(t * 0.1) * 0.12 + scroll * 0.6 + pe.y * 0.25;
    core.rotation.z = pe.x * 0.15;
    shell.rotation.y = -t * 0.045 - scroll * Math.PI;
    shell.rotation.x = Math.cos(t * 0.08) * 0.15;
    dustGroup.rotation.y = t * 0.01 + pe.x * 0.05;

    // Subtle zoom-in as you scroll.
    const s = 1 + scroll * 0.35;
    core.scale.setScalar(s);
    shell.scale.setScalar(1 + scroll * 0.22);
    camera.position.x = pe.x * 0.9;
    camera.position.y = -pe.y * 0.7;
    camera.lookAt(0, 0, 0);

    renderer.clear();
    renderer.render(bgScene, bgCam);
    renderer.render(scene, camera);
  }

  let rafId = null;
  const start = () => {
    if (rafId == null) loop();
  };
  const stop = () => {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
  function loop() {
    frame();
    rafId = requestAnimationFrame(loop);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (!reducedMotion) start();
  });

  onResize();

  if (reducedMotion) {
    scroll = scrollTarget;
    frame();
  } else {
    start();
  }
}

init();
