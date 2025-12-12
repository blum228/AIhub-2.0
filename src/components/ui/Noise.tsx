import { useRef, useEffect, type FC } from 'react';

interface NoiseProps {
  /** Размер паттерна шума */
  patternSize?: number;
  /** Масштаб по X */
  patternScaleX?: number;
  /** Масштаб по Y */
  patternScaleY?: number;
  /** Интервал обновления (в кадрах) */
  patternRefreshInterval?: number;
  /** Прозрачность шума (0-255) */
  patternAlpha?: number;
  /** Дополнительные классы */
  className?: string;
}

const Noise: FC<NoiseProps> = ({
  patternSize = 250,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 15,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let animationId: number;
    const canvasSize = patternSize * 4;

    const resize = () => {
      canvas.width = canvasSize;
      canvas.height = canvasSize;
    };

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;     // R
        data[i + 1] = value; // G
        data[i + 2] = value; // B
        data[i + 3] = patternAlpha; // A
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      if (frame % patternRefreshInterval === 0) {
        drawGrain();
      }
      frame++;
      animationId = requestAnimationFrame(loop);
    };

    resize();
    loop();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [patternSize, patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      ref={canvasRef}
      className={`noise-overlay ${className}`}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        imageRendering: 'pixelated',
        transform: `scale(${patternScaleX}, ${patternScaleY})`,
      }}
    />
  );
};

export default Noise;
