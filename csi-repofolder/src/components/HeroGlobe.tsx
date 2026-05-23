import { Suspense, useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NODE_COUNT = 140;
const RADIUS = 2.35;
const LINK_DISTANCE = 0.62;

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

interface NetworkGlobeProps {
  mouse: MutableRefObject<{ x: number; y: number }>;
}

function NetworkGlobe({ mouse }: NetworkGlobeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const { pointsGeo, linesGeo, outerWireGeo } = useMemo(() => {
    const verts = fibonacciSphere(NODE_COUNT, RADIUS);
    const posArr = new Float32Array(NODE_COUNT * 3);
    verts.forEach((v, i) => {
      posArr[i * 3] = v.x;
      posArr[i * 3 + 1] = v.y;
      posArr[i * 3 + 2] = v.z;
    });

    const lineVerts: number[] = [];
    for (let i = 0; i < verts.length; i++) {
      for (let j = i + 1; j < verts.length; j++) {
        if (verts[i].distanceTo(verts[j]) < LINK_DISTANCE) {
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

    const wGeo = new THREE.SphereGeometry(RADIUS * 1.02, 48, 48);

    return { pointsGeo: pGeo, linesGeo: lGeo, outerWireGeo: wGeo };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const targetX = mouse.current.y * 0.55;
    const targetY = mouse.current.x * 0.9 + t * 0.06;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.04
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.04
    );

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.12;
      ringRef.current.rotation.x = Math.PI / 2 + mouse.current.y * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[RADIUS * 0.72, 32, 32]} />
        <meshBasicMaterial color="#27005d" transparent opacity={0.35} />
      </mesh>

      <lineSegments geometry={linesGeo}>
        <lineBasicMaterial color="#9400ff" transparent opacity={0.45} linewidth={1} />
      </lineSegments>

      <points geometry={pointsGeo}>
        <pointsMaterial
          size={0.055}
          color="#e4f1ff"
          transparent
          opacity={0.95}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <mesh geometry={outerWireGeo}>
        <meshBasicMaterial
          color="#aed2ff"
          wireframe
          transparent
          opacity={0.07}
        />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RADIUS * 1.35, 0.008, 8, 128]} />
        <meshBasicMaterial color="#9400ff" transparent opacity={0.5} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RADIUS * 1.55, 0.004, 8, 96]} />
        <meshBasicMaterial color="#aed2ff" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

interface HeroGlobeProps {
  mouse: MutableRefObject<{ x: number; y: number }>;
}

const HeroGlobe = ({ mouse }: HeroGlobeProps) => {
  return (
    <Canvas
      className="hero-globe-canvas"
      camera={{ position: [0, 0, 7.2], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <fog attach="fog" args={['#0a0e27', 5, 16]} />
      <ambientLight intensity={0.15} color="#aed2ff" />
      <pointLight position={[6, 4, 8]} intensity={2.5} color="#9400ff" />
      <pointLight position={[-6, -4, 4]} intensity={1.2} color="#aed2ff" />
      <pointLight position={[0, -6, 2]} intensity={0.8} color="#e4f1ff" />
      <Suspense fallback={null}>
        <NetworkGlobe mouse={mouse} />
      </Suspense>
    </Canvas>
  );
};

export default HeroGlobe;
