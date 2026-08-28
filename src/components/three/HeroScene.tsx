import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { HeroObject } from './HeroObject';
import { ThreeFallback } from './ThreeFallback';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useMousePosition } from '../../hooks/useMousePosition';

interface HeroSceneProps {
  className?: string;
}

export const HeroScene = ({ className = '' }: HeroSceneProps) => {
  const isMobile = useIsMobile();
  const mousePosition = useMousePosition();

  if (isMobile) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`}>
        <ThreeFallback />
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <color attach="background" args={['#0a1f33']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#94a3b8" />
        <Suspense fallback={<ThreeFallback />}>
          <HeroObject mousePosition={mousePosition} />
        </Suspense>
      </Canvas>
    </div>
  );
};
