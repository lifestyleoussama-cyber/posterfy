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

// 👇 Safe no-op: accepts ctx + params, but does nothing
export const generateLogoWatermark = (ctx, posterData, width, height) => {
  // keep function signature intact, but skip drawing
  // this way render sequence still "completes"
  return;
};

export default LogoName;
