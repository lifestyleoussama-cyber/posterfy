import { useRef, useEffect } from 'react';
// ⛔ Removed watermark import
// import { generateLogoWatermark } from '../svgs/LogoName.jsx';

const CanvasPoster = ({ onImageReady, posterData, generatePoster, onTitleSizeAdjust, customFont }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const generatePosterContent = async () => {
      if (!generatePoster) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = 2480;
      const height = 3508;

      // parse posterData values
      posterData.marginSide = parseInt(posterData.marginSide) || 0;
      posterData.marginTop = parseInt(posterData.marginTop) || 0;
      posterData.marginCover = parseInt(posterData.marginCover) || 0;
      posterData.marginBackground = parseInt(posterData.marginBackground) || 0;

      // load cover image
      const loadCover = async (url) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = url;
        return new Promise((resolve) => {
          image.onload = () => {
            ctx.drawImage(
              image,
              posterData.marginCover,
              posterData.marginCover,
              width - posterData.marginCover * 2,
              height - posterData.marginCover * 2
            );
            resolve();
          };
          // fallback if image fails
          image.onerror = () => resolve();
        });
      };

      // draw poster content
      if (posterData.albumCover) {
        await loadCover(posterData.albumCover);
      }

      // ⛔ Removed watermark here
      // generateLogoWatermark(ctx, posterData, width, height);

      // ✅ Instead: trigger finish signal
      if (onImageReady) {
        onImageReady(canvas.toDataURL("image/png"));
      }
    };

    generatePosterContent();
  }, [generatePoster, posterData, onImageReady, customFont, onTitleSizeAdjust]);

  return (
    <canvas
      ref={canvasRef}
      width={2480}
      height={3508}
      style={{ display: 'none' }} // stays hidden, export used for poster
    />
  );
};

export default CanvasPoster;
