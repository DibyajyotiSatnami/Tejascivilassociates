import { useEffect, useRef, type MutableRefObject } from 'react'
import {
  ACESFilmicToneMapping,
  AmbientLight,
  BoxGeometry,
  CircleGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  Fog,
  GridHelper,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  Timer,
  Vector3,
  WebGLRenderer,
  type MeshStandardMaterialParameters,
} from 'three'

/**
 * Lightweight procedural building used in the "Visual Architecture" section.
 * Scroll progress (0 → 1) drives: blueprint wireframe → structure → solid form.
 * No external 3D assets are loaded — geometry is generated in code (~150 boxes
 * sharing a single geometry), and only the Three.js modules used are bundled.
 */

type Part = { size: [number, number, number]; pos: [number, number, number]; kind: 'slab' | 'column' | 'core' | 'glass' | 'accent' | 'wall' }

const GOLD = new Color('#F2A71B')

function buildParts(): Part[] {
  const parts: Part[] = []
  const floors = 7
  const fh = 0.62
  const W = 3.2
  const D = 2.2
  // podium
  parts.push({ size: [W + 1.4, 0.18, D + 1.2], pos: [0, 0.09, 0], kind: 'slab' })
  for (let f = 0; f < floors; f++) {
    const y = 0.18 + f * fh
    const shift = f >= 4 ? 0.55 : 0 // cantilevered upper block
    const w = f >= 4 ? W + 0.4 : W
    // columns
    for (const cx of [-w / 2 + 0.1, -w / 6, w / 6, w / 2 - 0.1])
      for (const cz of [-D / 2 + 0.1, D / 2 - 0.1]) parts.push({ size: [0.08, fh - 0.08, 0.08], pos: [cx + shift, y + (fh - 0.08) / 2, cz], kind: 'column' })
    // core
    parts.push({ size: [0.7, fh, 0.7], pos: [-0.6 + shift * 0.3, y + fh / 2, -0.2], kind: 'core' })
    // glass skin (front + back)
    parts.push({ size: [w - 0.1, fh - 0.12, 0.02], pos: [shift, y + fh / 2, D / 2 - 0.05], kind: 'glass' })
    parts.push({ size: [w - 0.1, fh - 0.12, 0.02], pos: [shift, y + fh / 2, -D / 2 + 0.05], kind: 'glass' })
    parts.push({ size: [0.02, fh - 0.12, D - 0.1], pos: [w / 2 - 0.05 + shift, y + fh / 2, 0], kind: 'glass' })
    // slab above
    parts.push({ size: [w + 0.16, 0.08, D + 0.16], pos: [shift, y + fh, 0], kind: 'slab' })
    // vertical fins on upper block
    if (f >= 4) for (let i = 0; i < 9; i++) parts.push({ size: [0.03, fh, 0.14], pos: [-w / 2 + 0.2 + (i * (w - 0.4)) / 8 + shift, y + fh / 2, D / 2 + 0.07], kind: 'accent' })
  }
  // side stone wall at base
  parts.push({ size: [0.2, 1.4, D + 0.6], pos: [-W / 2 - 0.5, 0.88, 0], kind: 'wall' })
  // roof crown
  const top = 0.18 + floors * fh
  parts.push({ size: [1.6, 0.35, 1.2], pos: [0.2, top + 0.22, -0.2], kind: 'core' })
  return parts
}

const MATS: Record<Part['kind'], MeshStandardMaterialParameters> = {
  slab: { color: '#e9e5dc', roughness: 0.85 },
  column: { color: '#cfcac0', roughness: 0.8 },
  core: { color: '#bdb7ac', roughness: 0.9 },
  glass: { color: '#163a6b', roughness: 0.08, metalness: 0.6, emissive: '#f2a71b', emissiveIntensity: 0.12 },
  accent: { color: '#F2A71B', roughness: 0.4, metalness: 0.6 },
  wall: { color: '#8f7f6a', roughness: 0.95 },
}


type Props = {
  progress: MutableRefObject<number>
  pointer: MutableRefObject<{ x: number; y: number }>
  active: boolean
}

export default function Building3D({ progress, pointer, active }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const activeRef = useRef(active)
  const kick = useRef<() => void>(() => {})

  useEffect(() => {
    activeRef.current = active
    if (active) kick.current()
  }, [active])

  useEffect(() => {
    const el = host.current
    if (!el) return

    const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.outputColorSpace = SRGBColorSpace
    el.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'

    const scene = new Scene()
    scene.fog = new Fog('#071C3A', 12, 26)
    const camera = new PerspectiveCamera(36, 1, 0.1, 100)
    camera.position.set(6.2, 3.4, 11.5)

    scene.add(new AmbientLight(0xffffff, 0.55))
    scene.add(new HemisphereLight('#c9d4e0', '#2a2218', 0.8))
    const key = new DirectionalLight('#ffe2bd', 2.4)
    key.position.set(6, 9, 5)
    scene.add(key)
    const rim = new DirectionalLight('#8fa5c0', 0.7)
    rim.position.set(-6, 3, -4)
    scene.add(rim)

    const group = new Group()
    scene.add(group)

    const parts = buildParts()
    const maxY = Math.max(...parts.map((p) => p.pos[1] + p.size[1] / 2))
    const boxGeo = new BoxGeometry(1, 1, 1)
    const edgeGeo = new EdgesGeometry(boxGeo)
    const disposables: { dispose: () => void }[] = [boxGeo, edgeGeo]

    const items = parts.map((p) => {
      const mat = new MeshStandardMaterial({ ...MATS[p.kind], transparent: true, opacity: 0 })
      const em = new LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0 })
      disposables.push(mat, em)
      const g = new Group()
      g.position.set(...p.pos)
      g.scale.set(...p.size)
      const mesh = new Mesh(boxGeo, mat)
      const lines = new LineSegments(edgeGeo, em)
      g.add(mesh, lines)
      group.add(g)
      return { p, mat, em, mesh, t: (p.pos[1] - p.size[1] / 2) / maxY }
    })

    // scanning plane
    const scanMat = new MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.16, side: DoubleSide, depthWrite: false })
    const scanGeo = new PlaneGeometry(6, 4.5)
    const scan = new Mesh(scanGeo, scanMat)
    scan.rotation.x = -Math.PI / 2
    group.add(scan)
    // blueprint ground
    const grid = new GridHelper(14, 28, '#9a7420', '#1c3560')
    grid.position.y = 0.001
    group.add(grid)
    const floorGeo = new CircleGeometry(7, 64)
    const floorMat = new MeshStandardMaterial({ color: '#0a2246', roughness: 1 })
    const floor = new Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.01
    group.add(floor)
    disposables.push(scanMat, scanGeo, floorGeo, floorMat, grid.geometry, grid.material as LineBasicMaterial)

    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      camera.aspect = w / h
      // keep the building framed on narrow (portrait) screens
      camera.fov = w / h < 0.9 ? 52 : 36
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    const timer = new Timer()
    const camTarget = new Vector3()
    let smooth = progress.current
    let raf = 0
    let running = false

    const frame = (time: number) => {
      timer.update(time)
      const dt = Math.min(timer.getDelta(), 0.1)
      const t = timer.getElapsed()
      smooth += (progress.current - smooth) * Math.min(1, dt * 4)
      const p = smooth
      const wire = MathUtils.clamp(p / 0.38, 0, 1) // 0 → 0.38 : wireframe draws in
      const solid = MathUtils.clamp((p - 0.38) / 0.42, 0, 1) // 0.38 → 0.8 : solid form appears

      for (const it of items) {
        const e = MathUtils.clamp((wire * 1.25 - it.t) * 4, 0, 1)
        const s = MathUtils.clamp((solid * 1.25 - it.t) * 3, 0, 1)
        it.em.opacity = e * (1 - s * 0.75)
        it.mat.opacity = s * (it.p.kind === 'glass' ? 0.85 : 1)
        it.mat.depthWrite = s > 0.95
        it.mesh.visible = s > 0.001
      }

      scan.position.y = (wire < 1 ? wire : solid < 1 ? solid : 1) * maxY * 1.1
      scanMat.opacity = p > 0.82 ? Math.max(0, 0.16 - (p - 0.82) * 1.2) : 0.16

      group.rotation.y = -0.9 + p * 2.4 + pointer.current.x * 0.18 + Math.sin(t * 0.25) * 0.03
      group.rotation.x = pointer.current.y * 0.05
      camera.position.lerp(camTarget.set(6.2 - p * 1.4, 3.4 + p * 1.6, 11.5 - p * 0.8), 0.05)
      camera.lookAt(0, 1.6 + p * 0.9, 0)

      renderer.render(scene, camera)
      if (activeRef.current) raf = requestAnimationFrame(frame)
      else running = false
    }
    kick.current = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(frame)
    }
    if (activeRef.current) kick.current()
    else requestAnimationFrame(frame) // render one frame

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [progress, pointer])

  return <div ref={host} className="h-full w-full" aria-hidden />
}
