import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isLowPowerDevice, prefersReducedMotion } from '../../lib/performance';
import './EventsField3D.css';

function EventHolograms() {
  const ring = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Group>(null);

  const particles = useMemo(() => {
    const arr = new Float32Array(24 * 3);
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const r = 2.2 + Math.random() * 0.8;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 1.2;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring.current) ring.current.rotation.z = t * 0.35;
    if (core.current) {
      core.current.rotation.y = t * 0.15;
      core.current.position.y = Math.sin(t * 0.4) * 0.08;
    }
  });

  return (
    <group ref={core}>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.4, 0.03, 12, 64]} />
        <meshBasicMaterial color="#9400ff" transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.85, 0.015, 8, 48]} />
        <meshBasicMaterial color="#6b8cff" transparent opacity={0.25} />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#e4f1ff" transparent opacity={0.5} sizeAttenuation />
      </points>
      <mesh position={[1.6, 0.4, 0.3]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="#9400ff" wireframe transparent opacity={0.2} />
      </mesh>
      <mesh position={[-1.4, -0.3, -0.5]} rotation={[0.5, 0.8, 0]}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshBasicMaterial color="#aed2ff" wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export default function EventsField3D() {
  if (prefersReducedMotion() || isLowPowerDevice()) return null;

  return (
    <div className="events-field-3d" aria-hidden>
      <Canvas
        camera={{ position: [0, 0.2, 5.5], fov: 42 }}
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 1.25]}
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <EventHolograms />
        </Suspense>
      </Canvas>
    </div>
  );
}
