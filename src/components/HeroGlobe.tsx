import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { isLiteGlobeDevice, shouldUseStaticGlobe } from '../lib/performance';

const DESKTOP_NODES = 88;
const LITE_NODES = 52;
const RADIUS = 2.35;

function fibonacciSphere(samples: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius
      )
    );
  }
  return points;
}

function CanvasResize({ containerRef }: { containerRef: MutableRefObject<HTMLDivElement | null> }) {
  const { gl, camera } = useThree();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width < 1 || height < 1) return;
      gl.setSize(width, height, false);
      if ('aspect' in camera && camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef, gl, camera]);

  return null;
}

interface NetworkGlobeProps {
  mouse: MutableRefObject<{ x: number; y: number }>;
  lite: boolean;
}

function NetworkGlobe({ mouse, lite }: NetworkGlobeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const nodeCount = lite ? LITE_NODES : DESKTOP_NODES;
  const linkDistance = lite ? 0.78 : 0.68;
  const wireSegments = lite ? 16 : 24;

  const { pointsGeo, linesGeo, outerWireGeo } = useMemo(() => {
    const verts = fibonacciSphere(nodeCount, RADIUS);
    const posArr = new Float32Array(nodeCount * 3);
    verts.forEach((v, i) => {
      posArr[i * 3] = v.x;
      posArr[i * 3 + 1] = v.y;
      posArr[i * 3 + 2] = v.z;
    });

    const lineVerts: number[] = [];
    for (let i = 0; i < verts.length; i++) {
      for (let j = i + 1; j < verts.length; j++) {
        if (verts[i].distanceTo(verts[j]) < linkDistance) {
          lineVerts.push(
            verts[i].x,
            verts[i].y,
            verts[i].z,
            verts[j].x,
            verts[j].y,
            verts[j].z
          );
        }
      }
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));

    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerts), 3));

    const wGeo = new THREE.SphereGeometry(RADIUS * 1.02, wireSegments, wireSegments);

    return { pointsGeo: pGeo, linesGeo: lGeo, outerWireGeo: wGeo };
  }, [nodeCount, linkDistance, wireSegments]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const targetX = mouse.current.y * (lite ? 0.35 : 0.55);
    const targetY = mouse.current.x * (lite ? 0.5 : 0.9) + t * 0.06;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      lite ? 0.03 : 0.04
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      lite ? 0.03 : 0.04
    );

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.12;
      ringRef.current.rotation.x = Math.PI / 2 + mouse.current.y * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={lite ? [0, 0.15, 0] : [0, 0, 0]}>
      <mesh>
        <sphereGeometry args={[RADIUS * 0.72, wireSegments, wireSegments]} />
        <meshBasicMaterial color="#27005d" transparent opacity={lite ? 0.55 : 0.35} />
      </mesh>

      <lineSegments geometry={linesGeo}>
        <lineBasicMaterial color="#c77dff" transparent opacity={lite ? 0.82 : 0.45} />
      </lineSegments>

      <points geometry={pointsGeo}>
        <pointsMaterial
          size={lite ? 0.095 : 0.055}
          color="#ffffff"
          transparent
          opacity={1}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <mesh geometry={outerWireGeo}>
        <meshBasicMaterial color="#aed2ff" wireframe transparent opacity={lite ? 0.22 : 0.07} />
      </mesh>

      {!lite && (
        <>
          <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[RADIUS * 1.35, 0.008, 6, 64]} />
            <meshBasicMaterial color="#9400ff" transparent opacity={0.5} />
          </mesh>

          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[RADIUS * 1.55, 0.004, 6, 48]} />
            <meshBasicMaterial color="#aed2ff" transparent opacity={0.2} />
          </mesh>
        </>
      )}
    </group>
  );
}

interface HeroGlobeProps {
  mouse: MutableRefObject<{ x: number; y: number }>;
}

const HeroGlobe = ({ mouse }: HeroGlobeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lite, setLite] = useState(isLiteGlobeDevice);
  const useStatic = shouldUseStaticGlobe();

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = () => setLite(isLiteGlobeDevice());
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (useStatic) {
    return (
      <div ref={containerRef} className="hero-globe-canvas hero-globe-canvas--static" aria-hidden>
        <div className="hero-globe-canvas__orb" />
      </div>
    );
  }

  const cameraZ = lite ? 5.8 : 7.2;

  return (
    <div
      ref={containerRef}
      className={`hero-globe-canvas-wrap${lite ? ' hero-globe-canvas-wrap--lite' : ''}`}
    >
      <Canvas
        className="hero-globe-canvas"
        camera={{ position: [0, lite ? 0.2 : 0, cameraZ], fov: lite ? 52 : 42 }}
        dpr={lite ? [1, 1.5] : [1, 1.25]}
        frameloop="always"
        resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
        gl={{
          antialias: !lite,
          alpha: true,
          powerPreference: lite ? 'default' : 'high-performance',
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        {!lite && <fog attach="fog" args={['#0a0e27', 5, 16]} />}
        <ambientLight intensity={lite ? 0.35 : 0.15} color="#aed2ff" />
        <pointLight position={[6, 4, 8]} intensity={lite ? 4 : 2.5} color="#9400ff" />
        <pointLight position={[-6, -4, 4]} intensity={lite ? 2.2 : 1.2} color="#aed2ff" />
        <CanvasResize containerRef={containerRef} />
        <Suspense fallback={null}>
          <NetworkGlobe mouse={mouse} lite={lite} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroGlobe;
