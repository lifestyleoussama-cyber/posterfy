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

// 👇 Watermark function turned into a no-op
export const generateLogoWatermark = (fillColor, width = 500, height = 134) => {
  // Do nothing – watermark removed
  return '';
};

export default LogoName;
