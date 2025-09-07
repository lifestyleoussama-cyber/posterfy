/* eslint-disable react/prop-types */

function LogoName({ width, height, fill }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 152 38"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* watermark intentionally disabled */}
    </svg>
  );
}

// 👇 Fake watermark: keeps render pipeline alive
export const generateLogoWatermark = (ctx, posterData, width, height) => {
  // Do nothing visual — just force finish step
  // Example: trigger a tiny invisible dot so ctx.draw() runs
  ctx.fillStyle = "rgba(0,0,0,0)";   // fully transparent
  ctx.fillRect(0, 0, 1, 1);          // 1px transparent square
};

export default LogoName;
