import React, { useEffect, useRef } from 'react';
import { useScroll } from 'motion/react';

const frameCount = 240;
const imageFolder = '/ezgif-588729667e1d7c66-jpg'; // Now served from public folder
const imagePrefix = 'ezgif-frame-';
const imageExtension = '.jpg';

const currentFrame = (index: number) => (
  `${imageFolder}/${imagePrefix}${index.toString().padStart(3, '0')}${imageExtension}`
);

export default function ScrollAnimationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const images: HTMLImageElement[] = [];
    let firstFrameLoaded = false;
    let currentFrameIndex = 1;

    const renderFrame = (index: number) => {
      if (images[index] && images[index].complete) {
        const img = images[index];
        
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawWidth = canvas.height * imgRatio;
          drawHeight = canvas.height;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        }

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      renderFrame(currentFrameIndex);
    };

    window.addEventListener('resize', resizeCanvas);

    const loadImages = () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        
        if (i === 1) {
          img.onload = () => {
            firstFrameLoaded = true;
            resizeCanvas();
          };
        }
        
        images.push(img);
      }
    };

    loadImages();

    // Subscribe to framer motion scroll progress
    const unsubscribe = scrollYProgress.on("change", (latest) => {
       currentFrameIndex = Math.min(
         frameCount - 1,
         Math.floor(latest * frameCount)
       );
       if (firstFrameLoaded) {
         requestAnimationFrame(() => {
           renderFrame(currentFrameIndex);
         });
       }
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      unsubscribe();
    };
  }, [scrollYProgress]);

  return (
    <div className="fixed inset-0 w-screen h-screen z-[-1] bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
