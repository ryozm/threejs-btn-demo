import { FC, useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import styles from './ThreeAnimateButton.module.scss'

interface ThreeAnimateButtonProps {
  width: number
  height: number
  text: string
}

const ThreeAnimateButton: FC<ThreeAnimateButtonProps> = ({ height = 300, width = 400, text }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLAnchorElement>(null)
  const mouse = useRef<THREE.Vector2>(new THREE.Vector2(0, 0))

  const sphereMesh = useRef<THREE.Mesh>()
  const coneMesh = useRef<THREE.Mesh>()
  const torusMesh = useRef<THREE.Mesh>()

  function onMouseMove(event: MouseEvent) {
    mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  function animateIn() {
    if (torusMesh.current) {
      gsap.to(torusMesh.current.material, 0.6, { opacity: 1 })
      gsap.fromTo(torusMesh.current.scale, 0.6, { x: 0.8, y: 0.8, z: 0.8 }, { x: 1.35, y: 1.35, z: 1.35 })

      gsap.fromTo(torusMesh.current.position, 0.6, { x: 10, y: 20 }, { x: 30, y: 40 })

      gsap.fromTo(torusMesh.current.rotation, 0.6, { x: 2.0, y: -0.3 }, { x: 2.3, y: 0.3 })
    }
    if (sphereMesh.current) {
      gsap.fromTo(sphereMesh.current.scale, 0.6, { x: 0.8, y: 0.8, z: 0.8 }, { x: 1.15, y: 1.15, z: 1.15 })

      gsap.fromTo(sphereMesh.current.position, 0.6, { x: -10, y: -10 }, { x: -30, y: -40 })
    }

    if (coneMesh.current) {
      gsap.fromTo(coneMesh.current.scale, 0.6, { x: 0.8, y: 0.8, z: 0.8 }, { x: 1.35, y: 1.35, z: 1.35 })

      gsap.fromTo(coneMesh.current.position, 0.6, { x: -30, y: 2, z: 3 }, { x: -70, y: 12, z: 3 })

      gsap.fromTo(coneMesh.current.rotation, 0.6, { x: -0.2, z: 0.0 }, { x: -0.3, z: 0.7 })
    }
  }

  function animateOut() {
    if (torusMesh.current) {
      if (torusMesh.current) {
        gsap.to(torusMesh.current.material, 0.6, { opacity: 0 })
        gsap.to(torusMesh.current.scale, 0.6, { x: 0.8, y: 0.8, z: 0.8 })
        gsap.to(torusMesh.current.position, 0.6, { x: 10, y: 20 })
        gsap.to(torusMesh.current.rotation, 0.6, { x: 2.0, y: -0.3 })
      }
      if (sphereMesh.current) {
        gsap.to(sphereMesh.current.scale, 0.6, { x: 0.8, y: 0.8, z: 0.8 })
        gsap.to(sphereMesh.current.position, 0.6, { x: -10, y: -10 })
      }
      if (coneMesh.current) {
        gsap.to(coneMesh.current.scale, 0.6, { x: 0.8, y: 0.8, z: 0.8 })
        gsap.to(coneMesh.current.position, 0.6, { x: -30, y: 2, z: 3 })
        gsap.to(coneMesh.current.rotation, 0.6, { x: -0.2, z: 0.0 })
      }
    }
  }

  function mouseEnterListener() {
    gsap.to('.ok', 0.6, { scale: 1.35 })
    animateIn()
  }

  function mouseLeaveListener() {
    gsap.to('.ok', 0.6, { scale: 1.0 })
    animateOut()
  }

  useEffect(() => {
    const currentContainer = containerRef.current
    const currentBtn = btnRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, width / height, 1, 3000)
    camera.position.z = 200

    const renderer = new THREE.WebGLRenderer({
      // 抗锯齿
      antialias: true,
      // 透明
      alpha: true,
    })
    renderer.setSize(width, height)
    // 设置背景颜色
    renderer.setClearColor(0xffffff, 0)
    // 设置DPR
    renderer.setPixelRatio(1.6)

    if (currentContainer) {
      currentContainer.appendChild(renderer.domElement)

      // 设置灯光
      const light = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(light)
      // 设置聚光灯
      const spotLight = new THREE.SpotLight(0xf2056f, 0.68, 0)
      spotLight.position.set(150, 150, 0)
      scene.add(spotLight)

      // 设置环境光
      const hemLight = new THREE.HemisphereLight(0xd8c7ff, 0x61daff, 1)
      scene.add(hemLight)

      const loader = new THREE.CubeTextureLoader()
      loader.setPath('/texture/')
      const textureCube = loader.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])
      textureCube.format = THREE.RGBFormat
      // 添加物体
      const geometry = new THREE.SphereGeometry(24, 32, 32)

      // const material = new THREE.MeshPhysicalMaterial({
      //   color: 0xffffff,
      //   roughness: 0.3,
      //   metalness: 0.1,
      //   transparent: true,
      //   reflectivity: 0.56,
      //   envMap: textureCube,
      // })
      const material = new THREE.MeshNormalMaterial({
        opacity: 0,
        transparent: true,
      })

      sphereMesh.current = new THREE.Mesh(geometry, material)
      sphereMesh.current.position.y = -30
      sphereMesh.current.position.x = -25
      scene.add(sphereMesh.current)

      const geometryTorus = new THREE.TorusGeometry(16, 8, 16, 100)
      torusMesh.current = new THREE.Mesh(geometryTorus, material)
      torusMesh.current.position.y = 30
      torusMesh.current.position.x = 30
      torusMesh.current.rotation.x = 2.3
      torusMesh.current.rotation.y = 0.3
      scene.add(torusMesh.current)

      const geometryCone = new THREE.ConeGeometry(8, 16, 32)
      coneMesh.current = new THREE.Mesh(geometryCone, material)
      coneMesh.current.position.y = 12
      coneMesh.current.position.x = -50
      coneMesh.current.position.z = 3
      coneMesh.current.rotation.x = -0.3
      coneMesh.current.rotation.z = 0.7
      scene.add(coneMesh.current)

      if (currentBtn) {
        currentBtn.addEventListener('mouseenter', mouseEnterListener)
        currentBtn.addEventListener('mouseleave', mouseLeaveListener)
      }
      // let timer = Date.now()
      const animate = () => {
        requestAnimationFrame(animate)

        // const now = Date.now();
        // const delta = now - timer;
        camera.position.x += mouse.current.x * (window.innerWidth * 0.02) - camera.position.x * 0.03
        camera.position.y += -(mouse.current.y * (window.innerHeight * 0.02)) - camera.position.y * 0.03
        camera.lookAt(scene.position)
        renderer.render(scene, camera)
        // timer = now;
      }
      animate()
    }

    return () => {
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement)
        renderer.dispose()
      }
      if (currentBtn) {
        currentBtn.removeEventListener('mouseenter', mouseEnterListener)
        currentBtn.removeEventListener('mouseleave', mouseLeaveListener)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    document.body.addEventListener('mousemove', onMouseMove, false)
    return () => {
      document.body.removeEventListener('mousemove', onMouseMove, false)
    }
  }, [])

  return (
    <div ref={containerRef} className={styles.home}>
      <a ref={btnRef} href="#">
        <span>{text}</span>
      </a>
      <span className="ok">{text}</span>
    </div>
  )
}

export default ThreeAnimateButton
