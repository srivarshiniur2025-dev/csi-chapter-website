import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isLowPowerDevice, prefersReducedMotion } from '../../lib/performance';
import './AmbientNetwork3D.css';

const NODE_COUNT = 48;
const LINK_DIST = 1.35;

function FloatingNetwork() {
  const group = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, linePositions } = useMemo(() => {
    const verts: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      verts.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 7 - 2
        )
      );
    }
    const posArr = new Float32Array(NODE_COUNT * 3);
    verts.forEach((v, i) => {
      posArr[i * 3] = v.x;
      posArr[i * 3 + 1] = v.y;
      posArr[i * 3 + 2] = v.z;
    });

    const lineVerts: number[] = [];
    for (let i = 0; i < verts.length; i++) {
      for (let j = i + 1; j < verts.length; j++) {
        if (verts[i].distanceTo(verts[j]) < LINK_DIST) {
          lineVerts.push(verts[i].x, verts[i].y, verts[i].z, verts[j].x, verts[j].y, verts[j].z);
        }
      }
    }

    return {
      positions: posArr,
      linePositions: new Float32Array(lineVerts),
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.04;
      group.current.rotation.x = Math.sin(t * 0.08) * 0.06;
    }
    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.22 + Math.sin(t * 0.5) * 0.06;
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          color="#c77dff"
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#6b8cff" transparent opacity={0.28} depthWrite={false} />
      </lineSegments>
      <mesh position={[2.2, 1.1, -1]} rotation={[0.4, 0.6, 0.2]}>
        <icosahedronGeometry args={[0.35, 0]} />
        <meshBasicMaterial color="#9400ff" wireframe transparent opacity={0.12} />
      </mesh>
      <mesh position={[-2.5, -0.8, 0.5]} rotation={[0.2, -0.5, 0.4]}>
        <octahedronGeometry args={[0.28, 0]} />
        <meshBasicMaterial color="#aed2ff" wireframe transparent opacity={0.1} />
      </mesh>
      <mesh position={[0.5, -1.4, 1.2]} rotation={[-0.3, 0.2, 0.1]}>
        <torusGeometry args={[0.45, 0.02, 8, 24]} />
        <meshBasicMaterial color="#9400ff" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

export default function AmbientNetwork3D() {
  if (prefersReducedMotion() || isLowPowerDevice()) return null;

  return (
    <div className="ambient-network-3d" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 48 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.35]}
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <FloatingNetwork />
        </Suspense>
      </Canvas>
    </div>
  );
}
