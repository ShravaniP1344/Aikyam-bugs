import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

interface HeroObjectProps {
  mousePosition: { x: number; y: number };
}

export const HeroObject = ({ mousePosition }: HeroObjectProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const x = (mousePosition.x / window.innerWidth - 0.5) * 0.2;
      const y = (mousePosition.y / window.innerHeight - 0.5) * 0.2;
      meshRef.current.rotation.x = y + state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = x + state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1.6, 64, 64]}>
        <MeshTransmissionMaterial
          backside
          backsideThickness={4}
          thickness={2}
          roughness={0.1}
          metalness={0.1}
          ior={1.5}
          chromaticAberration={0.05}
          color="#0ea5e9"
          attenuationColor="#0ea5e9"
          attenuationDistance={3}
        />
      </Sphere>
    </Float>
  );
};
