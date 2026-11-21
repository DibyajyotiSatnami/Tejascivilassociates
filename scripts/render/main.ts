/**
 * Offline architectural renderer.
 *
 * Builds simple, original procedural architecture scenes with Three.js and
 * renders them to still images. Used to produce the temporary demonstration
 * visuals for the website (see scripts/render-images.mjs). These are NOT
 * photographs of real projects.
 */
import * as THREE from 'three'

type Shot = { camera: THREE.PerspectiveCamera }

const params = new URLSearchParams(location.search)
const SHOT = params.get('shot') ?? 'villa-dusk'
const W = Number(params.get('w') ?? 1600)
const H = Number(params.get('h') ?? 900)

// ---------------------------------------------------------------------------
// Deterministic random
// ---------------------------------------------------------------------------
let seed = 1337
for (const c of SHOT) seed = (seed * 31 + c.charCodeAt(0)) >>> 0
function rand() {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 4294967296
}
const rr = (a: number, b: number) => a + (b - a) * rand()

// ---------------------------------------------------------------------------
// Renderer / scene
// ---------------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
renderer.setPixelRatio(1)
renderer.setSize(W, H)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

// ---------------------------------------------------------------------------
// Procedural textures
// ---------------------------------------------------------------------------
function canvasTex(size: number, draw: (g: CanvasRenderingContext2D, s: number) => void, repeat = 1) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  draw(g, size)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat, repeat)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

function speckle(g: CanvasRenderingContext2D, s: number, n: number, alpha: number, light = true) {
  for (let i = 0; i < n; i++) {
    const v = light ? 255 : 0
    g.fillStyle = `rgba(${v},${v},${v},${rand() * alpha})`
    const r = rand() * 2.2 + 0.3
    g.fillRect(rand() * s, rand() * s, r, r)
  }
}

const tex = {
  concrete: (repeat = 1) =>
    canvasTex(
      512,
      (g, s) => {
        g.fillStyle = '#b9b4ab'
        g.fillRect(0, 0, s, s)
        for (let i = 0; i < 40; i++) {
          g.fillStyle = `rgba(${rand() > 0.5 ? 255 : 60},${rand() > 0.5 ? 250 : 60},240,${rand() * 0.05})`
          g.beginPath()
          g.arc(rand() * s, rand() * s, rr(20, 120), 0, Math.PI * 2)
          g.fill()
        }
        speckle(g, s, 9000, 0.12, false)
        speckle(g, s, 6000, 0.1, true)
        // board-form joints
        for (let y = 0; y < s; y += s / 8) {
          g.fillStyle = 'rgba(0,0,0,0.07)'
          g.fillRect(0, y, s, 1.5)
        }
      },
      repeat,
    ),
  plaster: (repeat = 1) =>
    canvasTex(
      256,
      (g, s) => {
        g.fillStyle = '#ebe7df'
        g.fillRect(0, 0, s, s)
        speckle(g, s, 4000, 0.05, false)
      },
      repeat,
    ),
  stone: (repeat = 1) =>
    canvasTex(
      1024,
      (g, s) => {
        g.fillStyle = '#5b5249'
        g.fillRect(0, 0, s, s)
        let y = 0
        while (y < s) {
          const h = rr(18, 46)
          let x = -rr(0, 80)
          while (x < s) {
            const w = rr(70, 220)
            const t = rr(0, 1)
            const r = 150 + t * 46,
              gg = 140 + t * 42,
              b = 124 + t * 38
            g.fillStyle = `rgb(${r},${gg},${b})`
            g.fillRect(x + 2, y + 2, w - 4, h - 4)
            g.fillStyle = `rgba(0,0,0,${rr(0, 0.12)})`
            g.fillRect(x + 2, y + h - 8, w - 4, 6)
            x += w
          }
          y += h
        }
        speckle(g, s, 20000, 0.15, false)
      },
      repeat,
    ),
  wood: (repeat = 1) =>
    canvasTex(
      512,
      (g, s) => {
        const n = 16
        for (let i = 0; i < n; i++) {
          const t = rand()
          g.fillStyle = `rgb(${120 + t * 40},${78 + t * 26},${48 + t * 16})`
          g.fillRect((i * s) / n, 0, s / n, s)
          g.fillStyle = 'rgba(20,10,5,0.55)'
          g.fillRect((i * s) / n, 0, 3, s)
          for (let k = 0; k < 14; k++) {
            g.fillStyle = `rgba(40,20,10,${rand() * 0.2})`
            g.fillRect((i * s) / n + rand() * (s / n), 0, 1, s)
          }
        }
      },
      repeat,
    ),
  floorWood: (repeat = 1) =>
    canvasTex(
      1024,
      (g, s) => {
        const rows = 10
        for (let r = 0; r < rows; r++) {
          let x = -rr(0, 300)
          while (x < s) {
            const w = rr(260, 520)
            const t = rand()
            g.fillStyle = `rgb(${168 + t * 30},${128 + t * 22},${92 + t * 18})`
            g.fillRect(x, (r * s) / rows, w, s / rows)
            for (let k = 0; k < 30; k++) {
              g.fillStyle = `rgba(80,50,30,${rand() * 0.12})`
              g.fillRect(x, (r * s) / rows + rand() * (s / rows), w, 1)
            }
            g.fillStyle = 'rgba(40,25,15,0.4)'
            g.fillRect(x, (r * s) / rows, 2, s / rows)
            x += w
          }
          g.fillStyle = 'rgba(40,25,15,0.4)'
          g.fillRect(0, (r * s) / rows, s, 2)
        }
      },
      repeat,
    ),
  grass: (repeat = 1) =>
    canvasTex(
      512,
      (g, s) => {
        g.fillStyle = '#4c5f33'
        g.fillRect(0, 0, s, s)
        for (let i = 0; i < 30000; i++) {
          const t = rand()
          g.fillStyle = `rgba(${60 + t * 60},${80 + t * 60},${30 + t * 30},0.5)`
          g.fillRect(rand() * s, rand() * s, 1.5, rr(1.5, 4))
        }
      },
      repeat,
    ),
  paving: (repeat = 1) =>
    canvasTex(
      512,
      (g, s) => {
        g.fillStyle = '#6f6a63'
        g.fillRect(0, 0, s, s)
        const n = 4
        for (let i = 0; i < n; i++)
          for (let j = 0; j < n * 2; j++) {
            const t = rand()
            g.fillStyle = `rgb(${190 + t * 20},${184 + t * 20},${172 + t * 20})`
            g.fillRect((i * s) / n + 2, (j * s) / (n * 2) + 2, s / n - 4, s / (n * 2) - 4)
          }
        speckle(g, s, 8000, 0.1, false)
      },
      repeat,
    ),
  dirt: (repeat = 1) =>
    canvasTex(
      512,
      (g, s) => {
        g.fillStyle = '#8a7660'
        g.fillRect(0, 0, s, s)
        for (let i = 0; i < 60; i++) {
          g.fillStyle = `rgba(${rand() > 0.5 ? 70 : 170},${rand() > 0.5 ? 55 : 150},40,${rand() * 0.1})`
          g.beginPath()
          g.arc(rand() * s, rand() * s, rr(10, 80), 0, Math.PI * 2)
          g.fill()
        }
        speckle(g, s, 20000, 0.25, false)
        speckle(g, s, 8000, 0.15, true)
      },
      repeat,
    ),
  asphalt: (repeat = 1) =>
    canvasTex(
      256,
      (g, s) => {
        g.fillStyle = '#3a3b3d'
        g.fillRect(0, 0, s, s)
        speckle(g, s, 9000, 0.15, true)
      },
      repeat,
    ),
  grid: (repeat = 1) =>
    canvasTex(
      1024,
      (g, s) => {
        g.fillStyle = '#efece6'
        g.fillRect(0, 0, s, s)
        g.strokeStyle = 'rgba(60,70,80,0.18)'
        for (let i = 0; i <= 64; i++) {
          g.lineWidth = i % 8 === 0 ? 2 : 0.7
          g.beginPath()
          g.moveTo((i * s) / 64, 0)
          g.lineTo((i * s) / 64, s)
          g.moveTo(0, (i * s) / 64)
          g.lineTo(s, (i * s) / 64)
          g.stroke()
        }
      },
      repeat,
    ),
}

// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------
const std = (o: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(o)
const M = {
  concrete: std({ map: tex.concrete(1), roughness: 0.85 }),
  plaster: std({ map: tex.plaster(2), roughness: 0.9 }),
  stone: std({ map: tex.stone(1), roughness: 0.9 }),
  wood: std({ map: tex.wood(1), roughness: 0.7 }),
  darkMetal: std({ color: 0x1d1e20, roughness: 0.45, metalness: 0.6 }),
  bronze: std({ color: 0xa88654, roughness: 0.35, metalness: 1 }),
  white: std({ color: 0xf1eee8, roughness: 0.75 }),
  grass: std({ map: tex.grass(30), roughness: 1 }),
  paving: std({ map: tex.paving(8), roughness: 0.8 }),
  dirt: std({ map: tex.dirt(12), roughness: 1 }),
  asphalt: std({ map: tex.asphalt(30), roughness: 0.9 }),
  foliage: std({ color: 0x3d5230, roughness: 0.95 }),
  foliage2: std({ color: 0x55663a, roughness: 0.95 }),
  trunk: std({ color: 0x4a3a2c, roughness: 1 }),
  water: new THREE.MeshPhysicalMaterial({ color: 0x2a6a76, roughness: 0.03, metalness: 0.1, clearcoat: 1, envMapIntensity: 1.6 }),
  glass: new THREE.MeshPhysicalMaterial({
    color: 0x1c252b,
    roughness: 0.03,
    metalness: 0.2,
    transparent: true,
    opacity: 0.42,
    envMapIntensity: 2.2,
    clearcoat: 1,
  }),
  glassOpaque: new THREE.MeshPhysicalMaterial({ color: 0x1e2a31, roughness: 0.05, metalness: 0.4, envMapIntensity: 2.4, clearcoat: 1 }),
  interior: std({ color: 0x3a2e24, emissive: 0xff9a48, emissiveIntensity: 0.0, roughness: 1 }),
  fabric: std({ color: 0xcfc6b8, roughness: 1 }),
  fabricDark: std({ color: 0x3a3632, roughness: 1 }),
  orange: std({ color: 0xd9822b, roughness: 0.5, metalness: 0.2 }),
  yellow: std({ color: 0xe0a92a, roughness: 0.5, metalness: 0.3 }),
  net: std({ color: 0x3f6b4a, roughness: 1, transparent: true, opacity: 0.55, side: THREE.DoubleSide }),
  rebar: std({ color: 0x5a3b2a, roughness: 0.8, metalness: 0.5 }),
  formwork: std({ color: 0xb98a4e, roughness: 0.9 }),
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function add<T extends THREE.Object3D>(o: T, parent: THREE.Object3D = scene): T {
  o.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) {
      c.castShadow = true
      c.receiveShadow = true
    }
  })
  parent.add(o)
  return o
}

/** Box by min-corner-ish center coordinates; uv scaled to world size for consistent textures */
function box(w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number, parent?: THREE.Object3D) {
  const geo = new THREE.BoxGeometry(w, h, d)
  // world-scale UVs (1 texture repeat ≈ 4m)
  const uv = geo.attributes.uv as THREE.BufferAttribute
  const pos = geo.attributes.position as THREE.BufferAttribute
  const nrm = geo.attributes.normal as THREE.BufferAttribute
  for (let i = 0; i < uv.count; i++) {
    const nx = Math.abs(nrm.getX(i)),
      ny = Math.abs(nrm.getY(i))
    const px = pos.getX(i),
      py = pos.getY(i),
      pz = pos.getZ(i)
    if (ny > 0.5) uv.setXY(i, px / 4, pz / 4)
    else if (nx > 0.5) uv.setXY(i, pz / 4, py / 4)
    else uv.setXY(i, px / 4, py / 4)
  }
  const m = new THREE.Mesh(geo, mat)
  m.position.set(x, y + h / 2, z)
  return add(m, parent)
}

function ground(mat: THREE.Material, size = 600) {
  const g = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat)
  g.rotation.x = -Math.PI / 2
  g.receiveShadow = true
  scene.add(g)
  return g
}

function patch(w: number, d: number, mat: THREE.Material, x: number, z: number, y = 0.02) {
  const g = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat)
  g.rotation.x = -Math.PI / 2
  g.position.set(x, y, z)
  g.receiveShadow = true
  scene.add(g)
  return g
}

/** Glass façade facing +z (or rotated) with mullions and an optional lit interior */
function facade(
  w: number,
  h: number,
  x: number,
  y: number,
  z: number,
  opts: { rotY?: number; cols?: number; rows?: number; lit?: number; mullion?: THREE.Material; depth?: number } = {},
) {
  const { rotY = 0, cols = Math.max(1, Math.round(w / 1.6)), rows = Math.max(1, Math.round(h / 3.4)), lit = 0, mullion = M.darkMetal, depth = 1.2 } = opts
  const grp = new THREE.Group()
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(w, h), M.glass)
  glass.position.set(0, h / 2, 0)
  glass.castShadow = false
  grp.add(glass)
  // interior back panel
  const intMat = M.interior.clone()
  intMat.emissiveIntensity = lit * 0.55
  const back = new THREE.Mesh(new THREE.PlaneGeometry(w, h), intMat)
  back.position.set(0, h / 2, -depth)
  const hollow = depth < 0.05
  if (!hollow) grp.add(back)
  // interior silhouettes (furniture / partitions) for depth
  for (let i = 0; i < (hollow ? 0 : Math.max(1, Math.round(w / 5))); i++) {
    if (rand() > 0.6) continue
    const fw = rr(0.8, 2.2), fh = rr(0.6, Math.min(2.2, h * 0.7))
    const f = new THREE.Mesh(new THREE.BoxGeometry(fw, fh, 0.4), M.fabricDark)
    f.position.set(rr(-w / 2 + fw, w / 2 - fw), fh / 2, -depth * rr(0.4, 0.8))
    grp.add(f)
  }
  // interior ceiling glow strip
  if (lit > 0 && !hollow) {
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(w, depth), std({ color: 0x000000, emissive: 0xffc27a, emissiveIntensity: lit * 1.2 }))
    ceil.rotation.x = Math.PI / 2
    ceil.position.set(0, h - 0.02, -depth / 2)
    grp.add(ceil)
  }
  const t = 0.07
  for (let i = 0; i <= cols; i++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(t, h, t * 1.6), mullion)
    m.position.set(-w / 2 + (i * w) / cols, h / 2, 0.02)
    grp.add(m)
  }
  for (let j = 0; j <= rows; j++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, t, t * 1.6), mullion)
    m.position.set(0, (j * h) / rows, 0.02)
    grp.add(m)
  }
  grp.position.set(x, y, z)
  grp.rotation.y = rotY
  add(grp)
  glass.castShadow = false
  back.castShadow = false
  return grp
}

function tree(x: number, z: number, s = 1, kind: 'round' | 'tall' | 'palm' = 'round') {
  const g = new THREE.Group()
  const mat = rand() > 0.5 ? M.foliage : M.foliage2
  if (kind === 'palm') {
    const h = 7 * s
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.13 * s, 0.2 * s, h, 8), M.trunk)
    trunk.position.y = h / 2
    trunk.rotation.z = rr(-0.08, 0.08)
    g.add(trunk)
    for (let i = 0; i < 9; i++) {
      const arm = new THREE.Group()
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.4 * s, 3.4 * s, 4, 1), mat)
      leaf.scale.z = 0.18
      leaf.rotation.z = -Math.PI / 2 - 0.45 // point outward along +x, drooping
      leaf.position.x = 1.5 * s
      leaf.position.y = -0.6 * s
      arm.add(leaf)
      arm.position.y = h
      arm.rotation.y = (i / 9) * Math.PI * 2 + rr(-0.2, 0.2)
      g.add(arm)
    }
  } else {
    const h = (kind === 'tall' ? 3.2 : 2.2) * s
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * s, 0.18 * s, h, 6), M.trunk)
    trunk.position.y = h / 2
    g.add(trunk)
    const n = kind === 'tall' ? 7 : 6
    for (let i = 0; i < n; i++) {
      const r = rr(1.0, 1.7) * s * (kind === 'tall' ? 0.85 : 1)
      const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 2), mat)
      blob.position.set(rr(-1, 1) * s, h + (kind === 'tall' ? rr(0.5, 4.5) : rr(0.6, 2.2)) * s, rr(-1, 1) * s)
      blob.scale.y = kind === 'tall' ? 1.25 : 0.9
      g.add(blob)
    }
  }
  g.position.set(x, 0, z)
  return add(g)
}

function shrubRow(x0: number, x1: number, z: number, s = 0.6) {
  for (let x = x0; x <= x1; x += s * 1.3) {
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(s * rr(0.8, 1.15), 1), rand() > 0.5 ? M.foliage : M.foliage2)
    b.position.set(x, s * 0.6, z + rr(-0.15, 0.15))
    b.scale.y = 0.75
    add(b)
  }
}

// ---------------------------------------------------------------------------
// Sky + lighting
// ---------------------------------------------------------------------------
type SkyOpts = { zenith: number; horizon: number; mid?: number; ground?: number; sunDir: THREE.Vector3; sunColor?: number; glow?: number }
function makeSkyMesh(o: SkyOpts) {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      zenith: { value: new THREE.Color(o.zenith) },
      horizon: { value: new THREE.Color(o.horizon) },
      midC: { value: o.mid !== undefined ? new THREE.Color(o.mid) : new THREE.Color(o.horizon).lerp(new THREE.Color(o.zenith), 0.5) },
      groundC: { value: new THREE.Color(o.ground ?? 0x2a2a2a) },
      sunDir: { value: o.sunDir.clone().normalize() },
      sunColor: { value: new THREE.Color(o.sunColor ?? 0xffd29a) },
      glow: { value: o.glow ?? 0.6 },
    },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
    fragmentShader: `
      uniform vec3 zenith; uniform vec3 horizon; uniform vec3 midC; uniform vec3 groundC; uniform vec3 sunDir; uniform vec3 sunColor; uniform float glow;
      varying vec3 vDir;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
      void main(){
        vec3 d = normalize(vDir);
        float h = d.y;
        vec3 mid = midC;
        vec3 col = mix(horizon, mid, smoothstep(-0.01, 0.16, h));
        col = mix(col, zenith, smoothstep(0.12, 0.55, h));
        col = mix(col, groundC, smoothstep(0.0, -0.08, h));
        float s = max(dot(d, normalize(sunDir)), 0.0);
        col += sunColor * (pow(s, 6.0)*0.35 + pow(s, 64.0)*0.8) * glow;
        // soft cloud bands
        float band = sin(d.x*9.0 + d.z*4.0) * sin(d.z*7.0 - d.x*3.0);
        col += vec3(1.0) * smoothstep(0.55,1.0,band) * 0.04 * smoothstep(0.02,0.25,h);
        col += (hash(gl_FragCoord.xy)-0.5)/255.0;
        gl_FragColor = vec4(col, 1.0);
      }`,
  })
  return new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), mat)
}

function setupSky(o: SkyOpts & { sunIntensity: number; hemi: number; hemiSky?: number; hemiGround?: number; fog?: number; fogDensity?: number; shadowSize?: number; exposure?: number; env?: number }) {
  const sky = makeSkyMesh(o)
  scene.add(sky)
  // environment map from the sky itself
  const envScene = new THREE.Scene()
  envScene.add(makeSkyMesh(o))
  const pm = new THREE.PMREMGenerator(renderer)
  scene.environment = pm.fromScene(envScene, 0.02).texture
  scene.environmentIntensity = o.env ?? 0.8

  const sun = new THREE.DirectionalLight(o.sunColor ?? 0xffe2b8, o.sunIntensity)
  const sd = o.sunDir.clone().normalize()
  sun.position.copy(sd.multiplyScalar(120))
  sun.castShadow = true
  const ss = o.shadowSize ?? 60
  sun.shadow.mapSize.set(4096, 4096)
  Object.assign(sun.shadow.camera, { left: -ss, right: ss, top: ss, bottom: -ss, near: 1, far: 400 })
  sun.shadow.bias = -0.0004
  sun.shadow.normalBias = 0.03
  sun.shadow.radius = 4
  scene.add(sun)
  scene.add(sun.target)
  scene.add(new THREE.HemisphereLight(o.hemiSky ?? o.zenith, o.hemiGround ?? 0x3a3128, o.hemi))
  if (o.fog) scene.fog = new THREE.FogExp2(o.fog, o.fogDensity ?? 0.004)
  renderer.toneMappingExposure = o.exposure ?? 1
  return sun
}

function cam(fov: number, pos: [number, number, number], target: [number, number, number]) {
  const c = new THREE.PerspectiveCamera(fov, W / H, 0.1, 2000)
  c.position.set(...pos)
  c.lookAt(...target)
  return c
}

// ---------------------------------------------------------------------------
// Building recipes
// ---------------------------------------------------------------------------
function villa(lit: number) {
  const water = M.water.clone()
  if (lit > 0.5) { water.emissive = new THREE.Color(0x0f7f8f); water.emissiveIntensity = 0.5 }
  // terrace & pool
  patch(40, 16, M.paving, 2, 10)
  const pool = box(16, 0.05, 5, water, 4, 0.01, 12.5)
  pool.castShadow = false
  box(16.6, 0.12, 0.3, M.white, 4, 0, 9.85)
  box(16.6, 0.12, 0.3, M.white, 4, 0, 15.15)

  // ground floor glass volume
  box(20, 0.35, 11, M.concrete, 2, 0, -1)
  facade(15, 3.2, 3.5, 0.35, 4.4, { cols: 8, rows: 1, lit, depth: 3 })
  box(20, 3.2, 0.3, M.plaster, 2, 0.35, -6.35)
  box(0.3, 3.2, 11, M.plaster, 11.85, 0.35, -1)
  facade(10, 3.2, 11.9, 0.35, -1, { rotY: Math.PI / 2, cols: 5, rows: 1, lit, depth: 3 })
  // stone feature wall
  box(5.5, 4.2, 1.0, M.stone, -6.2, 0, 3.6)
  box(1.0, 4.2, 9, M.stone, -8.4, 0, -1)

  // first floor cantilever
  const f1y = 3.55
  box(25, 0.45, 10, M.plaster, 5, f1y, -0.5)
  box(25, 3.4, 0.35, M.plaster, 5, f1y + 0.45, -5.3)
  box(25, 0.8, 10, M.plaster, 5, f1y + 3.85, -0.5) // roof fascia
  box(0.35, 3.4, 10, M.plaster, 17.32, f1y + 0.45, -0.5)
  box(0.35, 3.4, 10, M.plaster, -7.32, f1y + 0.45, -0.5)
  facade(13, 3.4, 9.5, f1y + 0.45, 4.3, { cols: 6, rows: 1, lit: lit * 0.85, depth: 3 })
  // wooden screen on left part of first floor
  box(10.5, 3.4, 0.3, M.wood, -1.9, f1y + 0.45, 4.35)
  box(1.2, 3.4, 0.35, M.plaster, 3.5, f1y + 0.45, 4.35)
  box(1.2, 3.4, 0.35, M.plaster, 16.5, f1y + 0.45, 4.35)
  facade(9, 3.4, 17.4, f1y + 0.45, -0.5, { rotY: Math.PI / 2, cols: 4, rows: 1, lit: lit * 0.85, depth: 3 })
  // glass balustrade + roof terrace volume
  box(8, 3, 6, M.plaster, -2, f1y + 4.65, -1.5)
  facade(7, 2.6, -2, f1y + 4.65, 1.6, { cols: 4, rows: 1, lit: lit * 0.7, depth: 2 })
  box(8.6, 0.35, 6.6, M.darkMetal, -2, f1y + 7.6, -1.5)
  // slim column
  box(0.25, f1y, 0.25, M.darkMetal, 16.5, 0, 3.9)

  // landscaping
  shrubRow(-8, 13, 7.1, 0.55)
  tree(-14, 2, 1.3, 'tall')
  tree(-17, -6, 1.5, 'round')
  tree(22, -2, 1.4, 'tall')
  tree(25, 8, 1.1, 'round')
  tree(-15, 13, 0.9, 'tall')
  tree(24, 15, 1.0, 'tall')
  for (let i = 0; i < 14; i++) tree(rr(-40, 40), rr(-40, -16), rr(1.2, 2), rand() > 0.5 ? 'tall' : 'round')
  for (let i = 0; i < 26; i++) tree(rr(-110, -30), rr(-90, 10), rr(1.6, 2.6), rand() > 0.5 ? 'tall' : 'round')
}

function interiorLights(points: [number, number, number][], intensity: number, color = 0xffc387) {
  for (const p of points) {
    const l = new THREE.PointLight(color, intensity, 14, 2)
    l.position.set(...p)
    scene.add(l)
  }
}

function tower(lit: number, floors = 9) {
  const fh = 3.8
  const w = 30,
    d = 20
  // podium
  box(w + 6, 0.4, d + 6, M.concrete, 0, 0, 0)
  facade(w, 7, 0, 0.4, d / 2 + 1, { cols: 12, rows: 2, lit, depth: 4, mullion: M.bronze })
  box(14, 0.5, 6, M.darkMetal, 0, 5.2, d / 2 + 4) // canopy
  box(0.3, 5.2, 0.3, M.bronze, -6.5, 0.4, d / 2 + 6.5)
  box(0.3, 5.2, 0.3, M.bronze, 6.5, 0.4, d / 2 + 6.5)
  box(w + 2, 0.8, d + 2, M.concrete, 0, 7.4, 0)
  const top = 8.2 + floors * fh
  // curtain wall
  facade(w, floors * fh, 0, 8.2, d / 2, { cols: 15, rows: floors, lit, depth: 2.5 })
  facade(d, floors * fh, w / 2, 8.2, 0, { rotY: Math.PI / 2, cols: 10, rows: floors, lit, depth: 2.5 })
  facade(d, floors * fh, -w / 2, 8.2, 0, { rotY: -Math.PI / 2, cols: 10, rows: floors, lit, depth: 2.5 })
  box(w - 7, floors * fh, d - 7, M.concrete, 0, 8.2, 0)
  // vertical bronze fins
  for (let i = 0; i <= 15; i++) box(0.12, floors * fh, 0.9, M.bronze, -w / 2 + (i * w) / 15, 8.2, d / 2 + 0.45)
  for (let i = 0; i <= 10; i++) box(0.9, floors * fh, 0.12, M.bronze, w / 2 + 0.45, 8.2, -d / 2 + (i * d) / 10)
  // floor slabs edges
  for (let f = 0; f <= floors; f++) box(w + 0.6, 0.25, d + 0.6, M.concrete, 0, 8.2 + f * fh - 0.12, 0)
  // crown
  box(w - 6, 3, d - 6, M.darkMetal, 0, top, 0)
  // plaza
  patch(120, 60, M.paving, 0, 25)
  for (let i = -3; i <= 3; i++) if (i !== 0) tree(i * 7, d / 2 + 16, 1.1, 'round')
  // planters
  for (let i = -3; i <= 3; i++) if (i !== 0) box(3, 0.6, 3, M.concrete, i * 7, 0, d / 2 + 16)
  // neighbours
  box(18, 26, 18, M.concrete, -42, 0, -18)
  facade(18, 24, -42, 1, -8.9, { cols: 8, rows: 7, lit: lit * 0.6, depth: 2 })
  box(22, 40, 18, M.glassOpaque, 46, 0, -26)
  box(16, 14, 16, M.plaster, 40, 0, 6)
}

function concreteFrame(floors: number, cols: number, rows: number, opts: { formwork?: boolean } = {}) {
  const fh = 3.3,
    span = 5.5
  const w = (cols - 1) * span,
    d = (rows - 1) * span
  box(w + 2, 0.5, d + 2, M.concrete, 0, 0, 0)
  for (let f = 0; f < floors; f++) {
    const y = 0.5 + f * fh
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        if (f === floors - 1 && (i + j) % 2 === 0 && i > cols / 2) continue
        box(0.45, fh - 0.3, 0.45, M.concrete, -w / 2 + i * span, y, -d / 2 + j * span)
      }
    if (f < floors - 1 || !opts.formwork) box(w + 1.2, 0.3, d + 1.2, M.concrete, 0, y + fh - 0.3, 0)
    else {
      // partial slab with formwork & props at top level
      box(w / 2 + 1, 0.3, d + 1.2, M.concrete, -w / 4, y + fh - 0.3, 0)
      box(w / 2, 0.15, d + 1.2, M.formwork, w / 4 + 0.6, y + fh - 0.3, 0)
      for (let i = 0; i < 8; i++)
        for (let j = 0; j < 5; j++) box(0.06, fh - 0.45, 0.06, M.yellow, w * 0.05 + (i * w) / 16, y, -d / 2 + (j * d) / 4)
    }
    // beams
    for (let i = 0; i < cols; i++) box(0.4, 0.5, d, M.concrete, -w / 2 + i * span, y + fh - 0.75, 0)
    // a few infill blockwork walls lower levels
    if (f < floors - 2) {
      for (let i = 0; i < cols - 1; i++)
        if (rand() > 0.45) box(span - 0.45, fh - 0.75, 0.22, M.plaster, -w / 2 + (i + 0.5) * span, y, -d / 2)
    }
  }
  // rebar starters on top columns
  const top = 0.5 + floors * fh
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++)
      for (let k = 0; k < 4; k++)
        box(0.03, 1.4, 0.03, M.rebar, -w / 2 + i * span + (k % 2 ? 0.15 : -0.15), top - 0.3, -d / 2 + j * span + (k < 2 ? 0.15 : -0.15))
  return { w, d, top }
}

function crane(x: number, z: number, h: number, jib: number, rotY = 0) {
  const g = new THREE.Group()
  const m = M.yellow
  const s = 1.6
  // mast lattice
  for (const [cx, cz] of [
    [-s / 2, -s / 2],
    [s / 2, -s / 2],
    [-s / 2, s / 2],
    [s / 2, s / 2],
  ])
    box(0.12, h, 0.12, m, cx, 0, cz, g)
  for (let y = 0; y < h; y += s) {
    box(s, 0.08, 0.08, m, 0, y, -s / 2, g)
    box(s, 0.08, 0.08, m, 0, y, s / 2, g)
    box(0.08, 0.08, s, m, -s / 2, y, 0, g)
    box(0.08, 0.08, s, m, s / 2, y, 0, g)
    const diag = new THREE.Mesh(new THREE.BoxGeometry(0.06, s * 1.41, 0.06), m)
    diag.position.set(0, y + s / 2, s / 2)
    diag.rotation.z = Math.PI / 4
    g.add(diag)
    const diag2 = diag.clone()
    diag2.position.z = -s / 2
    g.add(diag2)
  }
  // jib & counter-jib
  box(jib, 0.9, 1.0, m, jib / 2 - 4, h, 0, g)
  box(10, 0.8, 1.0, m, -8, h, 0, g)
  box(3, 2.2, 1.6, M.concrete, -11, h - 2.2, 0, g)
  box(2, 2.2, 2, m, 0, h + 0.9, 0, g) // cab top
  box(1.6, 1.6, 1.6, M.white, 1.3, h - 1.8, 0, g)
  // cable + hook
  box(0.03, 12, 0.03, M.darkMetal, jib * 0.6, h - 12, 0, g)
  box(0.5, 0.5, 0.5, M.orange, jib * 0.6, h - 12.4, 0, g)
  g.position.set(x, 0, z)
  g.rotation.y = rotY
  return add(g)
}

function scaffold(w: number, h: number, x: number, z: number, net = true) {
  const g = new THREE.Group()
  const bay = 2.4,
    lift = 2
  for (let i = 0; i <= Math.round(w / bay); i++)
    for (const dz of [0, 1.1]) box(0.05, h, 0.05, M.darkMetal, -w / 2 + i * bay, 0, dz, g)
  for (let y = lift; y <= h; y += lift) {
    for (const dz of [0, 1.1]) box(w, 0.05, 0.05, M.darkMetal, 0, y, dz, g)
    box(w, 0.06, 1.1, M.formwork, 0, y - 0.06, 0.55, g)
  }
  if (net) {
    const n = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.55, h), M.net)
    n.position.set(w * 0.22, h / 2, 1.3)
    g.add(n)
  }
  g.position.set(x, 0, z)
  return add(g)
}

// ---------------------------------------------------------------------------
// Shots
// ---------------------------------------------------------------------------
const DUSK = { zenith: 0x0e1d36, mid: 0x4f5f80, horizon: 0xeea36e, ground: 0x1c1b1a, sunColor: 0xffa060 }
const GOLD = { zenith: 0x4f7fb8, mid: 0x9db5cf, horizon: 0xf3d0a4, ground: 0x3b3530, sunColor: 0xffc58a }
const DAY = { zenith: 0x3c70b0, mid: 0x8fb2d4, horizon: 0xd8e4ea, ground: 0x4a4540, sunColor: 0xfff1dc }

const shots: Record<string, () => Shot> = {
  'villa-dusk': () => {
    setupSky({ ...DUSK, sunDir: new THREE.Vector3(-1, 0.16, 0.45), sunIntensity: 2.6, hemi: 1.3, hemiSky: 0x7088b0, fog: 0x3a3d4a, fogDensity: 0.004, exposure: 1.25, env: 1.1 })
    ground(M.grass)
    villa(0.7)
    interiorLights(
      [
        [0, 2.5, 2],
        [6, 2.5, 2],
        [10, 6.5, 2],
        [-2, 10, 0],
      ],
      14,
    )
    return { camera: cam(34, [26, 5, 36], [-4, 4.6, 0]) }
  },
  'villa-day': () => {
    setupSky({ ...GOLD, sunDir: new THREE.Vector3(1, 0.55, 0.9), sunIntensity: 3.2, hemi: 0.75, fog: 0xd8d2c8, fogDensity: 0.004, env: 1 })
    ground(M.grass)
    villa(0.25)
    return { camera: cam(38, [-22, 3, 30], [3, 4.8, 0]) }
  },
  'villa-portrait': () => {
    setupSky({ ...GOLD, sunDir: new THREE.Vector3(1.2, 0.35, 0.5), sunIntensity: 3.2, hemi: 0.7, fog: 0xd8cfc2, fogDensity: 0.004, env: 1 })
    ground(M.grass)
    villa(0.4)
    return { camera: cam(46, [30, 1.8, 30], [4, 5.6, 0]) }
  },
  'tower-gold': () => {
    setupSky({ ...GOLD, sunDir: new THREE.Vector3(-1, 0.35, 0.8), sunIntensity: 3, hemi: 0.7, fog: 0xcfc4b6, fogDensity: 0.003, shadowSize: 80, env: 1 })
    ground(M.asphalt)
    tower(0.25)
    return { camera: cam(42, [-26, 2, 52], [0, 22, 0]) }
  },
  'tower-night': () => {
    setupSky({ ...DUSK, horizon: 0xc77b52, sunDir: new THREE.Vector3(1, 0.06, -0.4), sunIntensity: 1.6, hemi: 1.1, hemiSky: 0x7088b0, fog: 0x2a2d3a, fogDensity: 0.003, shadowSize: 80, exposure: 1.25, env: 1.2 })
    ground(M.asphalt)
    tower(1.6)
    return { camera: cam(40, [34, 3, 56], [0, 20, 0]) }
  },
  'tower-wide': () => {
    setupSky({ ...DUSK, sunDir: new THREE.Vector3(-1, 0.08, -0.3), sunIntensity: 1.6, hemi: 1.1, hemiSky: 0x7088b0, fog: 0x2a2d3a, fogDensity: 0.003, shadowSize: 90, exposure: 1.25, env: 1.2 })
    ground(M.asphalt)
    tower(1.6)
    return { camera: cam(30, [70, 30, 90], [0, 16, 0]) }
  },
  'frame-day': () => {
    setupSky({ ...DAY, horizon: 0xe6dccb, sunDir: new THREE.Vector3(0.9, 0.7, 0.6), sunIntensity: 3, hemi: 0.8, fog: 0xd9d2c6, fogDensity: 0.005, env: 1 })
    ground(M.dirt)
    concreteFrame(5, 6, 4, { formwork: true })
    crane(-20, -10, 34, 36, 0.4)
    for (let i = 0; i < 6; i++) box(1.2, 0.6, 0.8, M.formwork, rr(-10, 15), 0, rr(12, 18))
    box(6, 2.6, 2.5, M.white, 18, 0, 14) // site office
    tree(-30, 20, 1.3, 'round')
    tree(30, -20, 1.6, 'tall')
    return { camera: cam(40, [30, 6, 34], [0, 9, 0]) }
  },
  'frame-detail': () => {
    setupSky({ ...GOLD, sunDir: new THREE.Vector3(-0.8, 0.4, 0.7), sunIntensity: 3.4, hemi: 0.6, fog: 0xcbb8a0, fogDensity: 0.006, env: 1 })
    ground(M.dirt)
    concreteFrame(6, 5, 4, { formwork: true })
    crane(14, -16, 38, 34, 2.4)
    return { camera: cam(42, [-26, 2.5, 26], [0, 10, 0]) }
  },
  renovation: () => {
    setupSky({ ...DAY, sunDir: new THREE.Vector3(-0.7, 0.8, 0.9), sunIntensity: 3.2, hemi: 0.8, fog: 0xd2d6d8, fogDensity: 0.004, env: 1 })
    ground(M.paving)
    box(24, 14, 12, std({ color: 0xd8d2c6, roughness: 0.9 }), 0, 0, 0)
    for (let f = 0; f < 4; f++) for (let i = 0; i < 6; i++) box(2.2, 2, 0.3, M.glassOpaque, -9.5 + i * 3.8, 1.2 + f * 3.3, 6)
    box(24.6, 0.4, 12.6, M.concrete, 0, 14, 0)
    scaffold(24, 14, 0, 6.25)
    box(12, 0.12, 6, M.formwork, 0, 0, 12) // material laydown
    for (let i = 0; i < 4; i++) box(1.2, 1, 1.2, M.concrete, -5 + i * 1.6, 0, 11)
    tree(-18, 8, 1.3, 'round')
    tree(18, 9, 1.1, 'tall')
    return { camera: cam(40, [-14, 3, 34], [2, 7, 0]) }
  },
  model: () => {
    // white architectural massing model on drafting table
    scene.background = new THREE.Color(0x15171a)
    const envScene = new THREE.Scene()
    envScene.add(makeSkyMesh({ zenith: 0x202226, horizon: 0x5a5148, sunDir: new THREE.Vector3(1, 1, 1), glow: 0.3 }))
    scene.environment = new THREE.PMREMGenerator(renderer).fromScene(envScene).texture
    const table = new THREE.Mesh(new THREE.BoxGeometry(60, 1, 40), std({ map: tex.floorWood(2), roughness: 0.6 }))
    table.position.y = -0.5
    add(table)
    const base = box(24, 0.4, 16, std({ map: tex.grid(1), roughness: 0.8 }), 0, 0, 0)
    base.castShadow = true
    const mw = std({ color: 0xf2f0ec, roughness: 0.85 })
    const blocks: [number, number, number, number, number][] = [
      [5, 3, 4, -6, -3],
      [3, 6, 3, -1, -4],
      [6, 1.6, 3, 3, -4],
      [4, 2.2, 5, 7, 2],
      [2.5, 4.5, 2.5, 2, 2],
      [7, 1, 2, -5, 3],
      [3, 2.5, 3, -8, 4],
      [2, 8, 2, 6, -4],
    ]
    for (const [w, h, d, x, z] of blocks) box(w, h, d, mw, x, 0.4, z)
    // tiny trees
    for (let i = 0; i < 26; i++) {
      const t = new THREE.Mesh(new THREE.SphereGeometry(rr(0.25, 0.45), 12, 8), std({ color: 0xd6d1c8, roughness: 1 }))
      t.position.set(rr(-11, 11), 0.75, rr(-7, 7))
      if (Math.abs(t.position.z) < 6.5 && Math.abs(t.position.x) < 9.5 && rand() > 0.3) t.position.z = rand() > 0.5 ? 7.3 : -7.3
      add(t)
    }
    // rolled drawings & scale ruler
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 14, 24), std({ color: 0xe8e3d6, roughness: 0.9 }))
    roll.rotation.z = Math.PI / 2
    roll.rotation.y = 0.3
    roll.position.set(-4, 0.5, 13)
    add(roll)
    box(10, 0.15, 1.2, M.bronze, 9, 0, 12)
    const key = new THREE.SpotLight(0xffe6c4, 2800, 120, 0.5, 0.6, 1.6)
    key.position.set(-24, 30, 16)
    key.castShadow = true
    key.shadow.mapSize.set(4096, 4096)
    key.shadow.radius = 6
    key.shadow.bias = -0.0003
    scene.add(key)
    scene.add(new THREE.HemisphereLight(0x8899aa, 0x221a12, 0.35))
    renderer.toneMappingExposure = 1
    scene.fog = new THREE.Fog(0x15171a, 30, 70)
    return { camera: cam(32, [22, 14, 24], [0, 1.5, 0]) }
  },
  interior: () => {
    setupSky({ ...GOLD, sunDir: new THREE.Vector3(0.9, 0.42, 1.2), sunIntensity: 4.5, hemi: 1.4, hemiGround: 0x9a8670, env: 1.4, exposure: 1.2, shadowSize: 30 })
    ground(M.grass)
    const floorMat = std({ map: tex.floorWood(1), roughness: 0.5 })
    box(16, 0.12, 12, floorMat, 0, 0, 0)
    box(16, 0.3, 12, M.plaster, 0, 3.6, 0) // ceiling
    box(0.3, 3.6, 12, M.plaster, -8, 0, 0)
    box(16, 3.6, 0.3, M.plaster, 0, 0, -6)
    box(5, 3.6, 0.3, M.wood, -3, 0, -5.8) // wood feature wall
    // glass wall to garden on +x / +z
    facade(12, 3.6, 8, 0, 0, { rotY: Math.PI / 2, cols: 4, rows: 1, depth: 0.01 })
    facade(16, 3.6, 0, 0, 6, { cols: 5, rows: 1, depth: 0.01 })
    // furniture
    box(5, 0.45, 2, M.fabric, -1.5, 0, -2.2)
    box(5, 0.5, 0.5, M.fabric, -1.5, 0.45, -3.0)
    box(0.5, 0.4, 2, M.fabric, -4.2, 0.45, -2.2)
    box(2.4, 0.38, 1.3, M.stone, -1.5, 0, 0.3)
    box(2.2, 0.42, 2.2, M.fabricDark, 2.6, 0, 0.6)
    box(4.5, 0.05, 3.5, std({ color: 0xbfb3a2, roughness: 1 }), -1.3, 0.001, -0.8)
    // pendant
    const pend = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.12, 32), M.bronze)
    pend.position.set(-1.5, 2.6, 0.3)
    add(pend)
    box(0.02, 0.9, 0.02, M.darkMetal, -1.5, 2.65, 0.3)
    // plant
    box(0.6, 0.6, 0.6, M.concrete, 6.8, 0, -5)
    const leaves = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 1), M.foliage)
    leaves.position.set(6.8, 1.6, -5)
    add(leaves)
    // garden beyond
    patch(30, 20, M.paving, 0, 14)
    tree(14, 10, 1.4, 'round')
    tree(20, -4, 1.6, 'tall')
    tree(6, 18, 1.2, 'tall')
    tree(-6, 16, 1.3, 'round')
    shrubRow(-8, 8, 9, 0.6)
    const fill = new THREE.PointLight(0xfff0dd, 14, 24, 2)
    fill.position.set(0, 1.8, 0)
    scene.add(fill)
    return { camera: cam(58, [-6.8, 1.45, -4.6], [3, 1.1, 2.2]) }
  },
  aerial: () => {
    setupSky({ ...DAY, sunDir: new THREE.Vector3(-0.6, 0.8, 0.5), sunIntensity: 3.2, hemi: 0.8, fog: 0xc9d0d4, fogDensity: 0.004, shadowSize: 90, env: 1 })
    ground(M.grass)
    // roads
    patch(10, 300, M.asphalt, 0, 0, 0.03)
    patch(300, 10, M.asphalt, 0, 0, 0.031)
    for (let i = -6; i <= 6; i++) patch(0.25, 2.5, M.white, 0, i * 8, 0.04)
    const lots: [number, number][] = [
      [-22, -22],
      [22, -22],
      [-22, 22],
      [22, 22],
      [-50, -20],
      [50, 20],
      [-50, 24],
      [52, -24],
    ]
    for (const [x, z] of lots) {
      patch(30, 30, M.paving, x, z, 0.025)
      const h = rr(4, 16)
      box(rr(10, 16), h, rr(10, 16), rand() > 0.4 ? M.plaster : M.concrete, x + rr(-3, 3), 0, z + rr(-3, 3))
      if (rand() > 0.4) box(rr(5, 8), rr(3, 6), rr(5, 8), M.white, x + rr(-8, 8), 0, z + rr(-8, 8))
      for (let i = 0; i < 5; i++) tree(x + rr(-14, 14), z + (rand() > 0.5 ? 13.5 : -13.5), rr(0.8, 1.2))
    }
    for (let i = 0; i < 40; i++) tree(rr(-120, 120), rr(-120, 120), rr(1, 1.6))
    return { camera: cam(40, [55, 80, 75], [0, 0, 0]) }
  },
  pavilion: () => {
    setupSky({ ...GOLD, horizon: 0xf0b984, sunDir: new THREE.Vector3(-1, 0.22, 0.5), sunIntensity: 3, hemi: 0.55, fog: 0xc8b39c, fogDensity: 0.005, env: 1, exposure: 1.05 })
    ground(M.grass)
    patch(50, 30, M.paving, 0, 2)
    const pool = box(44, 0.05, 10, M.water, 0, 0.02, 14)
    pool.castShadow = false
    box(36, 0.5, 16, M.concrete, 0, 0, 0)
    box(40, 0.6, 20, M.white, 0, 4.4, 0)
    for (let i = 0; i < 6; i++) {
      box(0.22, 3.9, 0.22, M.darkMetal, -17 + i * 6.8, 0.5, 9.3)
      box(0.22, 3.9, 0.22, M.darkMetal, -17 + i * 6.8, 0.5, -9.3)
    }
    facade(26, 3.9, 0, 0.5, 5, { cols: 10, rows: 1, lit: 0.6, depth: 6 })
    box(6, 3.9, 6, M.wood, -9, 0.5, -1)
    box(7, 3.9, 0.4, M.stone, 12, 0.5, 4.8)
    interiorLights(
      [
        [0, 3.6, 2],
        [7, 3.6, 2],
        [-6, 3.6, 2],
      ],
      8,
    )
    for (let i = 0; i < 14; i++) tree(rr(-60, 60), rr(-50, -18), rr(1.3, 2), rand() > 0.5 ? 'tall' : 'round')
    tree(-30, 8, 1.4, 'round')
    tree(30, 5, 1.2, 'tall')
    return { camera: cam(36, [26, 1.8, 40], [-2, 3, 0]) }
  },
}

// ---------------------------------------------------------------------------
async function main() {
  const fn = shots[SHOT]
  if (!fn) throw new Error('unknown shot ' + SHOT)
  const { camera } = fn()
  renderer.render(scene, camera)
  ;(window as unknown as { __done: boolean }).__done = true
}
main().catch((e) => {
  ;(window as unknown as { __error: string }).__error = String(e)
})
