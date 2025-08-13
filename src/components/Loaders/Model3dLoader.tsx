import { motion, type Transition } from "motion/react";

const Model3dLoader = () => {
  const size = 64; // Tailwind: w-16, h-16
  const halfSize = size / 2;

  // Animation for each face to go from flat to its cube position
  const faceTransition: Transition = {
    duration: 2,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "reverse", // morph back to a square
  };

  return (
    // Perspective wrapper for the 3D effect
    <motion.div style={{ perspective: 1000 }}>
      {/* Rotates the entire cube */}
      <motion.div
        className="relative"
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateX: -30, rotateY: -45 }}
        transition={{
          duration: 8,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {/* Front Face */}
        <motion.div
          className="absolute w-full h-full bg-transparent border-2 border-gray-800"
          animate={{
            transform: [
              `rotateY(0deg) translateZ(0px)`,
              `rotateY(0deg) translateZ(${halfSize}px)`,
            ],
          }}
          transition={faceTransition}
        />
        {/* Back Face */}
        <motion.div
          className="absolute w-full h-full bg-transparent border-2 border-gray-800"
          animate={{
            transform: [
              `rotateY(0deg) translateZ(0px)`,
              `rotateY(180deg) translateZ(${halfSize}px)`,
            ],
          }}
          transition={faceTransition}
        />
        {/* Left Face */}
        <motion.div
          className="absolute w-full h-full bg-transparent border-2 border-gray-800"
          animate={{
            transform: [
              `rotateY(0deg) translateZ(0px)`,
              `rotateY(-90deg) translateZ(${halfSize}px)`,
            ],
          }}
          transition={faceTransition}
        />
        {/* Right Face */}
        <motion.div
          className="absolute w-full h-full bg-transparent border-2 border-gray-800"
          animate={{
            transform: [
              `rotateY(0deg) translateZ(0px)`,
              `rotateY(90deg) translateZ(${halfSize}px)`,
            ],
          }}
          transition={faceTransition}
        />
        {/* Top Face */}
        <motion.div
          className="absolute w-full h-full bg-transparent border-2 border-gray-800"
          animate={{
            transform: [
              `rotateX(0deg) translateZ(0px)`,
              `rotateX(90deg) translateZ(${halfSize}px)`,
            ],
          }}
          transition={faceTransition}
        />
        {/* Bottom Face */}
        <motion.div
          className="absolute w-full h-full bg-transparent border-2 border-gray-800"
          animate={{
            transform: [
              `rotateX(0deg) translateZ(0px)`,
              `rotateX(-90deg) translateZ(${halfSize}px)`,
            ],
          }}
          transition={faceTransition}
        />
      </motion.div>
    </motion.div>
  );
};

export default Model3dLoader;
